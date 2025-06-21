export const USER_ENDPOINT = {
  list: `${process.env.NEXT_PUBLIC_APP_API}/users/get-users`,
  create: `${process.env.NEXT_PUBLIC_APP_API}/users/create-user`,
  detail: `${process.env.NEXT_PUBLIC_APP_API}/users/get-user`,
  update: `${process.env.NEXT_PUBLIC_APP_API}/users/update-user`,
  delete: `${process.env.NEXT_PUBLIC_APP_API}/users/delete-user`,
  archive: `${process.env.NEXT_PUBLIC_APP_API}/users/archive-user`,
  restore: `${process.env.NEXT_PUBLIC_APP_API}/users/restore-user`,
  user_info: `${process.env.NEXT_PUBLIC_APP_API}/auth/get-user-info`,
  department_list: `${process.env.NEXT_PUBLIC_APP_API}/departments/get-departments`,
  create_role: `${process.env.NEXT_PUBLIC_APP_API}/users/create-bulk-user-role`
};
