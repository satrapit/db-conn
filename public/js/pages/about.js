/**
 * About Page
 * Company information and contact
 */

import { TokenManager } from '../modules/auth.js';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';

/**
 * Initialize about page
 */
export async function initAboutPage() {
	logger.info('About', 'Initializing about page');

	const token = TokenManager.get();
	if (!token) {
		logger.warn('About', 'No token found, redirecting to signin');
		window.location.replace(CONFIG.SIGNIN_URL);
		return;
	}

	const result = await TokenManager.validate();
	if (result.valid || result.error === 'NETWORK_ERROR') {
		logger.info('About', 'Access granted');
		showAboutContent();
	} else {
		logger.warn('About', 'Invalid token, redirecting to signin');
		window.location.replace(CONFIG.SIGNIN_URL);
	}
}

/**
 * Show about content
 */
function showAboutContent() {
	const page = document.querySelector('[data-page="about"]');
	if (page) {
		page.style.opacity = '1';
		logger.debug('About', 'About content displayed');
	}
}
