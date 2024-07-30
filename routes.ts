
/*
    Array of public routes
    These routes do not require authentication
*/
export const publicRoutes = [
    "/"
]

/*
    Array of private routes
    These routes require authentication
*/
export const authRoutes = [
    "/auth/login",
    "/auth/register"
]

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT_URL = "/games";