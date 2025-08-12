import { jwtDecode } from "jwt-decode"

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = jwtDecode(token);
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  return currentTime > expirationTime;
};

export default isTokenExpired;