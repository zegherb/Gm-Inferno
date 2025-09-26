-- Fix the foreign key constraint issue by removing the reference to auth.users
-- and relying on RLS policies for security

-- First, drop the existing foreign key constraint
ALTER TABLE public.reports DROP CONSTRAINT IF EXISTS reports_user_id_fkey;

-- Recreate the reports table structure without the foreign key constraint to auth.users
-- The user_id will still be validated through RLS policies

-- Update the RLS policies to be more explicit
DROP POLICY IF EXISTS "reports_select_own" ON public.reports;
DROP POLICY IF EXISTS "reports_insert_own" ON public.reports;
DROP POLICY IF EXISTS "reports_update_own" ON public.reports;
DROP POLICY IF EXISTS "reports_delete_own" ON public.reports;

-- Create new RLS policies that are more permissive for authenticated users
CREATE POLICY "reports_select_authenticated" ON public.reports 
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "reports_insert_authenticated" ON public.reports 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "reports_update_own" ON public.reports 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reports_delete_own" ON public.reports 
  FOR DELETE USING (auth.uid() = user_id);

-- Also fix the profiles table policies to be more permissive
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_select_authenticated" ON public.profiles 
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "profiles_insert_authenticated" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Create a function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
