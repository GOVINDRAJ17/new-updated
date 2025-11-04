-- Add radio_code column to rides table for unique radio channel identification
ALTER TABLE public.rides ADD COLUMN radio_code TEXT;

-- Create index on radio_code for faster lookups
CREATE INDEX idx_rides_radio_code ON public.rides(radio_code);

-- Function to generate unique radio codes
CREATE OR REPLACE FUNCTION generate_radio_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..7 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate radio codes for new rides
CREATE OR REPLACE FUNCTION set_radio_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.radio_code IS NULL THEN
    NEW.radio_code := generate_radio_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ride_radio_code
BEFORE INSERT ON public.rides
FOR EACH ROW
EXECUTE FUNCTION set_radio_code();