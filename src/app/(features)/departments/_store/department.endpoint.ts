export const DEPARTMENT_ENDPOINT = {
    list: `${process.env.NEXT_PUBLIC_APP_API}/departments/get-departments`,
    create: `${process.env.NEXT_PUBLIC_APP_API}/departments/create-department`,
    detail: `${process.env.NEXT_PUBLIC_APP_API}/departments/get-department`,
    update: `${process.env.NEXT_PUBLIC_APP_API}/departments/update-department`,
    delete: `${process.env.NEXT_PUBLIC_APP_API}/departments/delete-department`,
    archive: `${process.env.NEXT_PUBLIC_APP_API}/departments/archive-department`,
    restore: `${process.env.NEXT_PUBLIC_APP_API}/departments/restore-department`,
};
