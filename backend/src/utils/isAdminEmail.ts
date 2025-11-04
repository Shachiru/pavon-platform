const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];

export const isWhitelistedAdmin = (email: string): boolean => {
    return ADMIN_EMAILS.includes(email.toLowerCase());
};