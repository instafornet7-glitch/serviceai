const DEFAULT_EMAIL = "tahar@gmail.com";
const DEFAULT_PASSWORD = "admin123";
const AUTH_EVENT = "serviceai-admin-auth-updated";

function announceAuthChange(): void {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function getStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("إعدادات المدير المحلية متاحة في المتصفح فقط.");
  }
  return window.localStorage;
}

export function initializeLocalAdminCredentials(): { email: string; password: string } {
  const storage = getStorage();
  const email = storage.getItem("admin_email") || DEFAULT_EMAIL;
  const password = storage.getItem("admin_password") || DEFAULT_PASSWORD;
  storage.setItem("admin_email", email);
  storage.setItem("admin_password", password);
  return { email, password };
}

export function getLocalAdminEmail(): string {
  return initializeLocalAdminCredentials().email;
}

export function loginLocalAdmin(email: string, password: string): boolean {
  const credentials = initializeLocalAdminCredentials();
  if (email.trim().toLowerCase() !== credentials.email.toLowerCase() || password !== credentials.password) {
    return false;
  }
  getStorage().setItem("admin_logged", "true");
  announceAuthChange();
  return true;
}

export function updateLocalAdminCredentials(email: string, password: string): void {
  const storage = getStorage();
  storage.setItem("admin_email", email.trim());
  storage.setItem("admin_password", password);
  announceAuthChange();
}

export function isLocalAdminLoggedIn(): boolean {
  return getStorage().getItem("admin_logged") === "true";
}

export function logoutLocalAdmin(): void {
  getStorage().removeItem("admin_logged");
  announceAuthChange();
}
