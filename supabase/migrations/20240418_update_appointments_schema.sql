-- Update the appointments table schema
ALTER TABLE appointments
  RENAME COLUMN user_id TO patient_id;

ALTER TABLE appointments
  RENAME COLUMN date TO scheduled_date;

ALTER TABLE appointments
  RENAME COLUMN time_slot TO scheduled_time;

-- Add new columns if they don't exist
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS assigned_doctor_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS location TEXT;

-- Update the status enum to match our TypeScript types
ALTER TABLE appointments
  DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE appointments
  ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed', 'No-Show', 'Rescheduled'));

-- Update RLS policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON appointments;

-- Create new policies
CREATE POLICY "Users can view their own appointments"
    ON appointments
    FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Users can insert their own appointments"
    ON appointments
    FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own appointments"
    ON appointments
    FOR UPDATE
    USING (auth.uid() = patient_id)
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can delete their own appointments"
    ON appointments
    FOR DELETE
    USING (auth.uid() = patient_id); 