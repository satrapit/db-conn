/**
 * Services Page
 * Service management and subscriptions
 */

import { TokenManager } from '../modules/auth.js';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';

/**
 * Initialize services page
 */
export async function initServicesPage() {
	logger.info('Services', 'Initializing services page');

	const token = TokenManager.get();
	if (!token) {
		logger.warn('Services', 'No token found, redirecting to signin');
		window.location.replace(CONFIG.SIGNIN_URL);
		return;
	}

	const result = await TokenManager.validate();
	if (result.valid || result.error === 'NETWORK_ERROR') {
		logger.info('Services', 'Access granted');
		showServicesContent();
		initializePlanButtons();
	} else {
		logger.warn('Services', 'Invalid token, redirecting to signin');
		window.location.replace(CONFIG.SIGNIN_URL);
	}
}

/**
 * Show services content
 */
function showServicesContent() {
	const page = document.querySelector('[data-page="services"]');
	if (page) {
		page.style.opacity = '1';
		logger.debug('Services', 'Services content displayed');
	}
}

/**
 * Initialize plan upgrade/downgrade buttons
 */
function initializePlanButtons() {
	const planButtons = document.querySelectorAll('.plan-card button');
	planButtons.forEach(button => {
		button.addEventListener('click', handlePlanAction);
	});
}

/**
 * Handle plan action button clicks
 */
function handlePlanAction(e) {
	const planCard = e.target.closest('.plan-card');
	const planName = planCard.querySelector('.plan-name').textContent;
	const buttonText = e.target.textContent;
	logger.info('Services', `Plan action: ${buttonText} for ${planName}`);
	// Add your plan action logic here
}
