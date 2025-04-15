-- Create appointments table
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_type TEXT NOT NULL,
  consultation_type TEXT NOT NULL,
  delivery_method TEXT NOT NULL,
  specialty TEXT,
  status TEXT NOT NULL,
  scheduled_date DATE,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER NOT NULL,
  assigned_doctor_id UUID REFERENCES doctors(id),
  notes TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctor_schedules table
CREATE TABLE doctor_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX appointments_patient_id_idx ON appointments(patient_id);
CREATE INDEX appointments_status_idx ON appointments(status);
CREATE INDEX appointments_scheduled_date_idx ON appointments(scheduled_date);
CREATE INDEX doctors_specialty_idx ON doctors(specialty);
CREATE INDEX doctor_schedules_doctor_id_idx ON doctor_schedules(doctor_id);
CREATE INDEX doctor_schedules_date_idx ON doctor_schedules(date);

-- Create RLS policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedules ENABLE ROW LEVEL SECURITY;

-- Appointments policies
CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Users can create their own appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = patient_id);

-- Doctors policies
CREATE POLICY "Anyone can view doctors"
  ON doctors FOR SELECT
  USING (true);

CREATE POLICY "Only doctors can update their own profiles"
  ON doctors FOR UPDATE
  USING (auth.uid() = user_id);

-- Doctor schedules policies
CREATE POLICY "Anyone can view doctor schedules"
  ON doctor_schedules FOR SELECT
  USING (true);

CREATE POLICY "Only doctors can manage their own schedules"
  ON doctor_schedules FOR ALL
  USING (EXISTS (
    SELECT 1 FROM doctors
    WHERE doctors.id = doctor_schedules.doctor_id
    AND doctors.user_id = auth.uid()
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctor_schedules_updated_at
  BEFORE UPDATE ON doctor_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 