-- Enable RLS on health_personal_info table
ALTER TABLE health_personal_info ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON health_personal_info;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON health_personal_info;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON health_personal_info;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON health_personal_info;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users" ON health_personal_info
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users" ON health_personal_info
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for authenticated users" ON health_personal_info
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for authenticated users" ON health_personal_info
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id); 