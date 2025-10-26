/**
 * Panel Page
 * Handles authentication check and panel functionality
 */

import { TokenManager } from '../modules/auth.js';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';

/**
 * Initialize panel page
 * Validates authentication and shows page content
 */
export async function initPanelPage() {
	logger.info('Panel', 'Initializing panel page');

	const token = TokenManager.get();
	logger.debug('Panel', 'Token check:', { hasToken: !!token });

	// If no token at all, redirect immediately
	if (!token) {
		logger.warn('Panel', 'No token found, redirecting to signin');
		window.location.replace(CONFIG.SIGNIN_URL);
		return;
	}

	// Token exists, validate it
	logger.debug('Panel', 'Validating token with API');
	const result = await TokenManager.validate();
	logger.debug('Panel', 'Validation result:', result);

	if (result.valid) {
		// Token is valid, show the page
		logger.info('Panel', 'Token is valid, access granted');
		logger.stateChange('Panel', 'Auth State', 'authenticated');
		showPanelContent();
	} else if (result.error === 'INVALID_TOKEN') {
		// Token is genuinely invalid (401/403 or API said invalid)
		// Token was already removed by validate(), redirect to signin
		logger.warn('Panel', 'Token is invalid, redirecting to signin');
		logger.stateChange('Panel', 'Auth State', 'unauthenticated');
		window.location.replace(CONFIG.SIGNIN_URL);
	} else if (result.error === 'NETWORK_ERROR') {
		// Network/CORS error - can't validate but token exists
		// Allow access and show warning
		logger.warn('Panel', 'Cannot validate token due to network/CORS error');
		logger.warn('Panel', 'Allowing access since token exists. Please fix CORS on your API server!');
		logger.stateChange('Panel', 'Auth State', 'uncertain (network error)');
		showPanelContent();
	} else {
		// Unknown error, be safe and redirect
		logger.error('Panel', 'Unknown validation error, redirecting to signin');
		logger.stateChange('Panel', 'Auth State', 'error');
		window.location.replace(CONFIG.SIGNIN_URL);
	}
}

/**
 * Show panel content
 */
function showPanelContent() {
	logger.debug('Panel', 'Showing panel content');
	const panel = document.querySelector('[data-page="panel"]');
	if (panel) {
		panel.style.opacity = '1';
		logger.debug('Panel', 'Panel content displayed');
	} else {
		logger.warn('Panel', 'Panel element not found in DOM');
	}
}
