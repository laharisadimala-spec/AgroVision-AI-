import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
// Ensure GEMINI_API_KEY is set in your .env.local file
const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey && process.env.NODE_ENV === 'production') {
  console.warn('GEMINI_API_KEY is missing in environment variables.');
}

export const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiModel = (modelName: string = 'gemini-2.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};

/** Returns true when the error is a quota / rate-limit response from Gemini. */
export function isQuotaError(error: unknown): boolean {
  if (!error) return false;
  const msg: string = (error as any)?.message ?? String(error);
  const status: number = (error as any)?.status ?? (error as any)?.statusCode ?? 0;
  return (
    status === 429 ||
    /quota/i.test(msg) ||
    /rate.?limit/i.test(msg) ||
    /resource.?exhausted/i.test(msg) ||
    /too many requests/i.test(msg) ||
    /RESOURCE_EXHAUSTED/i.test(msg)
  );
}

/** Returns true for transient server-side errors worth retrying. */
export function isTransientError(error: unknown): boolean {
  if (!error) return false;
  const msg: string = (error as any)?.message ?? String(error);
  const status: number = (error as any)?.status ?? (error as any)?.statusCode ?? 0;
  return (
    status === 500 ||
    status === 503 ||
    /service.?unavailable/i.test(msg) ||
    /internal.?error/i.test(msg) ||
    /overloaded/i.test(msg) ||
    /temporarily/i.test(msg)
  );
}

/**
 * Runs `fn` up to `maxAttempts` times, retrying on quota / transient errors
 * with exponential back-off (1 s → 2 s → 4 s, capped at 8 s).
 */
export async function withGeminiRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const shouldRetry = isQuotaError(err) || isTransientError(err);
      if (!shouldRetry || attempt === maxAttempts) throw err;

      const delayMs = Math.min(1000 * 2 ** (attempt - 1), 8000);
      console.warn(
        `[Gemini] Attempt ${attempt} failed (${(err as any)?.message ?? err}). ` +
        `Retrying in ${delayMs}ms…`
      );
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
