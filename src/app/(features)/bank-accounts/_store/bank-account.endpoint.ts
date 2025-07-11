export const BANK_ACCOUNT_ENDPOINT = {
    list: `${process.env.NEXT_PUBLIC_APP_API}/bank-accounts/get-bank-accounts`,
    create: `${process.env.NEXT_PUBLIC_APP_API}/bank-accounts/create-bank-account`,
    detail: `${process.env.NEXT_PUBLIC_APP_API}/bank-accounts/get-bank-account`,
    update: `${process.env.NEXT_PUBLIC_APP_API}/bank-accounts/update-bank-account`,
    delete: `${process.env.NEXT_PUBLIC_APP_API}/bank-accounts/delete-bank-account`,
    archive: `${process.env.NEXT_PUBLIC_APP_API}/bank-accounts/archive-bank-account`,
    restore: `${process.env.NEXT_PUBLIC_APP_API}/bank-accounts/restore-bank-account`,
    getUsers: `${process.env.NEXT_PUBLIC_APP_API}/users/get-users`,
    getTenants: `${process.env.NEXT_PUBLIC_APP_API}/tenants/get-tenants`,
    getTenant: `${process.env.NEXT_PUBLIC_APP_API}/tenants/get-tenant`,
};
