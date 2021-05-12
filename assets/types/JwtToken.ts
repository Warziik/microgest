export interface JwtToken {
    exp: number;
    iat: number;
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
}