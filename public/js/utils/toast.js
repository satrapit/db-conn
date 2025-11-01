/**
 * Toast Notification Utility
 * Unified toast notifications using Toastify.js
 */

import Toastify from 'toastify-js';

/**
 * Toast types with predefined styles
 */
const TOAST_TYPES = {
	success: {
		background: "linear-gradient(to right, #00b09b, #96c93d)",
	},
	error: {
		background: "linear-gradient(to right, #ff5f6d, #ffc371)",
	},
	info: {
		background: "linear-gradient(to right, #3b82f6, #60a5fa)",
	},
	warning: {
		background: "linear-gradient(to right, #f59e0b, #fbbf24)",
	}
};

/**
 * Default toast configuration
 */
const DEFAULT_CONFIG = {
	duration: 3000,
	close: true,
	gravity: "bottom",
	position: "center",
	stopOnFocus: true,
};

/**
 * Show toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success', 'error', 'info', 'warning'
 * @param {object} options - Additional Toastify options to override defaults
 */
function showToast(message, type = 'info', options = {}) {
	const toastType = TOAST_TYPES[type] || TOAST_TYPES.info;

	const config = {
		...DEFAULT_CONFIG,
		text: message,
		style: {
			background: toastType.background
		},
		...options
	};

	Toastify(config).showToast();
}

/**
 * Show success toast
 * @param {string} message - Success message
 * @param {object} options - Additional options
 */
function success(message, options = {}) {
	showToast(message, 'success', options);
}

/**
 * Show error toast
 * @param {string} message - Error message
 * @param {object} options - Additional options
 */
function error(message, options = {}) {
	showToast(message, 'error', options);
}

/**
 * Show info toast
 * @param {string} message - Info message
 * @param {object} options - Additional options
 */
function info(message, options = {}) {
	showToast(message, 'info', options);
}

/**
 * Show warning toast
 * @param {string} message - Warning message
 * @param {object} options - Additional options
 */
function warning(message, options = {}) {
	showToast(message, 'warning', options);
}

/**
 * Toast utility object
 */
const toast = {
	show: showToast,
	success,
	error,
	info,
	warning,
};

export default toast;
export { showToast, success, error, info, warning };
