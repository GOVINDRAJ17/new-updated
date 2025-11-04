-- Drop trigger first, then functions, then recreate with proper search_path
DROP TRIGGER IF EXISTS set_ride_radio_code ON public.rides;
DROP FUNCTION IF EXISTS set_radio_code();
DROP FUNCTION IF EXISTS generate_radio_code();

-- Recreate functions with proper security
CREATE OR REPLACE FUNCTION generate_radio_code()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION set_radio_code()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.radio_code IS NULL THEN
    NEW.radio_code := generate_radio_code();
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER set_ride_radio_code
BEFORE INSERT ON public.rides
FOR EACH ROW
EXECUTE FUNCTION set_radio_code();