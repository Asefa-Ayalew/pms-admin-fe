export const TENANT_ENDPOINT = {
    list: `${process.env.NEXT_PUBLIC_APP_API}/tenants/get-tenants`,
    create: `${process.env.NEXT_PUBLIC_APP_API}/tenants/create-tenant`,
    detail: `${process.env.NEXT_PUBLIC_APP_API}/tenants/get-tenant`,
    update: `${process.env.NEXT_PUBLIC_APP_API}/tenants/update-tenant`,
    delete: `${process.env.NEXT_PUBLIC_APP_API}/tenants/delete-tenant`,
    archive: `${process.env.NEXT_PUBLIC_APP_API}/tenants/archive-tenant`,
    restore: `${process.env.NEXT_PUBLIC_APP_API}/tenants/restore-tenant`,
};
