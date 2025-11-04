# Velocity Ride-Sharing App - Complete Setup Guide

## Table of Contents
1. [Database Setup](#database-setup)
2. [Supabase Configuration](#supabase-configuration)
3. [Stripe Setup](#stripe-setup)
4. [Backend Server Setup](#backend-server-setup)
5. [Frontend Configuration](#frontend-configuration)
6. [Local Development](#local-development)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## Database Setup

### 1. Run Supabase Migrations

Copy the entire SQL migration from `supabase/migrations/001_create_ride_schema.sql` and execute it in your Supabase SQL Editor:

1. Go to **Supabase Dashboard** → Your Project → **SQL Editor**
2. Click **New Query**
3. Paste the entire SQL migration content
4. Click **Run**

This will create:
- `rides` - ride listings
- `ride_participants` - users who joined rides
- `ride_chats` - real-time chat messages (text & audio)
- `notifications` - user notifications
- `history` - audit log of user actions
- `payments` - payment records
- `ride_codes` - generated ride codes

### 2. Enable Realtime

In **Supabase Dashboard → Replication** (under Database), ensure these tables have Realtime enabled:
- `ride_chats`
- `notifications`

---

## Supabase Configuration

### 1. Google OAuth Setup

1. **In Supabase Console**:
   - Go to **Auth → Settings → OAuth Providers**
   - Find **Google** and enable it
   - You'll see a generated OAuth ID - keep this for later

2. **Create Google OAuth Credentials**:
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create new OAuth 2.0 Credentials (Desktop/Web Application)
   - Add Authorized Redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback?provider=google
     ```
   - Copy Client ID and Client Secret

3. **Add to Supabase**:
   - In Supabase Console, add:
     - **Client ID**: Your Google OAuth Client ID
     - **Client Secret**: Your Google OAuth Client Secret

### 2. Configure Redirect URIs

In **Supabase → Auth → Settings → Redirect URLs**, add:

**Local Development:**
```
http://localhost:3000/auth/callback
http://localhost:5173/auth/callback
```

**Production:**
```
https://yourdomain.com/auth/callback
```

### 3. Create Storage Bucket for Audio

1. Go to **Storage** in Supabase
2. Click **Create a new bucket**
3. Name it `ride-audio`
4. Set it to **Public**
5. Click **Create bucket**

---

## Stripe Setup

### 1. Create Stripe Account

1. Sign up at [Stripe.com](https://stripe.com)
2. Go to **Dashboard → API keys**
3. Copy **Publishable Key** and **Secret Key**

### 2. Create Webhook Endpoint

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **Add endpoint**
3. **For Local Development** (using ngrok):
   - Run: `ngrok http 3001`
   - Endpoint URL: `https://your-ngrok-url.ngrok.io/api/stripe/webhook`
4. **For Production**:
   - Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
5. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
6. Click **Add endpoint**
7. View endpoint details and copy **Signing secret** (starts with `whsec_`)

### 3. Environment Variables

Add to your `.env` file:
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Never commit these keys!** Use environment variables only.

---

## Backend Server Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - REST API server
- `stripe` - Stripe integration
- `cors` - Cross-origin requests
- `multer` - File uploads (audio)
- `dotenv` - Environment variables

### 2. Create Server Environment File

Create `.env` in root directory (copy from `.env.local.template`):

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Server
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Server Endpoints

The server (`server/server.ts`) provides these endpoints:

#### Payment Endpoints
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout
- `GET /api/stripe/session/:sessionId` - Verify payment
- `POST /api/stripe/webhook` - Stripe webhook handler

#### Chat Endpoints
- `POST /api/chat/upload-audio` - Upload audio message
- `POST /api/chat/send-message` - Send text message

#### Ride Endpoints
- `POST /api/rides/create` - Create new ride
- `POST /api/rides/join` - Join existing ride
- `GET /api/rides/upcoming/:userId` - Get user's rides

#### Notifications
- `GET /api/notifications/:userId` - Get notifications
- `PATCH /api/notifications/:notificationId/read` - Mark as read

#### History
- `GET /api/history/:userId` - Get user history

---

## Frontend Configuration

### 1. Environment Variables

Create `.env.local` in root:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# API
VITE_API_URL=http://localhost:3001
```

### 2. Key Components

#### Google Sign-In
- Component: `src/components/GoogleSignIn.tsx`
- Usage: Add to Auth page for OAuth
- Redirects to: `/auth/callback`

#### Payment Flow
- User clicks "Join Ride"
- Opens confirmation dialog with split cost option
- Redirects to Stripe Checkout
- After payment: redirects to `/payment-success?session_id=...`
- Server verifies payment and creates notifications

#### Real-Time Chat
- Component: `src/components/RideChat.tsx`
- Features:
  - Text messages (real-time via Supabase)
  - Audio recording (push-to-talk)
  - Auto-scroll to latest messages
  - User name display

#### Notifications
- Component: `src/components/Notifications.tsx`
- Shows unread badge in navbar
- Real-time updates via Supabase Realtime
- Displays ride codes, payment confirmations, etc.

#### History
- Page: `src/pages/History.tsx`
- Filter by action (create, join, payment)
- Download as CSV
- Shows full audit trail

---

## Local Development

### 1. Start Both Servers

**Terminal 1 - Frontend (Vite):**
```bash
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 - Backend (Express):**
```bash
npm run server
# Runs on http://localhost:3001
```

### 2. Using ngrok for Stripe Webhooks (Local)

**Terminal 3:**
```bash
# Install ngrok: https://ngrok.com/download
ngrok http 3001

# Output:
# Forwarding https://abc123.ngrok.io -> http://localhost:3001
```

Update Stripe webhook to: `https://abc123.ngrok.io/api/stripe/webhook`

### 3. Local Testing URLs

| Feature | URL |
|---------|-----|
| App Home | http://localhost:5173 |
| Auth Page | http://localhost:5173/auth |
| Payment Success | http://localhost:5173/payment-success |
| Upcoming Rides | http://localhost:5173/upcoming-rides |
| Find Rides | http://localhost:5173/find-rides |
| History | http://localhost:5173/history |
| Backend API | http://localhost:3001/api/* |

---

## Testing

### 1. Test Google Sign-In

1. Go to http://localhost:5173/auth
2. Click "Continue with Google"
3. Sign in with Google account
4. Should redirect to `/auth/callback`
5. Verify you're logged in (check navbar)

### 2. Test Create Ride

1. Sign in
2. Navigate to home page
3. Scroll to "Create a Ride" section
4. Fill form and submit
5. Should create notification with ride code

### 3. Test Join Ride & Payment

1. Create a ride (from another account or use existing)
2. Go to "Find Nearby Rides"
3. Click "Join Ride"
4. Select "Split Cost" option
5. Click "Proceed to Payment"
6. Use Stripe test card: `4242 4242 4242 4242`, any future date, any CVC
7. Should redirect to payment success page with ride code

### 4. Test Chat & Audio

1. Join a ride
2. Go to "Upcoming Rides" and select the ride
3. Chat panel opens on right
4. Send text message (appears in real-time)
5. Hold mic button to record audio (max 30s)
6. Release to upload
7. Audio plays in chat

### 5. Test Notifications

1. Create/join rides
2. Click bell icon in navbar
3. See notifications with ride codes
4. Click notification to mark as read
5. Check "Mark all as read"

### 6. Test History

1. Perform several ride actions (create, join, payment)
2. Go to /history
3. Filter by action type
4. Download CSV
5. Verify data exports correctly

### Stripe Test Cards

| Card | Use Case |
|------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Decline test |
| 5555 5555 5555 4444 | Mastercard test |

All use: Any future date, any CVC, any name

---

## Deployment

### 1. Frontend (Vite) - Vercel

```bash
npm run build
# Deploy dist/ folder to Vercel
```

**Vercel Environment Variables:**
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_STRIPE_PUBLISHABLE_KEY=...
VITE_API_URL=https://your-api-domain.com
```

### 2. Backend (Node.js) - Heroku / Railway / Render

```bash
# Deploy server/server.ts
# Set environment variables in hosting platform
```

**Required Environment Variables:**
```
VITE_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
FRONTEND_URL=https://your-frontend-domain.com
PORT=3001
```

### 3. Update Supabase Redirect URIs

Add production URLs:
```
https://your-frontend-domain.com/auth/callback
```

### 4. Update Stripe Webhook

Change webhook endpoint to:
```
https://your-api-domain.com/api/stripe/webhook
```

---

## Security Checklist

- [ ] Never commit `.env` file (use .gitignore)
- [ ] Stripe webhook secret is kept secret
- [ ] Supabase Service Role Key only on backend
- [ ] RLS policies enabled on all tables
- [ ] API endpoints validate user ownership
- [ ] CORS configured for production domain only
- [ ] SSL/HTTPS enforced in production
- [ ] Database backups enabled
- [ ] Rate limiting on payment endpoints

---

## Troubleshooting

### Issue: "Webhook failed to parse" in Stripe
**Solution:** Ensure `STRIPE_WEBHOOK_SECRET` is correct and matches exact webhook endpoint

### Issue: Audio upload fails
**Solution:** Check Supabase storage bucket `ride-audio` is public and CORS enabled

### Issue: Google sign-in redirect fails
**Solution:** Verify redirect URI in Supabase matches OAuth provider config

### Issue: Real-time chat not updating
**Solution:** Ensure Realtime is enabled for `ride_chats` table in Supabase

### Issue: Payment creates duplicate records
**Solution:** Both webhook AND session verification create records - handle in production with idempotency keys

---

## Additional Features to Consider

1. **Email Notifications** - Send email on ride creation/payment using SendGrid/Mailgun
2. **SMS Notifications** - Twilio for SMS updates
3. **Maps Integration** - Google Maps API for distance/direction
4. **Driver Rating** - Add reviews/ratings system
5. **Refunds** - Implement Stripe refunds flow
6. **Advanced Search** - Elasticsearch for better ride discovery
7. **Mobile App** - React Native version
8. **Admin Dashboard** - View all rides, payments, users

---

## Support Resources

- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
