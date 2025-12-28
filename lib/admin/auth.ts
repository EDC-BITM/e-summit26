import { createClient } from '@/lib/supabase/server';

export async function checkUserRole(allowedRoles: string[] = ['admin']) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return { authorized: false, user: null, role: null };
  }

  const { data: userRole, error: roleError } = await supabase
    .from('user_role')
    .select(`
      role_id,
      roles (
        id,
        name
      )
    `)
    .eq('user_id', user.id)
    .single();

  if (roleError || !userRole) {
    return { authorized: false, user, role: null };
  }

  type Role = { id: string; name: string };
  let roleName: string | undefined;
  if (Array.isArray(userRole.roles)) {
    roleName = userRole.roles[0]?.name;
    console.log(roleName)
  } else {
    roleName = (userRole.roles as Role)?.name;
  }
  const isAuthorized = roleName ? allowedRoles.includes(roleName) : false;

  return { 
    authorized: isAuthorized, 
    user, 
    role: roleName 
  };
}

export async function requireAdmin() {
  const { authorized, role } = await checkUserRole(['admin']);
  
  if (!authorized) {
    throw new Error(`Access denied. Required role: admin. Current role: ${role || 'none'}`);
  }
  
  return true;
}

export async function requireAdminOrModerator() {
  const { authorized, role } = await checkUserRole(['admin', 'moderator']);
  
  if (!authorized) {
    throw new Error(`Access denied. Required role: admin or moderator. Current role: ${role || 'none'}`);
  }
  
  return true;
}
