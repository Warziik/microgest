const API_URL = "http://localhost:8080/api";

export const AUTH_URI = `${API_URL}/authentication_token`;

export const AUTH_REFRESH_TOKEN_URI = `${AUTH_URI}/refresh`;

export const AUTH_REVOKE_REFRESH_TOKEN_URI = `${AUTH_URI}/revoke`;

export const USERS_URI = `${API_URL}/users`;

export const CUSTOMERS_URI = `${API_URL}/customers`;

export const INVOICES_URI = `${API_URL}/invoices`;

export const DEVIS_URI = `${API_URL}/devis`;
