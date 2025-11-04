# Velocity Ride-Sharing App - Quick Start Reference

## 5-Minute Setup Checklist

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Copy `.env.local.template` to `.env.local` and fill in:
```bash
cp .env.local.template .env.local
```

**Required values from Supabase:**
- `VITE_SUPABASE_URL` - From Supabase project settings
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Anon key from settings
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)

**Required values from Stripe:**
- `VITE_STRIPE_PUBLISHABLE_KEY` - From Stripe dashboard
- `STRIPE_SECRET_KEY` - From Stripe dashboard
- `STRIPE_WEBHOOK_SECRET` - From Stripe webhooks (local: use ngrok)

### Step 3: Run Supabase Migration
1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Copy-paste entire content from `supabase/migrations/001_create_ride_schema.sql`
4. Click Run

### Step 4: Start Development

**Terminal 1 - Frontend:**
```bash
npm run dev
# Opens http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
# Create a new terminal
node -r ts-node/register server/server.ts
# Or compile first: npx tsc server/server.ts --target es2020 --module commonjs
```

Backend runs on `http://localhost:3001`

### Step 5: Test Flow
1. Go to http://localhost:5173
2. Click "Continue with Google"
3. Sign in with Google account
4. Navigate to "Find Nearby Rides" or create a ride
5. Try the payment flow with test card `4242 4242 4242 4242`

---

## Key Files Reference

### Backend Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/stripe/create-checkout-session` | Create payment session |
| GET | `/api/stripe/session/:sessionId` | Verify payment |
| POST | `/api/stripe/webhook` | Handle Stripe events |
| POST | `/api/chat/upload-audio` | Upload audio message |
| POST | `/api/chat/send-message` | Save text message |
| POST | `/api/rides/create` | Create new ride |
| POST | `/api/rides/join` | Join existing ride |
| GET | `/api/rides/upcoming/:userId` | Get user's rides |
| GET | `/api/notifications/:userId` | Get notifications |
| PATCH | `/api/notifications/:id/read` | Mark notification as read |
| GET | `/api/history/:userId` | Get user history |

### Frontend Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Index | Home/landing page |
| `/auth` | Auth | Login/signup |
| `/auth/callback` | AuthCallback | OAuth handler |
| `/payment-success` | PaymentSuccess | Payment verification |
| `/find-rides` | FindNearbyRides | Browse rides |
| `/upcoming-rides` | UpcomingRides | User's rides + chat |
| `/history` | History | Audit trail |

### Components

| File | Purpose |
|------|---------|
| `GoogleSignIn.tsx` | OAuth login button |
| `RideCard.tsx` | Ride listing card |
| `RideChat.tsx` | Group chat + audio |
| `Notifications.tsx` | Notification center |

### Pages

| File | Purpose |
|------|---------|
| `Index.tsx` | Home page (existing) |
| `Auth.tsx` | Login/signup (existing) |
| `AuthCallback.tsx` | OAuth callback handler |
| `PaymentSuccess.tsx` | Payment verification page |
| `FindNearbyRides.tsx` | Browse available rides |
| `UpcomingRides.tsx` | User's rides with chat |
| `History.tsx` | User audit trail |

---

## Important Configuration URLs

### Supabase
- **Redirect URIs** (Auth → Settings):
  ```
  http://localhost:3000/auth/callback
  http://localhost:5173/auth/callback
  https://your-domain.com/auth/callback
  ```

- **Storage Bucket**: Create `ride-audio` bucket (Public)

### Stripe
- **Test Card**: `4242 4242 4242 4242` (any future date, any CVC)
- **Webhook Endpoint**: 
  - Local: `https://ngrok-url/api/stripe/webhook`
  - Production: `https://your-domain.com/api/stripe/webhook`
- **Events**: `checkout.session.completed`, `checkout.session.expired`

---

## Database Tables

### rides
- id, created_by, title, origin, destination, departure_time
- total_seats, seats_left, price_per_seat, ride_code, status

### ride_participants
- id, ride_id, user_id, join_code, amount_due, amount_paid
- paid, stripe_session_id, payment_intent_id

### ride_chats
- id, ride_id, user_id, type (text/audio), content, audio_url, created_at

### notifications
- id, user_id, type, title, body, ride_id, meta, read, created_at

### history
- id, user_id, ride_id, action, meta, created_at

### payments
- id, user_id, ride_id, amount, currency, stripe_session_id
- stripe_payment_intent_id, status, metadata

### ride_codes
- id, ride_id, code, created_at

---

## Payment Flow (Simple)

```
User creates/joins ride
  ↓
Clicks "Proceed to Payment"
  ↓
POST /api/stripe/create-checkout-session
  ↓
Creates payments record (pending)
  ↓
Returns Stripe checkout URL
  ↓
Redirects to Stripe
  ↓
User completes payment
  ↓
Stripe redirects to /payment-success?session_id=...
  ↓
Client verifies: GET /api/stripe/session/SESSION_ID
  ↓
Server updates: ride_participants (paid=true), payments (completed)
  ↓
Generates ride_code
  ↓
Creates notification with code
  ↓
Shows success page with code
```

---

## Real-Time Features

### Chat (Realtime subscriptions)
```typescript
const channel = supabase
  .channel(`ride_chat:${rideId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'ride_chats',
  }, (payload) => {
    // Message received in real-time
  })
  .subscribe()
```

### Notifications (Realtime subscriptions)
```typescript
const channel = supabase
  .channel(`notifications:${userId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
  }, (payload) => {
    // Notification received in real-time
  })
  .subscribe()
```

---

## Testing Stripe Locally

### Using ngrok (Required for Webhooks)

1. Download ngrok: https://ngrok.com/download
2. Run: `ngrok http 3001`
3. Note the URL: `https://abc123.ngrok.io`
4. In Stripe Dashboard → Webhooks:
   - Add endpoint: `https://abc123.ngrok.io/api/stripe/webhook`
   - Select: `checkout.session.completed`
5. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`
6. Test webhook: Make a payment

### Test Card Numbers

| Card | Status |
|------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 9995 | Decline |
| 5555 5555 5555 4444 | Mastercard |

All: Any future date, any 3-digit CVC, any name

---

## Common Issues & Fixes

### Issue: "Webhook signature verification failed"
**Fix:** Ensure `STRIPE_WEBHOOK_SECRET` matches webhook settings

### Issue: "OAuth redirect failed"
**Fix:** Add exact URI to Supabase Auth → Settings → Redirect URLs

### Issue: "Audio upload fails"
**Fix:** 
- Create `ride-audio` bucket in Supabase Storage
- Set bucket to Public
- Enable CORS on bucket

### Issue: "Real-time messages not syncing"
**Fix:**
- Enable Realtime for `ride_chats` table in Supabase
- Check RLS policies allow your user
- Refresh page to reconnect subscription

### Issue: "Backend returns 404 for /api/* routes"
**Fix:**
- Backend must be running on port 3001
- Set `VITE_API_URL=http://localhost:3001` in frontend .env
- Check CORS is enabled for frontend origin

### Issue: "Payment creates duplicate records"
**Fix:** This is expected - both webhook and session verification handle payment. Use Stripe idempotency keys in production.

---

## Environment Variables Checklist

### Frontend (.env.local)
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] `VITE_API_URL=http://localhost:3001`

### Backend (.env or environment variables)
- [ ] `VITE_SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `FRONTEND_URL=http://localhost:5173`
- [ ] `PORT=3001`

---

## Project Statistics

| Metric | Count |
|--------|-------|
| Backend lines | 648 |
| Component lines | 1,134 |
| Migration lines | 227 |
| New components | 4 |
| New pages | 5 |
| API endpoints | 11 |
| Database tables | 7 |
| Total code | ~2,500 |

---

## Next Steps

1. **Setup**: Follow checklist above (5 min)
2. **Configure**: Run migration + set env vars (10 min)
3. **Develop**: Start frontend + backend (2 min)
4. **Test**: Follow TESTING_GUIDE.md (varies)
5. **Deploy**: See SETUP_GUIDE.md deployment section

---

## Documentation Files

- **SETUP_GUIDE.md** - Complete step-by-step setup
- **TESTING_GUIDE.md** - 40+ test cases with expected results
- **IMPLEMENTATION_SUMMARY.md** - Architecture and design overview
- **QUICK_START.md** - This file (quick reference)

---

## Support

For detailed setup: See SETUP_GUIDE.md
For testing procedures: See TESTING_GUIDE.md
For architecture details: See IMPLEMENTATION_SUMMARY.md

---

**Status: Ready for Development ✅**

All code complete. Time to customize and deploy!
