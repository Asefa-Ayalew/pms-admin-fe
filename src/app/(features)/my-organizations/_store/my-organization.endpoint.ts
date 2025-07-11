export const MY_ORGANIZATION_ENDPOINT = {
    list: `${process.env.NEXT_PUBLIC_APP_API}/my-organizations/get-my-organizations`,
    create: `${process.env.NEXT_PUBLIC_APP_API}/my-organizations/create-my-organization`,
    detail: `${process.env.NEXT_PUBLIC_APP_API}/tenants/get-tenant`,
    update: `${process.env.NEXT_PUBLIC_APP_API}/my-organizations/update-my-organization`,
    delete: `${process.env.NEXT_PUBLIC_APP_API}/my-organizations/delete-my-organization`,
    archive: `${process.env.NEXT_PUBLIC_APP_API}/my-organizations/archive-my-organization`,
    restore: `${process.env.NEXT_PUBLIC_APP_API}/my-organizations/restore-my-organization`,
};
