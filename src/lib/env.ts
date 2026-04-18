/**
 * Centralised, type-safe access to environment variables.
 * Add every variable you use here so missing values surface at startup.
 */

function getRequired(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'SSAC Frontend',
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  apiBaseUrl: getRequired('NEXT_PUBLIC_API_BASE_URL'),
} as const;
