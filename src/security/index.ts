import * as jwtDecode from "jwt-decode";

export const getUserFromJWT = (req) => {
    const token = req.headers.authorization || '';
    req.user = jwtDecode(token);
}