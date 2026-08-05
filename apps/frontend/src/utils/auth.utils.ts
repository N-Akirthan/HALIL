export function isTokenValid(): boolean {
  if (typeof window === "undefined") return false;

  const expiration = localStorage.getItem("tokenExpiration");
  if (!expiration) return false;

  const now = Date.now();
  return now < parseInt(expiration, 10);
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiration");
  window.location.href = "/login";
}
