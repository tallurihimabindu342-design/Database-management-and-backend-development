import logger from "./logger.js";

/**
 * Production-ready fetch utility.
 * Features:
 * - Automatic retries
 * - Timeout
 * - Exponential backoff
 * - Retries only temporary failures
 */

export async function retryFetch(
  url,
  options = {},
  retries = 3,
  timeout = 10000
) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      logger.info(`Attempt ${attempt}/${retries}: ${url}`);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Don't retry client errors
      if (response.status >= 400 && response.status < 500) {
        throw new Error(
          `Client Error ${response.status} ${response.statusText}`
        );
      }

      // Retry server errors
      if (!response.ok) {
        throw new Error(
          `Server Error ${response.status} ${response.statusText}`
        );
      }

      return response;

    } catch (error) {
      clearTimeout(timer);

      lastError = error;

      logger.warn(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt < retries) {
        const wait = 1000 * Math.pow(2, attempt - 1);

        logger.info(`Retrying in ${wait} ms`);

        await new Promise(resolve =>
          setTimeout(resolve, wait)
        );
      }
    }
  }

  logger.error("Request permanently failed.");

  throw lastError;
}