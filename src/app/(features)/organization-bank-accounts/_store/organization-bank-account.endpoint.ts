export const ORGANIZATION_BANK_ACCOUNT_ENDPOINT = {
    list: `${process.env.NEXT_PUBLIC_APP_API}/organization-bank-accounts/get-bank-accounts`,
    create: `${process.env.NEXT_PUBLIC_APP_API}/organization-bank-accounts/create-bank-account`,
    detail: `${process.env.NEXT_PUBLIC_APP_API}/organization-bank-accounts/get-bank-account`,
    update: `${process.env.NEXT_PUBLIC_APP_API}/organization-bank-accounts/update-bank-account`,
    delete: `${process.env.NEXT_PUBLIC_APP_API}/organization-bank-accounts/delete-bank-account`,
    archive: `${process.env.NEXT_PUBLIC_APP_API}/organization-bank-accounts/archive-bank-account`,
    restore: `${process.env.NEXT_PUBLIC_APP_API}/organization-bank-accounts/restore-bank-account`,
};
