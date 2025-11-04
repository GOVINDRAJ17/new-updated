-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Rides table
CREATE TABLE rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  departure_time timestamptz NOT NULL,
  total_seats integer NOT NULL,
  seats_left integer NOT NULL,
  price_per_seat integer NOT NULL, -- in cents/paise
  ride_code text UNIQUE,
  status text DEFAULT 'active', -- active, completed, cancelled
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ride participants table
CREATE TABLE ride_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  join_code text,
  amount_due integer, -- in cents/paise
  amount_paid integer DEFAULT 0,
  paid boolean DEFAULT false,
  stripe_session_id text,
  payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(ride_id, user_id)
);

-- Ride chats table
CREATE TABLE ride_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL, -- 'text' or 'audio'
  content text,
  audio_url text,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL, -- 'ride_joined', 'ride_created', 'payment_received', 'chat_message'
  title text NOT NULL,
  body text,
  ride_id uuid REFERENCES rides(id) ON DELETE CASCADE,
  meta jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- History table (audit log for user actions)
CREATE TABLE history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ride_id uuid REFERENCES rides(id) ON DELETE CASCADE,
  action text NOT NULL, -- 'create_ride', 'join_ride', 'payment', 'chat_message'
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ride_id uuid REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL, -- in cents/paise
  currency text DEFAULT 'INR',
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  status text DEFAULT 'pending', -- pending, completed, failed, refunded
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ride codes table (for tracking generated codes)
CREATE TABLE ride_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides(id) ON DELETE CASCADE NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rides
CREATE POLICY "Anyone can view active rides" ON rides
  FOR SELECT
  USING (status = 'active' OR created_by = auth.uid());

CREATE POLICY "Users can create rides" ON rides
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own rides" ON rides
  FOR UPDATE
  USING (auth.uid() = created_by);

-- RLS Policies for ride_participants
CREATE POLICY "Users can view participant info for their rides" ON ride_participants
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM rides
      WHERE rides.id = ride_participants.ride_id
      AND rides.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can join rides" ON ride_participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participant records" ON ride_participants
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for ride_chats
CREATE POLICY "Ride participants can view chat" ON ride_chats
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ride_participants
      WHERE ride_participants.ride_id = ride_chats.ride_id
      AND ride_participants.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM rides
      WHERE rides.id = ride_chats.ride_id
      AND rides.created_by = auth.uid()
    )
  );

CREATE POLICY "Ride participants can send messages" ON ride_chats
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (
      EXISTS (
        SELECT 1 FROM ride_participants
        WHERE ride_participants.ride_id = ride_chats.ride_id
        AND ride_participants.user_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM rides
        WHERE rides.id = ride_chats.ride_id
        AND rides.created_by = auth.uid()
      )
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for history
CREATE POLICY "Users can view own history" ON history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create history entries" ON history
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create payments" ON payments
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for ride_codes
CREATE POLICY "Anyone can view ride codes" ON ride_codes
  FOR SELECT
  USING (true);

CREATE POLICY "System can create ride codes" ON ride_codes
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_rides_created_by ON rides(created_by);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_departure_time ON rides(departure_time);
CREATE INDEX idx_ride_participants_ride_id ON ride_participants(ride_id);
CREATE INDEX idx_ride_participants_user_id ON ride_participants(user_id);
CREATE INDEX idx_ride_chats_ride_id ON ride_chats(ride_id);
CREATE INDEX idx_ride_chats_created_at ON ride_chats(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_history_user_id ON history(user_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_stripe_session_id ON payments(stripe_session_id);

-- Enable Realtime for ride_chats
ALTER PUBLICATION supabase_realtime ADD TABLE ride_chats;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
