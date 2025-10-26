/**
 * Home Page
 * Dashboard functionality and statistics
 */

import { TokenManager } from '../modules/auth.js';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';

/**
 * Initialize home page
 */
export async function initHomePage() {
	logger.info('Home', 'Initializing home page');

	const token = TokenManager.get();
	if (!token) {
		logger.warn('Home', 'No token found, redirecting to signin');
		window.location.replace(CONFIG.SIGNIN_URL);
		return;
	}

	const result = await TokenManager.validate();
	if (result.valid || result.error === 'NETWORK_ERROR') {
		logger.info('Home', 'Access granted');
		showHomeContent();
		initializeQuickActions();
	} else {
		logger.warn('Home', 'Invalid token, redirecting to signin');
		window.location.replace(CONFIG.SIGNIN_URL);
	}
}

/**
 * Show home page content
 */
function showHomeContent() {
	const page = document.querySelector('[data-page="home"]');
	if (page) {
		page.style.opacity = '1';
		logger.debug('Home', 'Home content displayed');
	}
}

/**
 * Initialize quick action buttons
 */
function initializeQuickActions() {
	const actionButtons = document.querySelectorAll('.action-btn');
	actionButtons.forEach(button => {
		button.addEventListener('click', handleQuickAction);
	});
}

/**
 * Handle quick action button clicks
 */
function handleQuickAction(e) {
	const buttonText = e.currentTarget.querySelector('span').textContent;
	logger.info('Home', `Quick action clicked: ${buttonText}`);
	// Add your action logic here
}
