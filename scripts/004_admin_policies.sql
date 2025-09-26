-- Create admin role check function
CREATE OR REPLACE FUNCTION public.is_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For demo purposes, we'll check if email contains 'admin'
  -- In production, you'd have a proper admin table or role system
  RETURN user_email LIKE '%admin%' OR user_email = 'admin@lajarus.com';
END;
$$;

-- Admin policies for reports table
CREATE POLICY "admins_can_view_all_reports" ON public.reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND public.is_admin(auth.users.email)
    )
  );

CREATE POLICY "admins_can_update_all_reports" ON public.reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND public.is_admin(auth.users.email)
    )
  );

-- Admin policies for profiles table
CREATE POLICY "admins_can_view_all_profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND public.is_admin(auth.users.email)
    )
  );
