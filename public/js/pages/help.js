/**
 * Help Page
 * Help articles, FAQ, and support
 */

import { TokenManager } from '../modules/auth.js';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';

/**
 * Initialize help page
 */
export async function initHelpPage() {
	logger.info('Help', 'Initializing help page');

	const token = TokenManager.get();
	if (!token) {
		logger.warn('Help', 'No token found, redirecting to signin');
		window.location.replace(CONFIG.SIGNIN_URL);
		return;
	}

	const result = await TokenManager.validate();
	if (result.valid || result.error === 'NETWORK_ERROR') {
		logger.info('Help', 'Access granted');
		showHelpContent();
		initializeSearch();
		initializeFAQ();
	} else {
		logger.warn('Help', 'Invalid token, redirecting to signin');
		window.location.replace(CONFIG.SIGNIN_URL);
	}
}

/**
 * Show help content
 */
function showHelpContent() {
	const page = document.querySelector('[data-page="help"]');
	if (page) {
		page.style.opacity = '1';
		logger.debug('Help', 'Help content displayed');
	}
}

/**
 * Initialize help search
 */
function initializeSearch() {
	const searchInput = document.querySelector('.help-search');
	if (searchInput) {
		searchInput.addEventListener('input', handleSearch);
	}
}

/**
 * Handle search input
 */
function handleSearch(e) {
	const query = e.target.value;
	logger.debug('Help', `Search query: ${query}`);
	// Add your search logic here
}

/**
 * Initialize FAQ accordions
 */
function initializeFAQ() {
	const faqItems = document.querySelectorAll('.faq-item');
	faqItems.forEach(item => {
		item.addEventListener('toggle', handleFAQToggle);
	});
}

/**
 * Handle FAQ toggle
 */
function handleFAQToggle(e) {
	if (e.target.open) {
		const question = e.target.querySelector('.faq-question').textContent;
		logger.debug('Help', `FAQ opened: ${question}`);
	}
}
