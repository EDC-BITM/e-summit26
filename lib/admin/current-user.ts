import { createClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return null;
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('roll_no, branch')
    .eq('id', user.id)
    .single();

  // Get user role
  const { data: userRole } = await supabase
    .from('user_role')
    .select(`
      roles (
        name
      )
    `)
    .eq('user_id', user.id)
    .single();

  type Role = { name: string };

  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    avatar: user.user_metadata?.avatar_url || '',
    role: (userRole?.roles as unknown as Role | null)?.name || 'user',
    rollNo: profile?.roll_no || '',
    branch: profile?.branch || '',
  };
}
