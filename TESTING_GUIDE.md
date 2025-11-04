# Velocity Ride-Sharing App - Testing Guide

## Test Environment Setup

### Prerequisites
- Supabase project created and configured
- Stripe account with test mode enabled
- Backend server running (`npm run server`)
- Frontend running (`npm run dev`)
- ngrok tunnel for local webhook testing (optional)

### Test Data
- Use Stripe test cards (numbers below)
- Create multiple test user accounts
- Test on both desktop and mobile browsers

---

## Feature Test Cases

### 1. Google Authentication

#### Test 1.1: Sign Up with Google
**Steps:**
1. Navigate to http://localhost:5173/auth
2. Click "Continue with Google"
3. Complete Google authentication flow
4. Verify redirect to home page

**Expected Results:**
- User is authenticated
- Navbar shows user info (if implemented)
- Profile created in Supabase `profiles` table
- Session persists after refresh

**Acceptance Criteria:**
- ✓ OAuth flow completes without errors
- ✓ User session created in Supabase
- ✓ Profile record created
- ✓ Can access protected pages

---

#### Test 1.2: Auth Callback Handling
**Steps:**
1. Complete Google sign-in flow
2. Verify redirect to `/auth/callback`
3. Wait for redirect to home page

**Expected Results:**
- Auth callback processes session correctly
- No errors displayed
- User is logged in
- Redirects to home within 5 seconds

**Acceptance Criteria:**
- ✓ `/auth/callback` handles OAuth session
- ✓ Profile is created/updated
- ✓ Smooth redirect to app

---

#### Test 1.3: Sign Out
**Steps:**
1. Sign in with Google
2. Find sign out button (in settings/profile)
3. Click to sign out
4. Verify redirect to auth page

**Expected Results:**
- Session is cleared
- User redirected to auth page
- Cannot access protected routes

**Acceptance Criteria:**
- ✓ Sign out clears session
- ✓ Protected routes redirect to auth

---

### 2. Create Ride

#### Test 2.1: Create Ride Form Submission
**Steps:**
1. Sign in as User A
2. Navigate to home page
3. Fill "Create a Ride" form:
   - Title: "Downtown to Airport"
   - From: "Downtown Station"
   - To: "International Airport"
   - Departure Time: Tomorrow 10:00 AM
   - Available Seats: 4
   - Price per Seat: 500 (₹5)
4. Click "Create Ride"

**Expected Results:**
- Success toast notification appears
- Ride appears in database
- User receives notification with ride code
- Ride shows in "My Upcoming Rides"

**Acceptance Criteria:**
- ✓ Ride created in `rides` table
- ✓ Notification created with ride code
- ✓ History entry created
- ✓ Ride code is 6 alphanumeric characters
- ✓ seats_left = total_seats initially

---

#### Test 2.2: Form Validation
**Steps:**
1. Try submitting with empty fields
2. Try invalid date (past date)
3. Try negative seats
4. Try zero/negative price

**Expected Results:**
- Form shows validation errors
- Submit disabled until valid
- Clear error messages

**Acceptance Criteria:**
- ✓ All required fields validated
- ✓ Date must be in future
- ✓ Seats must be positive integer
- ✓ Price must be valid positive number

---

### 3. Find & Join Rides

#### Test 3.1: Browse Available Rides
**Steps:**
1. Sign in as User B
2. Go to "Find Nearby Rides"
3. Verify User A's ride displays
4. Check all ride details visible:
   - Origin, destination
   - Departure time
   - Available seats
   - Price per seat
   - Seats availability bar

**Expected Results:**
- Ride displays with all information
- Seats counter shows correctly
- Join button is active (if seats available)
- UI is responsive

**Acceptance Criteria:**
- ✓ Ride fetched from database
- ✓ Real-time updates via Supabase
- ✓ Mobile-friendly layout
- ✓ Search/filter working

---

#### Test 3.2: Search and Filter Rides
**Steps:**
1. Go to "Find Nearby Rides"
2. Enter "Downtown" in "From" field
3. Enter "Airport" in "To" field
4. Try different sort options:
   - Price: Low to High
   - Price: High to Low
   - Most Seats Available
   - Departing Soon

**Expected Results:**
- Rides filtered correctly by origin/destination
- Sort order correct for each option
- Results update in real-time
- No matching rides show appropriate message

**Acceptance Criteria:**
- ✓ Case-insensitive search
- ✓ Partial matches work
- ✓ All sort options functional
- ✓ No rides message shows when empty

---

#### Test 3.3: Join Ride with Split Cost
**Steps:**
1. Sign in as User B
2. Go to "Find Nearby Rides"
3. Click "Join Ride" on User A's ride
4. Modal opens with ride details
5. Change "Split Cost with" to 2 people
6. Verify total per person updates: 500 / 2 = 250
7. Click "Proceed to Payment"

**Expected Results:**
- Modal shows ride details
- Cost calculation correct
- Split cost options (1-5 people)
- Redirects to Stripe Checkout
- Amount reflects split cost

**Acceptance Criteria:**
- ✓ Cost calculation accurate
- ✓ UI clear about split cost
- ✓ Checkbox/radio for split option
- ✓ Amount passes to Stripe correctly

---

### 4. Stripe Payment Integration

#### Test 4.1: Create Checkout Session
**Steps:**
1. From previous test, click "Proceed to Payment"
2. Stripe Checkout page loads
3. Verify:
   - Correct ride title shown
   - Correct amount (split if applicable)
   - Currency is INR
   - Email field pre-filled

**Expected Results:**
- Stripe Checkout loads without errors
- All details correct
- Payment session created in `payments` table with status='pending'

**Acceptance Criteria:**
- ✓ Session created in DB
- ✓ All details match
- ✓ Secure HTTPS connection
- ✓ No console errors

---

#### Test 4.2: Successful Payment
**Steps:**
1. Complete payment form:
   - Card: 4242 4242 4242 4242
   - Exp: Any future date (e.g., 12/25)
   - CVC: Any 3 digits
   - Name: Test User
2. Click "Pay"
3. Wait for redirect

**Expected Results:**
- Payment succeeds
- Redirects to `/payment-success?session_id=...`
- Success page shows:
  - Green checkmark
  - Ride code (6 characters)
  - "Booking confirmed" message
- Database updates:
  - `ride_participants` record created with paid=true
  - `payments` record updated with status='completed'
  - `ride_codes` record created
  - `ride_chats` accessible now
- Notification created with ride code
- seats_left decremented
- History entry created

**Acceptance Criteria:**
- ✓ Payment processed successfully
- ✓ All DB updates correct
- ✓ Ride code generated and displayed
- ✓ Notification sent to user
- ✓ Can now access ride chat

---

#### Test 4.3: Failed Payment
**Steps:**
1. Click "Join Ride" again on different ride
2. Proceed to checkout
3. Use declined card: 4000 0000 0000 9995
4. Attempt payment

**Expected Results:**
- Payment declined
- Error message shown in Stripe
- User can retry
- No participant record created
- No notification sent

**Acceptance Criteria:**
- ✓ Error handled gracefully
- ✓ No false success notifications
- ✓ User can retry

---

#### Test 4.4: Webhook Processing
**Steps:**
1. Complete successful payment
2. Observe Stripe Dashboard → Developers → Events
3. Should see `checkout.session.completed` event
4. Verify webhook was processed (check Stripe logs)

**Expected Results:**
- Webhook event logged
- Payment status updated in DB
- Notifications created via webhook

**Acceptance Criteria:**
- ✓ Webhook received and verified
- ✓ Event processed correctly
- ✓ DB updates from webhook occur

---

### 5. Real-Time Chat

#### Test 5.1: Send Text Messages
**Steps:**
1. Sign in as both User A and User B (separate browsers)
2. Both join same ride
3. Go to ride details/chat
4. User A: Type message "Hello from A"
5. Click Send or press Enter

**Expected Results:**
- Message appears immediately in User A's chat
- Message appears in real-time in User B's chat
- Timestamp shown
- Sender identified
- Message stored in `ride_chats` table

**Acceptance Criteria:**
- ✓ Realtime sync via Supabase
- ✓ Correct sender identification
- ✓ No message loss
- ✓ Clear UI with bubbles

---

#### Test 5.2: Push-to-Talk Audio
**Steps:**
1. In chat window, click and hold mic button
2. Speak for 5-10 seconds
3. Release mouse button
4. Wait for upload

**Expected Results:**
- Recording indicator shows
- Audio uploads to Supabase Storage
- Audio message appears in chat
- User B sees audio player in real-time
- Both can play/pause audio

**Acceptance Criteria:**
- ✓ Audio captured from microphone
- ✓ Upload to Supabase storage succeeds
- ✓ Audio URL correct
- ✓ Both users can play audio
- ✓ Real-time notification of audio

---

#### Test 5.3: Chat Access Control
**Steps:**
1. Sign in as User C (not in ride)
2. Try accessing chat: `/upcoming-rides` → select ride chat
3. Verify access denied

**Expected Results:**
- User C cannot see messages
- Error message or redirect
- RLS policy blocks access

**Acceptance Criteria:**
- ✓ RLS prevents unauthorized access
- ✓ Error handled gracefully

---

### 6. Notifications

#### Test 6.1: Notifications Display
**Steps:**
1. Create a ride
2. Join a ride
3. Make a payment
4. Click bell icon in navbar

**Expected Results:**
- Badge shows unread count
- Notifications sheet opens
- Shows:
  - "Ride Created" notification
  - "Ride Joined" notification
  - "Booking Confirmed" with ride code
- Ordered by newest first
- Time ago shown (e.g., "2 minutes ago")

**Acceptance Criteria:**
- ✓ All notifications displayed
- ✓ Correct titles and bodies
- ✓ Ride codes shown in relevant notifications
- ✓ Chronological ordering

---

#### Test 6.2: Real-Time Notifications
**Steps:**
1. Have 2 browser windows open
2. In Window A: Create/join ride
3. Observe Window B's notification bell
4. Unread count increments in real-time

**Expected Results:**
- Notification appears instantly
- Badge updates without refresh
- Sound/visual notification (if implemented)

**Acceptance Criteria:**
- ✓ Real-time via Supabase Realtime
- ✓ Badge count accurate
- ✓ No refresh needed

---

#### Test 6.3: Mark as Read
**Steps:**
1. Click notification
2. Verify notification marked as read
3. Click "Mark all as read"

**Expected Results:**
- Individual notification no longer highlighted
- Badge count decreases
- All notifications lose "new" indicator
- Data persists on refresh

**Acceptance Criteria:**
- ✓ Read status updated in DB
- ✓ UI reflects changes
- ✓ Bulk mark all as read works

---

### 7. History & Audit Trail

#### Test 7.1: History Log
**Steps:**
1. Create a ride
2. Join a ride
3. Make a payment
4. Go to `/history`

**Expected Results:**
- All 3 actions displayed
- Ordered with newest first
- Icons show action type
- Metadata displayed:
  - Create: origin, destination, seats, price
  - Join: amount due
  - Payment: amount, session ID
- Timestamps accurate
- Filter by action type works

**Acceptance Criteria:**
- ✓ All actions logged
- ✓ Metadata correct
- ✓ Filters work
- ✓ Export functionality works

---

#### Test 7.2: History Export
**Steps:**
1. Go to `/history`
2. Apply filter (e.g., "Payments only")
3. Click "Download CSV"

**Expected Results:**
- CSV file downloads
- Columns: Date, Action, Details
- Data matches displayed history
- File named with date

**Acceptance Criteria:**
- ✓ CSV format valid
- ✓ All data included
- ✓ Excel can open file
- ✓ Dates in proper format

---

### 8. Upcoming Rides

#### Test 8.1: View User's Rides
**Steps:**
1. Sign in
2. Go to `/upcoming-rides`
3. Click different tabs:
   - All Rides
   - My Rides (created)
   - Joined

**Expected Results:**
- Tab shows correct rides
- "My Rides" shows only rides created by user
- "Joined" shows only rides user joined
- "All Rides" shows combined list
- Badges show "Your Ride" for owned rides

**Acceptance Criteria:**
- ✓ Queries correct
- ✓ Tabs filter properly
- ✓ Data accurate
- ✓ UI clear about ownership

---

#### Test 8.2: Access Ride Chat
**Steps:**
1. Go to `/upcoming-rides`
2. Click a ride
3. Chat panel opens on right side

**Expected Results:**
- Ride details shown
- Chat accessible
- Can send messages
- Can record audio
- Ride code displayed

**Acceptance Criteria:**
- ✓ Chat component loads
- ✓ Realtime working
- ✓ Audio functionality works
- ✓ UI responsive

---

### 9. Mobile Responsiveness

#### Test 9.1: Mobile Layout
**Steps:**
1. Open app in mobile browser (or use DevTools)
2. Test at 375px width
3. Navigate all pages:
   - Auth page
   - Home page
   - Find Rides
   - Upcoming Rides
   - Chat
   - History

**Expected Results:**
- All content readable
- No horizontal scroll
- Touch targets ≥44px
- Forms work with mobile keyboard
- Images responsive

**Acceptance Criteria:**
- ✓ Mobile-first design
- ✓ Touch-friendly buttons
- ✓ Readable text sizes
- ✓ Proper spacing

---

#### Test 9.2: Tablet Layout
**Steps:**
1. Test at 768px width
2. Check spacing and layout
3. Verify card layout adjusts

**Expected Results:**
- Good use of screen space
- Grid adjusts (2-3 columns)
- Balance maintained

**Acceptance Criteria:**
- ✓ Optimized for tablet
- ✓ Touch-friendly
- ✓ Good proportions

---

### 10. Error Handling

#### Test 10.1: Network Errors
**Steps:**
1. Stop backend server
2. Try creating a ride
3. Try joining a ride
4. Try sending message

**Expected Results:**
- Clear error messages
- User directed to retry
- No crash/blank page
- Graceful degradation

**Acceptance Criteria:**
- ✓ Error messages helpful
- ✓ Retry option provided
- ✓ No unhandled exceptions

---

#### Test 10.2: Validation Errors
**Steps:**
1. Try empty form submission
2. Try invalid email
3. Try past date for ride

**Expected Results:**
- Validation errors shown
- Field-level error messages
- Submit button disabled
- Clear what's wrong

**Acceptance Criteria:**
- ✓ All validations work
- ✓ Clear error messages
- ✓ Form prevents invalid submission

---

## Performance Testing

### Test P.1: Page Load Time
**Steps:**
1. Open DevTools Network tab
2. Load each page
3. Note load times

**Expected Results:**
- Home: <2 seconds
- Find Rides: <2 seconds
- Chat: <1.5 seconds
- History: <2 seconds

**Acceptance Criteria:**
- ✓ All pages load quickly
- ✓ No janky animations
- ✓ Images optimized

---

### Test P.2: Real-Time Performance
**Steps:**
1. Send 20 messages in quick succession
2. Record audio message
3. Multiple users in same chat

**Expected Results:**
- No lag or delays
- All messages sync
- Audio uploads without blocking
- Smooth scrolling

**Acceptance Criteria:**
- ✓ Real-time without delays
- ✓ Smooth animations
- ✓ No memory leaks

---

## Stripe Test Cards

Use these cards in checkout:

| Card | Status | Use |
|------|--------|-----|
| 4242 4242 4242 4242 | Visa - Succeeds | Normal flow |
| 4000 0000 0000 9995 | Visa - Declines | Decline flow |
| 5555 5555 5555 4444 | Mastercard | Alternative |
| 2720 9999 2010 5031 | Visa Debit | Debit card |

**All cards:**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits
- ZIP: Any 5 digits
- Name: Any name

---

## Test Checklist

### Pre-Deployment
- [ ] All feature tests passing
- [ ] Mobile responsiveness verified
- [ ] Error handling tested
- [ ] Performance acceptable
- [ ] Security review complete
- [ ] No console errors/warnings
- [ ] RLS policies verified
- [ ] Webhook processing working

### Post-Deployment
- [ ] Production URLs configured
- [ ] Stripe live credentials set
- [ ] Supabase backups enabled
- [ ] Monitoring/logging set up
- [ ] Email notifications working (if added)
- [ ] Production testing completed
- [ ] Support documentation ready

---

## Sign-Off

Once all tests pass, mark as ready for:
- [ ] Beta testing with real users
- [ ] Production deployment
- [ ] Public launch

