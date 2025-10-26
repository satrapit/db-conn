/**
 * Debug Logger Utility
 * Provides conditional logging based on DEBUG_MODE configuration
 */

import { CONFIG } from './config.js';

/**
 * Logger class for debugging
 */
class Logger {
	constructor() {
		this.debugMode = CONFIG.DEBUG_MODE;
		this.prefix = '[DB-Conn]';
	}

	/**
	 * Check if debug mode is enabled
	 * @returns {boolean}
	 */
	isEnabled() {
		return this.debugMode === true;
	}

	/**
	 * Format message with prefix and module name
	 * @param {string} module - Module name
	 * @param {string} message - Log message
	 * @returns {string}
	 */
	formatMessage(module, message) {
		return `${this.prefix} [${module}] ${message}`;
	}

	/**
	 * Log informational message
	 * @param {string} module - Module name
	 * @param {string} message - Log message
	 * @param {...any} args - Additional arguments
	 */
	log(module, message, ...args) {
		if (this.isEnabled()) {
			console.log(this.formatMessage(module, message), ...args);
		}
	}

	/**
	 * Log informational message (alias for log)
	 * @param {string} module - Module name
	 * @param {string} message - Log message
	 * @param {...any} args - Additional arguments
	 */
	info(module, message, ...args) {
		if (this.isEnabled()) {
			console.info(this.formatMessage(module, message), ...args);
		}
	}

	/**
	 * Log warning message
	 * @param {string} module - Module name
	 * @param {string} message - Warning message
	 * @param {...any} args - Additional arguments
	 */
	warn(module, message, ...args) {
		if (this.isEnabled()) {
			console.warn(this.formatMessage(module, message), ...args);
		}
	}

	/**
	 * Log error message (always logged, even in production)
	 * @param {string} module - Module name
	 * @param {string} message - Error message
	 * @param {...any} args - Additional arguments
	 */
	error(module, message, ...args) {
		// Errors are always logged
		console.error(this.formatMessage(module, message), ...args);
	}

	/**
	 * Log debug message with detailed information
	 * @param {string} module - Module name
	 * @param {string} message - Debug message
	 * @param {object} data - Debug data object
	 */
	debug(module, message, data = null) {
		if (this.isEnabled()) {
			if (data) {
				console.log(this.formatMessage(module, message), data);
			} else {
				console.log(this.formatMessage(module, message));
			}
		}
	}

	/**
	 * Log group start
	 * @param {string} module - Module name
	 * @param {string} groupName - Group name
	 */
	group(module, groupName) {
		if (this.isEnabled()) {
			console.group(this.formatMessage(module, groupName));
		}
	}

	/**
	 * Log collapsed group start
	 * @param {string} module - Module name
	 * @param {string} groupName - Group name
	 */
	groupCollapsed(module, groupName) {
		if (this.isEnabled()) {
			console.groupCollapsed(this.formatMessage(module, groupName));
		}
	}

	/**
	 * Log group end
	 */
	groupEnd() {
		if (this.isEnabled()) {
			console.groupEnd();
		}
	}

	/**
	 * Log table data
	 * @param {string} module - Module name
	 * @param {string} label - Table label
	 * @param {object} data - Data to display in table
	 */
	table(module, label, data) {
		if (this.isEnabled()) {
			console.log(this.formatMessage(module, label));
			console.table(data);
		}
	}

	/**
	 * Log execution time
	 * @param {string} module - Module name
	 * @param {string} label - Timer label
	 */
	time(module, label) {
		if (this.isEnabled()) {
			console.time(this.formatMessage(module, label));
		}
	}

	/**
	 * End execution time logging
	 * @param {string} module - Module name
	 * @param {string} label - Timer label
	 */
	timeEnd(module, label) {
		if (this.isEnabled()) {
			console.timeEnd(this.formatMessage(module, label));
		}
	}

	/**
	 * Log API request
	 * @param {string} module - Module name
	 * @param {string} method - HTTP method
	 * @param {string} url - Request URL
	 * @param {object} data - Request data
	 */
	apiRequest(module, method, url, data = null) {
		if (this.isEnabled()) {
			this.group(module, `API Request: ${method} ${url}`);
			if (data) {
				console.log('Request Data:', data);
			}
			this.groupEnd();
		}
	}

	/**
	 * Log API response
	 * @param {string} module - Module name
	 * @param {string} method - HTTP method
	 * @param {string} url - Request URL
	 * @param {object} response - Response data
	 */
	apiResponse(module, method, url, response) {
		if (this.isEnabled()) {
			this.group(module, `API Response: ${method} ${url}`);
			console.log('Response:', response);
			this.groupEnd();
		}
	}

	/**
	 * Log state change
	 * @param {string} module - Module name
	 * @param {string} stateName - State name
	 * @param {any} oldValue - Old value
	 * @param {any} newValue - New value
	 */
	stateChange(module, stateName, oldValue, newValue) {
		if (this.isEnabled()) {
			console.log(
				this.formatMessage(module, `State Changed: ${stateName}`),
				{ from: oldValue, to: newValue }
			);
		}
	}
}

// Export singleton instance
export const logger = new Logger();

// Export for convenience
export default logger;
