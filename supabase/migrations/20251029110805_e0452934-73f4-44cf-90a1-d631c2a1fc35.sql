-- Add verified users capability
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS upi_qr_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location_lat NUMERIC;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location_lng NUMERIC;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location_consent BOOLEAN DEFAULT false;

-- Add ride name to rides table
ALTER TABLE rides ADD COLUMN IF NOT EXISTS ride_name TEXT;

-- Create ride_participants table
CREATE TABLE IF NOT EXISTS ride_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'passenger',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(ride_id, user_id)
);

-- Enable RLS on ride_participants
ALTER TABLE ride_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for ride_participants
CREATE POLICY "Users can view participants of their rides"
ON ride_participants FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM rides WHERE id = ride_id
    UNION
    SELECT user_id FROM ride_participants WHERE ride_id = ride_participants.ride_id
  )
);

CREATE POLICY "Users can join rides"
ON ride_participants FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rides"
ON ride_participants FOR DELETE
USING (auth.uid() = user_id);

-- Create ride_chat_messages table
CREATE TABLE IF NOT EXISTS ride_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on ride_chat_messages
ALTER TABLE ride_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for ride_chat_messages
CREATE POLICY "Ride participants can view chat messages"
ON ride_chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM ride_participants 
    WHERE ride_id = ride_chat_messages.ride_id 
    AND user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM rides
    WHERE id = ride_chat_messages.ride_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Verified ride participants can send messages"
ON ride_chat_messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_verified = true
  )
  AND (
    EXISTS (
      SELECT 1 FROM ride_participants 
      WHERE ride_id = ride_chat_messages.ride_id 
      AND user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM rides
      WHERE id = ride_chat_messages.ride_id
      AND user_id = auth.uid()
    )
  )
);

-- Update split_payments table
ALTER TABLE split_payments ADD COLUMN IF NOT EXISTS qr_code_url TEXT;
ALTER TABLE split_payments ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false;