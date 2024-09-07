import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
}

export function isTokenExpired(token: string): boolean {
  if (!token) return true;

  const decoded: JwtPayload = jwtDecode<JwtPayload>(token);

  if (decoded.exp) {
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime; // Token is expired if current time is greater than `exp`
  }

  return true;
}
