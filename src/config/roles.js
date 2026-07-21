export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  AGENT: 'agent',
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    canViewAll: true,
    canManageAdmins: true,
    canManageTeachers: true,
    canManageStudents: true,
    canManageAgents: true,
    canManageQuestions: true,
    canViewEarnings: true,
    canApproveAgents: true,
  },
  [ROLES.ADMIN]: {
    canViewAll: true,
    canManageAdmins: false,
    canManageTeachers: true,
    canManageStudents: true,
    canManageAgents: false,
    canManageQuestions: true,
    canViewEarnings: true,
    canApproveAgents: false,
  },
  [ROLES.AGENT]: {
    canViewAll: false,
    canManageAdmins: false,
    canManageTeachers: false,
    canManageStudents: true,
    canManageAgents: false,
    canManageQuestions: false,
    canViewEarnings: true,
    canApproveAgents: false,
  },
};