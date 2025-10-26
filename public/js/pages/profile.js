/**
 * Profile Page
 * User profile management and settings
 */

import { TokenManager } from '../modules/auth.js';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';

/**
 * Initialize profile page
 */
export async function initProfilePage() {
	logger.info('Profile', 'Initializing profile page');

	const token = TokenManager.get();
	if (!token) {
		logger.warn('Profile', 'No token found, redirecting to signin');
		window.location.replace(CONFIG.SIGNIN_URL);
		return;
	}

	const result = await TokenManager.validate();
	if (result.valid || result.error === 'NETWORK_ERROR') {
		logger.info('Profile', 'Access granted');
		showProfileContent();
		initializeToggles();
	} else {
		logger.warn('Profile', 'Invalid token, redirecting to signin');
		window.location.replace(CONFIG.SIGNIN_URL);
	}
}

/**
 * Show profile content
 */
function showProfileContent() {
	const page = document.querySelector('[data-page="profile"]');
	if (page) {
		page.style.opacity = '1';
		logger.debug('Profile', 'Profile content displayed');
	}
}

/**
 * Initialize toggle switches
 */
function initializeToggles() {
	const toggles = document.querySelectorAll('.toggle-switch input');
	toggles.forEach(toggle => {
		toggle.addEventListener('change', handleToggleChange);
	});
}

/**
 * Handle toggle switch changes
 */
function handleToggleChange(e) {
	const settingName = e.target.closest('.setting-item').querySelector('.font-medium').textContent;
	logger.info('Profile', `Setting toggled: ${settingName} - ${e.target.checked}`);
	// Add your toggle logic here
}
