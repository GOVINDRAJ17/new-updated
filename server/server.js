import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL || "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.raw({ type: "application/json" }));

function generateRideCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function createNotification(
  userId,
  type,
  title,
  body,
  rideId,
  meta
) {
  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      type,
      title,
      body,
      ride_id: rideId,
      meta: meta || null,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

async function logUserAction(
  userId,
  action,
  rideId,
  meta
) {
  try {
    await supabase.from("history").insert({
      user_id: userId,
      ride_id: rideId,
      action,
      meta: meta || null,
    });
  } catch (error) {
    console.error("Error creating history entry:", error);
  }
}

app.post("/api/stripe/create-checkout-session", async (req, res) => {
  try {
    const {
      rideId,
      userId,
      amount,
      currency = "INR",
      quantity = 1,
      driverEmail,
      rideTitle,
    } = req.body;

    if (!rideId || !userId || !amount) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: rideTitle || `Ride ${rideId}`,
              description: `Payment for ride booking`,
            },
            unit_amount: amount,
          },
          quantity,
        },
      ],
      success_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment-cancelled`,
      customer_email: driverEmail,
      metadata: {
        rideId,
        userId,
      },
    });

    await supabase.from("payments").insert({
      user_id: userId,
      ride_id: rideId,
      amount,
      currency,
      stripe_session_id: session.id,
      status: "pending",
      metadata: {
        quantity,
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

app.get("/api/stripe/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const rideId = session.metadata?.rideId;
      const userId = session.metadata?.userId;

      const { data: participant } = await supabase
        .from("ride_participants")
        .select("*")
        .eq("ride_id", rideId)
        .eq("user_id", userId)
        .single();

      if (participant) {
        await supabase
          .from("ride_participants")
          .update({
            paid: true,
            stripe_session_id: sessionId,
            amount_paid: participant.amount_due || 0,
          })
          .eq("id", participant.id);

        await supabase
          .from("payments")
          .update({
            status: "completed",
            stripe_payment_intent_id: session.payment_intent,
          })
          .eq("stripe_session_id", sessionId);

        const rideCode = generateRideCode(6);
        await supabase
          .from("ride_codes")
          .upsert({
            ride_id: rideId,
            code: rideCode,
          });

        await createNotification(
          userId,
          "payment_received",
          "Booking Confirmed!",
          `Your ride code: ${rideCode} - Use this to join the ride chat.`,
          rideId,
          { rideCode }
        );

        await logUserAction(userId, "payment", rideId, {
          amount: participant.amount_due,
          sessionId,
        });
      }

      res.json({
        status: "completed",
        rideId,
        userId,
      });
    } else {
      res.json({ status: session.payment_status });
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: "Failed to retrieve session" });
  }
});

app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const rideId = session.metadata && session.metadata.rideId;
      const userId = session.metadata && session.metadata.userId;

      if (rideId && userId) {
        const { data: participant } = await supabase
          .from("ride_participants")
          .select("*")
          .eq("ride_id", rideId)
          .eq("user_id", userId)
          .single();

        if (participant) {
          await supabase
            .from("ride_participants")
            .update({
              paid: true,
              stripe_session_id: session.id,
              amount_paid: participant.amount_due || 0,
            })
            .eq("id", participant.id);

          await supabase
            .from("payments")
            .update({
              status: "completed",
              stripe_payment_intent_id: session.payment_intent,
            })
            .eq("stripe_session_id", session.id);

          const rideCode = generateRideCode(6);
          await supabase
            .from("ride_codes")
            .upsert({
              ride_id: rideId,
              code: rideCode,
            });

          await createNotification(
            userId,
            "payment_received",
            "Booking Confirmed!",
            `Your ride code: ${rideCode} - Use this to join the ride chat.`,
            rideId,
            { rideCode }
          );

          await logUserAction(userId, "payment", rideId, {
            amount: participant.amount_due,
            sessionId: session.id,
          });
        }
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const rideId = session.metadata && session.metadata.rideId;

      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("stripe_session_id", session.id);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook Error`);
  }
});

app.post(
  "/api/chat/upload-audio",
  upload.single("audio"),
  async (req, res) => {
    try {
      const { rideId, userId } = req.body;
      const audioBuffer = req.file?.buffer;

      if (!rideId || !userId || !audioBuffer) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const fileName = `audio/${rideId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.webm`;

      const { data, error } = await supabase.storage
        .from("ride-audio")
        .upload(fileName, audioBuffer, {
          contentType: "audio/webm",
        });

      if (error) {
        return res.status(500).json({ error: "Failed to upload audio" });
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("ride-audio").getPublicUrl(data.path);

      const { error: chatError } = await supabase.from("ride_chats").insert({
        ride_id: rideId,
        user_id: userId,
        type: "audio",
        audio_url: publicUrl,
      });

      if (chatError) {
        return res.status(500).json({ error: "Failed to create chat message" });
      }

      res.json({
        success: true,
        audioUrl: publicUrl,
        message: "Audio uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading audio:", error);
      res.status(500).json({ error: "Failed to process audio upload" });
    }
  }
);

app.post("/api/chat/send-message", async (req, res) => {
  try {
    const { rideId, userId, content } = req.body;

    if (!rideId || !userId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("ride_chats")
      .insert({
        ride_id: rideId,
        user_id: userId,
        type: "text",
        content,
      })
      .select();

    if (error) {
      return res.status(500).json({ error: "Failed to save message" });
    }

    res.json({
      success: true,
      message: data?.[0],
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.post("/api/rides/create", async (req, res) => {
  try {
    const {
      userId,
      title,
      origin,
      destination,
      departureTime,
      totalSeats,
      pricePerSeat,
    } = req.body;

    if (
      !userId ||
      !title ||
      !origin ||
      !destination ||
      !departureTime ||
      !totalSeats ||
      pricePerSeat === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const rideCode = generateRideCode(6);

    const { data, error } = await supabase
      .from("rides")
      .insert({
        created_by: userId,
        title,
        origin,
        destination,
        departure_time: departureTime,
        total_seats: totalSeats,
        seats_left: totalSeats,
        price_per_seat: pricePerSeat,
        ride_code: rideCode,
        status: "active",
      })
      .select();

    if (error) {
      return res.status(500).json({ error: "Failed to create ride" });
    }

    const rideId = data?.[0]?.id;

    await supabase.from("ride_codes").insert({
      ride_id: rideId,
      code: rideCode,
    });

    await createNotification(
      userId,
      "ride_created",
      "Ride Created!",
      `Your ride from ${origin} to ${destination} is now live.`,
      rideId,
      { origin, destination, rideCode }
    );

    await createHistoryEntry(userId, "create_ride", rideId, {
      origin,
      destination,
      totalSeats,
      pricePerSeat,
    });

    res.json({
      success: true,
      ride: data?.[0],
      rideCode,
    });
  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ error: "Failed to create ride" });
  }
});

app.post("/api/rides/join", async (req, res) => {
  try {
    const { rideId, userId, amountDue } = req.body;

    if (!rideId || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: rideData, error: rideError } = await supabase
      .from("rides")
      .select("*")
      .eq("id", rideId)
      .single();

    if (rideError || !rideData) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (rideData.seats_left <= 0) {
      return res.status(400).json({ error: "No seats available" });
    }

    const joinCode = generateRideCode(8);

    const { data: participantData, error: participantError } = await supabase
      .from("ride_participants")
      .insert({
        ride_id: rideId,
        user_id: userId,
        join_code: joinCode,
        amount_due: amountDue || rideData.price_per_seat,
        paid: false,
      })
      .select();

    if (participantError) {
      return res.status(500).json({ error: "Failed to join ride" });
    }

    await supabase
      .from("rides")
      .update({
        seats_left: rideData.seats_left - 1,
      })
      .eq("id", rideId);

    await createNotification(
      userId,
      "ride_joined",
      "Joined Ride!",
      `You have joined a ride from ${rideData.origin} to ${rideData.destination}.`,
      rideId,
      { origin: rideData.origin, destination: rideData.destination }
    );

    await createHistoryEntry(userId, "join_ride", rideId, {
      amountDue: amountDue || rideData.price_per_seat,
    });

    res.json({
      success: true,
      participant: participantData?.[0],
      joinCode,
    });
  } catch (error) {
    console.error("Error joining ride:", error);
    res.status(500).json({ error: "Failed to join ride" });
  }
});

app.get("/api/rides/upcoming/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("rides")
      .select(
        `
        id,
        title,
        origin,
        destination,
        departure_time,
        total_seats,
        seats_left,
        price_per_seat,
        ride_code,
        status,
        created_by,
        created_at
      `
      )
      .or(
        `created_by.eq.${userId},ride_participants.user_id.eq.${userId}`
      );

    if (error) {
      return res.status(500).json({ error: "Failed to fetch rides" });
    }

    res.json({ rides: data || [] });
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({ error: "Failed to fetch rides" });
  }
});

app.get("/api/notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return res.status(500).json({ error: "Failed to fetch notifications" });
    }

    res.json({ notifications: data || [] });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

app.patch(
  "/api/notifications/:notificationId/read",
  async (req, res) => {
    try {
      const { notificationId } = req.params;

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) {
        return res.status(500).json({ error: "Failed to update notification" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(500).json({ error: "Failed to update notification" });
    }
  }
);

app.get("/api/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: "Failed to fetch history" });
    }

    res.json({ history: data || [] });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
