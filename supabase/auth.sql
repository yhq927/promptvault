-- =====================================================
-- Supabase Auth Configuration for PromptVault
-- =====================================================

-- =====================================================
-- AUTHENTICATION SETUP
-- =====================================================

-- Configure email templates for authentication
-- These are managed via Supabase Dashboard > Authentication > Email Templates
-- but you can also set defaults here

-- Enable email auth by default (already enabled in config.toml)
-- No additional setup needed for email/password auth

-- =====================================================
-- ROW LEVEL SECURITY FOR AUTH
-- =====================================================

-- Auth.users table is managed by Supabase, but we need to ensure
-- our policies on public.users are properly set up (already in schema.sql)

-- =====================================================
-- HELPER FUNCTIONS FOR AUTH
-- =====================================================

-- Function to get current user
CREATE OR REPLACE FUNCTION public.get_current_user()
RETURNS TABLE (
    id UUID,
    email TEXT,
    username TEXT,
    display_name TEXT,
    avatar_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id,
        au.email,
        u.username,
        u.display_name,
        u.avatar_url
    FROM public.users u
    JOIN auth.users au ON au.id = u.id
    WHERE u.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns a prompt
CREATE OR REPLACE FUNCTION public.user_owns_prompt(prompt_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    owned BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.prompts
        WHERE id = prompt_uuid AND user_id = auth.uid()
    ) INTO owned;
    RETURN owned;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STORAGE SETUP (for user avatars)
-- =====================================================

-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::TEXT = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own avatars"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::TEXT = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own avatars"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::TEXT = (storage.foldername(name))[1]
    );

-- =====================================================
-- ADDITIONAL AUTH HELPERS
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.prompts TO authenticated;
GRANT ALL ON public.prompts TO anon;
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.categories TO anon;
GRANT ALL ON public.tags TO authenticated;
GRANT ALL ON public.tags TO anon;
GRANT ALL ON public.prompt_tags TO authenticated;
GRANT ALL ON public.prompt_tags TO anon;
GRANT ALL ON public.prompt_versions TO authenticated;
GRANT ALL ON public.prompt_versions TO anon;
