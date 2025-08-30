export const CONTACT_ENDPOINT = {
    list: `${process.env.NEXT_PUBLIC_APP_API}/tenants/get-tenant-contacts`,
    create: `${process.env.NEXT_PUBLIC_APP_API}/tenants/create-tenant-contact`,
    detail: `${process.env.NEXT_PUBLIC_APP_API}/tenants/get-tenant-contact`,
    update: `${process.env.NEXT_PUBLIC_APP_API}/tenants/update-tenant-contact`,
    delete: `${process.env.NEXT_PUBLIC_APP_API}/tenants/remove-tenant-contact`,
    archive: `${process.env.NEXT_PUBLIC_APP_API}/tenants/archive-tenant-contact`,
    restore: `${process.env.NEXT_PUBLIC_APP_API}/tenants/restore-tenant-contact`,
};
