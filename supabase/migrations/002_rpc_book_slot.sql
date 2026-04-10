-- Atomic slot booking RPC — prevents double booking
CREATE OR REPLACE FUNCTION book_slot(
  p_slot_id uuid,
  p_barber_id uuid,
  p_service_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_comment text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  v_booking_id uuid;
  v_slot_time timestamptz;
BEGIN
  -- Lock the slot row
  SELECT slot_time INTO v_slot_time
  FROM availability_slots
  WHERE id = p_slot_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Slot not found';
  END IF;

  -- Check if already booked
  IF (SELECT is_booked FROM availability_slots WHERE id = p_slot_id) THEN
    RAISE EXCEPTION 'Slot already booked';
  END IF;

  -- Insert booking
  INSERT INTO bookings (
    barber_id,
    service_id,
    customer_name,
    customer_phone,
    appointment_time,
    comment
  ) VALUES (
    p_barber_id,
    p_service_id,
    p_customer_name,
    p_customer_phone,
    v_slot_time,
    p_comment
  )
  RETURNING id INTO v_booking_id;

  -- Mark slot as booked
  UPDATE availability_slots
  SET is_booked = true
  WHERE id = p_slot_id;

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
