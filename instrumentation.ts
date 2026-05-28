// Runs once when the Node server starts. We install a global undici dispatcher
// with a retry interceptor so that transient GitHub connection resets
// (UND_ERR_SOCKET / ECONNRESET — common from CN servers) during the OAuth
// token exchange are retried automatically instead of failing the login.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { setGlobalDispatcher, Agent, interceptors } = await import('undici');
      setGlobalDispatcher(
        new Agent({
          connect: { timeout: 10_000 },
        }).compose(
          interceptors.retry({
            maxRetries: 4,
            minTimeout: 300,
            maxTimeout: 2_000,
            timeoutFactor: 2,
            methods: ['GET', 'POST'],
            errorCodes: [
              'UND_ERR_SOCKET',
              'ECONNRESET',
              'ECONNREFUSED',
              'UND_ERR_CONNECT_TIMEOUT',
              'ETIMEDOUT',
              'EPIPE',
              'EAI_AGAIN',
            ],
          }),
        ),
      );
      console.log('[instrumentation] global retry dispatcher installed');
    } catch (e) {
      console.error('[instrumentation] failed to install retry dispatcher:', e);
    }
  }
}
