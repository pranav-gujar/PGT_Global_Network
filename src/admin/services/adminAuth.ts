import { AdminCredentials, AdminSession } from '../types';

const STORAGE_KEY = 'pgt_admin_session_vault';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Retrieve administrative credentials strictly from environment variables
const EXPECTED_USERNAME = (import.meta.env.VITE_ADMIN_USERNAME || '').trim();
const EXPECTED_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD || '').trim();

/**
 * Validates founder credentials against secure configured credentials.
 */
export async function authenticateFounder(credentials: AdminCredentials): Promise<AdminSession> {
  // Artificial slight delay to prevent timing analysis and provide smooth button UI transition
  await new Promise((resolve) => setTimeout(resolve, 350));

  if (!EXPECTED_USERNAME || !EXPECTED_PASSWORD) {
    throw new Error('Administrative credentials are not configured in the environment (.env).');
  }

  const inputUsername = (credentials.username || '').trim();
  const inputPassword = (credentials.password || '').trim();

  const isUsernameMatch = inputUsername.toLowerCase() === EXPECTED_USERNAME.toLowerCase();
  const isPasswordMatch = inputPassword === EXPECTED_PASSWORD;

  if (!isUsernameMatch || !isPasswordMatch) {
    throw new Error('Invalid administrative credentials. Access denied.');
  }

  // Generate cryptographically random session token
  const randomBytes = new Uint8Array(24);
  crypto.getRandomValues(randomBytes);
  const token = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const now = Date.now();
  const session: AdminSession = {
    username: EXPECTED_USERNAME,
    displayName: 'Pranav',
    role: 'Founder & CEO',
    token,
    loginTime: new Date().toISOString(),
    expiresAt: now + SEVEN_DAYS_MS,
  };

  saveAdminSession(session);
  return session;
}

/**
 * Saves the session into local storage.
 */
export function saveAdminSession(session: AdminSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('[AdminAuth] Error saving session to storage:', err);
  }
}

/**
 * Retrieves the currently active admin session, checking validity & expiration.
 */
export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const session: AdminSession = JSON.parse(raw);
    if (!session || !session.expiresAt || !session.token) {
      clearAdminSession();
      return null;
    }

    // Check expiration (7 days)
    if (Date.now() > session.expiresAt) {
      console.warn('[AdminAuth] Admin session expired.');
      clearAdminSession();
      return null;
    }

    return session;
  } catch (err) {
    console.error('[AdminAuth] Failed reading session:', err);
    clearAdminSession();
    return null;
  }
}

/**
 * Clears administrative session.
 */
export function clearAdminSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('[AdminAuth] Error clearing session:', err);
  }
}
