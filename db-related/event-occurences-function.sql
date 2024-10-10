CREATE OR REPLACE FUNCTION create_event_instances() RETURNS trigger as $$
DECLARE
    event_start timestamp with time zone;
    event_ocurrences int;
    recurrence_interval int;
    event_instance_time timestamp with time zone;
    event_last_registration_dt timestamp with time zone;
    iterator int := 1;
BEGIN
    -- Initialize variables from the event data
    event_start := NEW.occurs;
    event_ocurrences := NEW.recurring;
    recurrence_interval := COALESCE(NEW.recurring_interval, 1);  -- Default to 1 day if no interval

    -- Loop through number of occurances 
    event_instance_time := event_start;
    event_last_registration_dt := NEW.last_registration_dt;
    WHILE iterator <= event_ocurrences LOOP
        INSERT INTO public."EventInstances" (event_id, instance_occurs, max_attendees, min_attendees, last_registration_dt)
        VALUES (NEW.id, event_instance_time, NEW.max_attendees, NEW.min_attendees, event_last_registration_dt);

        -- Adjust the instance time based on the recurrence interval (e.g., daily, weekly)
        IF NEW.recurring_interval IS NOT NULL THEN
            event_instance_time := event_instance_time + (NEW.recurring_interval * INTERVAL '1 day');
            event_last_registration_dt := event_last_registration_dt + (NEW.recurring_interval * INTERVAL '1 day');
        ELSE
            event_instance_time := event_instance_time + INTERVAL '1 day';  -- Default to daily if not specified
            event_last_registration_dt := event_last_registration_dt + INTERVAL '1 day';
        END IF;
        iterator = iterator + 1;
    END LOOP;

    RETURN NEW;
END;
$$ 
LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_create_event_instances
AFTER INSERT OR UPDATE ON public."Events"
FOR EACH ROW
EXECUTE FUNCTION create_event_instances();