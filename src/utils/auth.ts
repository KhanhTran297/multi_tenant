export function isAuthenticated() {
  const token = localStorage.getItem("tokenMeta"); // Assume you're using cookies to store the token
  return !!token; // Return true if token exists, false otherwise
}
