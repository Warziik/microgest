const API_URL = process.env.API_URL;

export const AUTH_URI = `${API_URL}/authentication_token`;

export const AUTH_REFRESH_TOKEN_URI = `${AUTH_URI}/refresh`;

export const AUTH_REVOKE_REFRESH_TOKEN_URI = `${AUTH_URI}/revoke`;

export const USERS_URI = `${API_URL}/users`;

export const CUSTOMERS_URI = `${API_URL}/customers`;

export const INVOICES_URI = `${API_URL}/invoices`;

export const DEVIS_URI = `${API_URL}/devis`;

export const LAST_ADDED_INVOICES_URI = `${INVOICES_URI}?order[createdAt]&itemsPerPage=5`;

export const LAST_ADDED_DEVIS_URI = `${DEVIS_URI}?order[createdAt]&itemsPerPage=5`;

export const STATS_TURNOVER_EVOLUTION_URI = `${INVOICES_URI}?status=PAID&paidAt=2021`;