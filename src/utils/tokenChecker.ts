import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode(token);
    if (decoded && typeof decoded.exp === "number") {
      const expirationTimestamp = decoded.exp * 1000; // Convert to milliseconds
      const currentTimestamp = Date.now();

      return currentTimestamp > expirationTimestamp;
    }
    // Handle if decoded or exp is not available
    return true;
  } catch (error) {
    // Decoding failed or other error occurred
    return true; // Treat invalid tokens as expired
  }
}
