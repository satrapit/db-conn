/**
 * Authentication Module
 * Handles token management, validation, and authentication state
 */

import { CookieUtils } from '../utils/cookie.js';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';

/**
 * Token Management
 */
export const TokenManager = {
	/**
	 * Save authentication token
	 * @param {string} token - JWT token
	 */
	save(token) {
		logger.debug('Auth', 'Saving token to localStorage and cookie');
		localStorage.setItem(CONFIG.TOKEN_KEY, token);
		CookieUtils.set(CONFIG.COOKIE_NAME, token, CONFIG.COOKIE_DAYS);
		logger.info('Auth', 'Token saved successfully');
	},

	/**
	 * Get authentication token
	 * @returns {string|null} Token or null
	 */
	get() {
		// Try localStorage first
		let token = localStorage.getItem(CONFIG.TOKEN_KEY);

		// If not in localStorage, try cookie
		if (!token) {
			logger.debug('Auth', 'Token not in localStorage, checking cookie');
			token = CookieUtils.get(CONFIG.COOKIE_NAME);
			if (token) {
				// Sync to localStorage
				logger.debug('Auth', 'Token found in cookie, syncing to localStorage');
				localStorage.setItem(CONFIG.TOKEN_KEY, token);
			}
		}

		return token;
	},

	/**
	 * Remove authentication token
	 */
	remove() {
		logger.debug('Auth', 'Removing token from localStorage and cookie');
		localStorage.removeItem(CONFIG.TOKEN_KEY);
		CookieUtils.delete(CONFIG.COOKIE_NAME);
		logger.info('Auth', 'Token removed successfully');
	},

	/**
	 * Validate token with API
	 * @returns {Promise<{valid: boolean, error: string|null}>} Validation result
	 */
	async validate() {
		const token = this.get();

		if (!token) {
			logger.warn('Auth', 'Token validation failed: No token found');
			return { valid: false, error: 'NO_TOKEN' };
		}

		try {
			logger.debug('Auth', 'Validating token with API');
			logger.apiRequest('Auth', 'GET', CONFIG.API_URL + '/validate-token');

			const response = await fetch(CONFIG.API_URL + '/validate-token', {
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + token,
					'Content-Type': 'application/json'
				}
			});

			logger.apiResponse('Auth', response.status, response.statusText);

			// Check HTTP status codes
			if (response.status === 401 || response.status === 403) {
				logger.warn('Auth', 'Token is invalid (unauthorized), removing token');
				// Token is genuinely invalid, remove it
				this.remove();
				return { valid: false, error: 'INVALID_TOKEN' };
			}

			const data = await response.json();
			logger.debug('Auth', 'Validation response:', data);

			if (data.success) {
				logger.info('Auth', 'Token is valid');
				return { valid: true, error: null };
			} else {
				logger.warn('Auth', 'Token is invalid according to API, removing token');
				// Token is invalid according to API, remove it
				this.remove();
				return { valid: false, error: 'INVALID_TOKEN' };
			}
		} catch (error) {
			logger.error('Auth', 'Error validating token (network/CORS):', error);
			// Network/CORS error - don't remove token, don't redirect
			// The token might still be valid, we just can't verify right now
			return { valid: false, error: 'NETWORK_ERROR' };
		}
	}
};

/**
 * Authentication Guard
 * Pre-check before DOM loads to prevent page flash
 */
export function initAuthGuard() {
	const token = TokenManager.get();
	const currentPath = window.location.pathname;

	logger.debug('Auth', 'AuthGuard checking:', { currentPath, hasToken: !!token });

	// If on signin page and has token, redirect to panel immediately
	if (currentPath.includes('signin')) {
		if (token) {
			logger.info('Auth', 'Token found on signin page, redirecting to panel');
			window.location.replace(CONFIG.PANEL_URL);
		}
	}
	// If on panel page and no token, redirect to signin immediately
	else if (currentPath.includes('panel') || document.querySelector('[data-page="panel"]')) {
		if (!token) {
			logger.info('Auth', 'No token on panel page, redirecting to signin');
			window.location.replace(CONFIG.SIGNIN_URL);
		}
	}
}

/**
 * Logout user
 */
export function logout() {
	logger.info('Auth', 'User logging out');
	TokenManager.remove();
	window.location.href = CONFIG.SIGNIN_URL;
}
