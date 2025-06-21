export const EMERGENCY_CONTACT_ENDPOINT = {
    list: `${process.env.NEXT_PUBLIC_APP_API}/users/get-user-contacts`,
    create: `${process.env.NEXT_PUBLIC_APP_API}/users/create-user-contact`,
    detail: `${process.env.NEXT_PUBLIC_APP_API}/users/get-user-contact`,
    update: `${process.env.NEXT_PUBLIC_APP_API}/users/update-user-contact`,
    delete: `${process.env.NEXT_PUBLIC_APP_API}/users/remove-user-contact`,
    archive: `${process.env.NEXT_PUBLIC_APP_API}/emergency-contacts/archive-emergency-contact`,
    restore: `${process.env.NEXT_PUBLIC_APP_API}/emergency-contacts/restore-emergency-contact`,
    getUser: `${process.env.NEXT_PUBLIC_APP_API}/users/get-user`,
};