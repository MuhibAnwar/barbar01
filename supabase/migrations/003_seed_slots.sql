-- Seed availability slots for the next 7 days
-- Run this after inserting barbers
-- Generates 9:00–18:00 in 30-min increments for each barber

DO $$
DECLARE
  barber RECORD;
  day_offset int;
  hour_slot int;
  slot_ts timestamptz;
BEGIN
  FOR barber IN SELECT id FROM barbers LOOP
    FOR day_offset IN 0..6 LOOP
      FOR hour_slot IN 0..17 LOOP  -- 9 slots per hour * 2 = 18 slots = 9am-6pm
        slot_ts := date_trunc('day', now() AT TIME ZONE 'Asia/Karachi')
                   + (day_offset || ' days')::interval
                   + ((9 + floor(hour_slot / 2)) || ' hours')::interval
                   + ((30 * (hour_slot % 2)) || ' minutes')::interval;

        -- Only insert future slots
        IF slot_ts > now() THEN
          INSERT INTO availability_slots (barber_id, slot_time, is_booked)
          VALUES (barber.id, slot_ts, false)
          ON CONFLICT DO NOTHING;
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;
END;
$$;
