/**
 * Cookie Utilities
 * Handles cookie operations
 */

export const CookieUtils = {
	/**
	 * Set a cookie
	 * @param {string} name - Cookie name
	 * @param {string} value - Cookie value
	 * @param {number} days - Expiration days
	 */
	set(name, value, days) {
		const date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		const expires = "expires=" + date.toUTCString();
		document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Strict";
	},

	/**
	 * Get a cookie value
	 * @param {string} name - Cookie name
	 * @returns {string|null} Cookie value or null
	 */
	get(name) {
		const nameEQ = name + "=";
		const ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) === 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}
		return null;
	},

	/**
	 * Delete a cookie
	 * @param {string} name - Cookie name
	 */
	delete(name) {
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
	}
};
