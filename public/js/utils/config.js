/**
 * Application Configuration
 */

// Get page slugs from window object (set by PHP)
const pageData = window.dbConnPageData || {};

export const CONFIG = {
	API_URL: 'https://portal.com/api',
	TOKEN_KEY: 'auth_token',
	COOKIE_NAME: 'db_conn_auth',
	COOKIE_DAYS: 30,
	PANEL_URL: pageData.panelUrl || '/panel',
	SIGNIN_URL: pageData.signinUrl || '/signin',
	HOME_URL: pageData.homeUrl || '/home',
	SERVICES_URL: pageData.servicesUrl || '/services',
	HELP_URL: pageData.helpUrl || '/help',
	PROFILE_URL: pageData.profileUrl || '/profile',
	ABOUT_URL: pageData.aboutUrl || '/about',
	DEBUG_MODE: true  // Set to false in production
};
