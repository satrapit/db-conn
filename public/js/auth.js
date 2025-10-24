/**
 * Authentication Module
 * Handles OTP-based authentication with token management and cookies
 */

const AuthModule = (function () {
	'use strict';

	// Configuration
	const CONFIG = {
		API_URL: 'https://portal.com/api',
		TOKEN_KEY: 'auth_token',
		COOKIE_NAME: 'db_conn_auth',
		COOKIE_DAYS: 30,
		PANEL_URL: '/panel'
	};

	// Quick pre-check before DOM loads to prevent page flash
	(function immediateAuthCheck() {
		// Get token from localStorage or cookie
		function getToken() {
			let token = localStorage.getItem(CONFIG.TOKEN_KEY);
			if (!token) {
				const cookies = document.cookie.split(';');
				for (let cookie of cookies) {
					const [name, value] = cookie.trim().split('=');
					if (name === CONFIG.COOKIE_NAME) {
						token = value;
						break;
					}
				}
			}
			return token;
		}

		const token = getToken();
		const currentPath = window.location.pathname;

		// If on signin page and has token, redirect to panel immediately
		if (currentPath.includes('signin')) {
			if (token) {
				console.log('AuthModule: Pre-check - Token found on signin, redirecting to panel');
				window.location.replace(CONFIG.PANEL_URL);
			}
		}
		// If on panel page and no token, redirect to signin immediately
		else if (currentPath.includes('panel') || document.querySelector('[data-page="panel"]')) {
			if (!token) {
				console.log('AuthModule: Pre-check - No token on panel, redirecting to signin');
				window.location.replace('/signin');
			}
		}
	})();	// Cookie utilities
	const CookieUtils = {
		/**
		 * Set a cookie
		 * @param {string} name - Cookie name
		 * @param {string} value - Cookie value
		 * @param {number} days - Expiration days
		 */
		set: function (name, value, days) {
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
		get: function (name) {
			const nameEQ = name + "=";
			const ca = document.cookie.split(';');
			for (let i = 0; i < ca.length; i++) {
				let c = ca[i];
				while (c.charAt(0) === ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
		},

		/**
		 * Delete a cookie
		 * @param {string} name - Cookie name
		 */
		delete: function (name) {
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
		}
	};

	// Token utilities
	const TokenUtils = {
		/**
		 * Save authentication token
		 * @param {string} token - JWT token
		 */
		save: function (token) {
			console.log('AuthModule: Saving token');
			localStorage.setItem(CONFIG.TOKEN_KEY, token);
			CookieUtils.set(CONFIG.COOKIE_NAME, token, CONFIG.COOKIE_DAYS);
			console.log('AuthModule: Token saved successfully');
		},

		/**
		 * Get authentication token
		 * @returns {string|null} Token or null
		 */
		get: function () {
			// Try localStorage first
			let token = localStorage.getItem(CONFIG.TOKEN_KEY);

			// If not in localStorage, try cookie
			if (!token) {
				token = CookieUtils.get(CONFIG.COOKIE_NAME);
				if (token) {
					// Sync to localStorage
					localStorage.setItem(CONFIG.TOKEN_KEY, token);
				}
			}

			return token;
		},

		/**
		 * Remove authentication token
		 */
		remove: function () {
			localStorage.removeItem(CONFIG.TOKEN_KEY);
			CookieUtils.delete(CONFIG.COOKIE_NAME);
		},

		/**
		 * Validate token with API
		 * @returns {Promise<boolean>} True if valid
		 */
		validate: async function () {
			const token = this.get();

			if (!token) {
				console.log('AuthModule: No token found');
				return false;
			}

			try {
				console.log('AuthModule: Validating token...');
				const response = await fetch(CONFIG.API_URL + '/validate-token', {
					method: 'GET',
					headers: {
						'Authorization': 'Bearer ' + token,
						'Content-Type': 'application/json'
					}
				});

				const data = await response.json();

				if (data.success) {
					console.log('AuthModule: Token is valid');
					return true;
				} else {
					console.log('AuthModule: Token is invalid', data);
					// Token is invalid, remove it
					this.remove();
					return false;
				}
			} catch (error) {
				console.error('AuthModule: Error validating token', error);
				// Don't remove token on network errors, just return false
				// This prevents redirect loops on temporary network issues
				return false;
			}
		}
	};

	/**
	 * Initialize authentication on signin page
	 */
	function initSigninPage() {
		// Elements
		const phoneStep = document.getElementById('phone-step');
		const otpStep = document.getElementById('otp-step');
		const phoneInput = document.getElementById('phone');
		const otpInput = document.getElementById('otp');
		const sendOtpBtn = document.getElementById('send-otp-btn');
		const verifyOtpBtn = document.getElementById('verify-otp-btn');
		const editPhoneBtn = document.getElementById('edit-phone-btn');
		const displayPhone = document.getElementById('display-phone');
		const resendOtpBtn = document.getElementById('resend-otp-btn');
		const alertContainer = document.getElementById('alert-container');
		const alertMessage = document.getElementById('alert-message');
		const countdownContainer = document.getElementById('countdown-container');
		const countdownEl = document.getElementById('countdown');
		const phoneCountdownContainer = document.getElementById('phone-countdown-container');
		const phoneCountdownEl = document.getElementById('phone-countdown');

		if (!phoneStep || !otpStep) {
			return; // Not on signin page
		}

		let currentPhone = '';
		let countdownInterval = null;
		let phoneCountdownInterval = null;

		// Check if user is already logged in
		function checkAuthStatus() {
			const token = TokenUtils.get();

			if (token) {
				// Token exists, redirect to panel
				// Panel page will do proper validation
				console.log('AuthModule: Token found, redirecting to panel');
				window.location.href = CONFIG.PANEL_URL;
				return;
			}

			// No token, show the form
			console.log('AuthModule: No token found, showing login form');
			phoneStep.style.display = 'block';
		}

		// Show alert
		function showAlert(message, type = 'error') {
			// Reset all classes first
			alertMessage.className = 'w-full p-4 rounded-lg text-sm transition-all duration-300';

			// Add type-specific classes
			if (type === 'error') {
				alertMessage.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-400');
			} else if (type === 'success') {
				alertMessage.classList.add('bg-green-100', 'text-green-700', 'border', 'border-green-400');
			} else {
				alertMessage.classList.add('bg-blue-100', 'text-blue-700', 'border', 'border-blue-400');
			}

			alertMessage.textContent = message;

			// Make visible with smooth transition
			alertMessage.classList.remove('opacity-0', 'invisible');
			alertMessage.classList.add('opacity-100', 'visible');

			// Keep the last message visible - don't auto-hide
		}

		// Format seconds to MM:SS
		function formatTime(seconds) {
			const mins = Math.floor(seconds / 60);
			const secs = seconds % 60;
			return `${mins}:${secs.toString().padStart(2, '0')}`;
		}

		// Clear alert (hide it smoothly)
		function clearAlert() {
			alertMessage.classList.remove('opacity-100', 'visible');
			alertMessage.classList.add('opacity-0', 'invisible');
		}

		// Start countdown timer for OTP step
		function startCountdown(seconds) {
			countdownContainer.classList.remove('hidden');
			resendOtpBtn.classList.add('hidden');
			let remaining = seconds;

			countdownEl.textContent = remaining;

			if (countdownInterval) {
				clearInterval(countdownInterval);
			}

			countdownInterval = setInterval(() => {
				remaining--;
				countdownEl.textContent = remaining;

				if (remaining <= 0) {
					clearInterval(countdownInterval);
					countdownContainer.classList.add('hidden');
					resendOtpBtn.classList.remove('hidden');
				}
			}, 1000);
		}

		// Start countdown timer for Phone step (rate limit)
		function startPhoneCountdown(seconds) {
			phoneCountdownContainer.classList.remove('hidden');
			sendOtpBtn.disabled = true;
			sendOtpBtn.classList.add('opacity-50', 'cursor-not-allowed');
			let remaining = seconds;

			phoneCountdownEl.textContent = formatTime(remaining);

			if (phoneCountdownInterval) {
				clearInterval(phoneCountdownInterval);
			}

			phoneCountdownInterval = setInterval(() => {
				remaining--;
				phoneCountdownEl.textContent = formatTime(remaining);

				if (remaining <= 0) {
					clearInterval(phoneCountdownInterval);
					phoneCountdownContainer.classList.add('hidden');
					sendOtpBtn.disabled = false;
					sendOtpBtn.classList.remove('opacity-50', 'cursor-not-allowed');
				}
			}, 1000);
		}

		// Switch to OTP step
		function showOtpStep() {
			// Clear phone countdown if active
			if (phoneCountdownInterval) {
				clearInterval(phoneCountdownInterval);
				phoneCountdownContainer.classList.add('hidden');
			}

			phoneStep.classList.add('hidden');
			phoneStep.style.display = 'none';
			otpStep.classList.remove('hidden');
			otpStep.style.display = 'block';
			displayPhone.textContent = currentPhone;
			otpInput.value = '';
			otpInput.focus();
		}

		// Switch back to phone step
		function showPhoneStep() {
			// Clear current alerts when switching back
			clearAlert();

			otpStep.classList.add('hidden');
			otpStep.style.display = 'none';
			phoneStep.classList.remove('hidden');
			phoneStep.style.display = 'block';
			otpInput.value = '';
			resendOtpBtn.classList.add('hidden');

			if (countdownInterval) {
				clearInterval(countdownInterval);
				countdownContainer.classList.add('hidden');
			}
		}

		// Send OTP
		async function sendOtp() {
			const phone = phoneInput.value.trim();

			if (!phone.match(/^09\d{9}$/)) {
				showAlert('شماره موبایل نامعتبر است', 'error');
				return;
			}

			sendOtpBtn.disabled = true;
			sendOtpBtn.textContent = 'در حال ارسال...';

			try {
				const response = await fetch(CONFIG.API_URL + '/send-otp', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ phone: phone })
				});

				const data = await response.json();

				if (data.success) {
					currentPhone = phone;
					showOtpStep();
					showAlert(data.message + (data.debug_otp ? ' (کد: ' + data.debug_otp + ')' : ''), 'success');

					// Start countdown with remaining time or default 2 minutes
					const countdownTime = data.remaining || 120;
					startCountdown(countdownTime);
				} else {
					// Check if this is a rate limit error for the same phone number
					// If so, the previous OTP is still valid, so show the OTP form
					if (data.remaining && phone === currentPhone) {
						showOtpStep();
						showAlert('کد قبلی هنوز معتبر است. لطفا کد ارسال شده را وارد کنید', 'info');
						startCountdown(data.remaining);
					} else {
						// Different phone or other error - show countdown on phone step
						showAlert(data.message, 'error');

						if (data.remaining) {
							startPhoneCountdown(data.remaining);
						}
					}
				}
			} catch (error) {
				showAlert('خطا در ارسال درخواست', 'error');
			} finally {
				sendOtpBtn.disabled = false;
				sendOtpBtn.textContent = 'ارسال کد تایید';
			}
		}

		// Send OTP button click
		sendOtpBtn.addEventListener('click', sendOtp);

		// Verify OTP
		verifyOtpBtn.addEventListener('click', async function () {
			const otp = otpInput.value.trim();

			if (!otp.match(/^\d{6}$/)) {
				showAlert('کد تایید باید 6 رقم باشد', 'error');
				return;
			}

			verifyOtpBtn.disabled = true;
			verifyOtpBtn.textContent = 'در حال تایید...';

			try {
				const response = await fetch(CONFIG.API_URL + '/verify-otp', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						phone: currentPhone,
						code: otp
					})
				});

				const data = await response.json();

				if (data.success && data.token) {
					// Save token to localStorage and cookie
					TokenUtils.save(data.token);

					showAlert('ورود موفقیت‌آمیز بود', 'success');

					// Redirect to panel
					setTimeout(() => {
						window.location.href = CONFIG.PANEL_URL;
					}, 1000);
				} else {
					showAlert(data.message || 'کد نامعتبر است', 'error');
				}
			} catch (error) {
				showAlert('خطا در تایید کد', 'error');
			} finally {
				verifyOtpBtn.disabled = false;
				verifyOtpBtn.textContent = 'تایید کد';
			}
		});

		// Edit phone button - go back to phone step
		editPhoneBtn.addEventListener('click', function () {
			showPhoneStep();
		});

		// Resend OTP button
		resendOtpBtn.addEventListener('click', async function () {
			if (!currentPhone) {
				return;
			}

			resendOtpBtn.disabled = true;
			resendOtpBtn.textContent = 'در حال ارسال...';

			try {
				const response = await fetch(CONFIG.API_URL + '/send-otp', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ phone: currentPhone })
				});

				const data = await response.json();

				if (data.success) {
					showAlert(data.message + (data.debug_otp ? ' (کد: ' + data.debug_otp + ')' : ''), 'success');
					otpInput.value = '';
					otpInput.focus();

					// Reset countdown with remaining time or default 2 minutes
					const countdownTime = data.remaining || 120;
					startCountdown(countdownTime);
				} else {
					showAlert(data.message, 'error');

					// If there's remaining time, restart countdown
					if (data.remaining) {
						startCountdown(data.remaining);
					}
				}
			} catch (error) {
				showAlert('خطا در ارسال درخواست', 'error');
			} finally {
				resendOtpBtn.disabled = false;
				resendOtpBtn.textContent = 'ارسال مجدد کد';
			}
		});

		// Allow Enter key to submit
		phoneInput.addEventListener('keypress', function (e) {
			if (e.key === 'Enter') {
				sendOtpBtn.click();
			}
		});

		otpInput.addEventListener('keypress', function (e) {
			if (e.key === 'Enter') {
				verifyOtpBtn.click();
			}
		});

		// Check auth status on page load
		checkAuthStatus();
	}

	/**
	 * Check authentication status on protected pages
	 * Redirects to signin if not authenticated
	 */
	async function checkProtectedPage() {
		const token = TokenUtils.get();

		// If no token at all, redirect immediately
		if (!token) {
			console.log('AuthModule: No token found on protected page, redirecting to signin');
			window.location.replace('/signin');
			return;
		}

		// Token exists, try to validate it
		try {
			const isValid = await TokenUtils.validate();

			if (!isValid) {
				// Token validation failed, redirect to signin
				console.log('AuthModule: Token validation failed, redirecting to signin');
				window.location.replace('/signin');
			} else {
				console.log('AuthModule: Token is valid, access granted');
				// Show the page content
				const panel = document.querySelector('[data-page="panel"]');
				if (panel) {
					panel.style.opacity = '1';
				}
			}
		} catch (error) {
			// CORS or network error - token exists but can't validate
			// For now, allow access (user has token)
			// TODO: Fix CORS on API server for proper validation
			console.warn('AuthModule: Cannot validate token due to CORS/network error, allowing access');
			console.warn('IMPORTANT: Please configure CORS headers on your API server!');

			// Show the page content anyway
			const panel = document.querySelector('[data-page="panel"]');
			if (panel) {
				panel.style.opacity = '1';
			}
		}
	}

	/**
	 * Logout user
	 */
	function logout() {
		TokenUtils.remove();
		window.location.href = '/signin';
	}

	// Public API
	return {
		init: initSigninPage,
		checkAuth: checkProtectedPage,
		logout: logout,
		getToken: TokenUtils.get,
		isAuthenticated: TokenUtils.validate
	};

})();

// Export for ES6 modules
export default AuthModule;
