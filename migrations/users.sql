-- Create users table
CREATE TABLE IF NOT EXISTS users (
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
full_name VARCHAR(255),
website VARCHAR(255),
email VARCHAR(255) UNIQUE NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select their own record
CREATE POLICY "Users can select their own record" ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Create a policy that allows users to update their own record
CREATE POLICY "Users can update their own record" ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Create a function that automatically creates a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO public.users (id, email, full_name)
VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that executes the function when a new user signs up
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();
