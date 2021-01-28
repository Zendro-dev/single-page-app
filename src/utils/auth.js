import decode from "jwt-decode";

/**
 * Validates the following conditions to determine if there is an authenticated session:
 *
 *  1) An authentication token exists in localStorage.
 *  2) The token expiration date prior to the current date.
 */
export function userIsAuthenticated() {
  const currentDate = new Date();
  const token = localStorage.getItem("token");
  let isAuthenticated = false;

  try {
    const decodedToken = decode(token);
    if (!decodedToken.hasOwnProperty("exp")) {
      throw new Error("Invalid authentication token");
    }
    const expirationDate = new Date(decodedToken.exp * 1000);
    if (currentDate >= expirationDate) {
      throw new Error("Authentication token expired");
    }
    isAuthenticated = true;
  } catch (err) {
    // SHOULD LOG AN ERROR!
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
  }

  return isAuthenticated;
}
