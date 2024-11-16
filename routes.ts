/**
 * An array of routes that are public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ["/auth/new-verification"]

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in user to /settings.
 * @type {string[]}
 */
export const authRoutes = ["/auth/login", "/auth/error"]

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"
const dashboardPrefix = "/admpanel"

/**
 * The default redirect path after logging in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = dashboardPrefix
