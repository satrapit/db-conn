/**
 * Sign In Page
 * Handles OTP-based authentication flow
 */

import { TokenManager } from '../modules/auth.js';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';

/**
 * Initialize signin page
 */
export function initSigninPage() {
	logger.info('Signin', 'Initializing signin page');

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
	const alertMessage = document.getElementById('alert-message');
	const countdownContainer = document.getElementById('countdown-container');
	const countdownEl = document.getElementById('countdown');
	const phoneCountdownContainer = document.getElementById('phone-countdown-container');
	const phoneCountdownEl = document.getElementById('phone-countdown');

	if (!phoneStep || !otpStep) {
		logger.debug('Signin', 'Required elements not found, not on signin page');
		return; // Not on signin page
	}

	let currentPhone = '';
	let countdownInterval = null;
	let phoneCountdownInterval = null;

	/**
	 * Check if user is already logged in
	 */
	function checkAuthStatus() {
		const token = TokenManager.get();
		logger.debug('Signin', 'Checking auth status:', { hasToken: !!token });

		if (token) {
			// Token exists, redirect to panel
			logger.info('Signin', 'Token found, redirecting to panel');
			window.location.href = CONFIG.PANEL_URL;
			return;
		}

		// No token, show the form
		logger.debug('Signin', 'No token found, showing login form');
		phoneStep.style.display = 'block';
	}

	/**
	 * Show alert message
	 * @param {string} message - Alert message
	 * @param {string} type - Alert type (error, success, info)
	 */
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
	}

	/**
	 * Clear alert message
	 */
	function clearAlert() {
		alertMessage.classList.remove('opacity-100', 'visible');
		alertMessage.classList.add('opacity-0', 'invisible');
	}

	/**
	 * Format seconds to MM:SS
	 * @param {number} seconds - Seconds to format
	 * @returns {string} Formatted time
	 */
	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	/**
	 * Start countdown timer for OTP step
	 * @param {number} seconds - Countdown duration in seconds
	 */
	function startCountdown(seconds) {
		logger.debug('Signin', 'Starting OTP countdown:', seconds, 'seconds');
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
				logger.debug('Signin', 'OTP countdown finished, showing resend button');
			}
		}, 1000);
	}

	/**
	 * Start countdown timer for Phone step (rate limit)
	 * @param {number} seconds - Countdown duration in seconds
	 */
	function startPhoneCountdown(seconds) {
		logger.debug('Signin', 'Starting phone rate limit countdown:', seconds, 'seconds');
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
				logger.debug('Signin', 'Phone rate limit countdown finished');
			}
		}, 1000);
	}

	/**
	 * Switch to OTP step
	 */
	function showOtpStep() {
		logger.debug('Signin', 'Switching to OTP step for phone:', currentPhone);

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

	/**
	 * Switch back to phone step
	 */
	function showPhoneStep() {
		logger.debug('Signin', 'Switching back to phone step');
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

	/**
	 * Send OTP to phone number
	 */
	async function sendOtp() {
		const phone = phoneInput.value.trim();
		logger.debug('Signin', 'Attempting to send OTP to phone:', phone);

		if (!phone.match(/^09\d{9}$/)) {
			logger.warn('Signin', 'Invalid phone number format:', phone);
			showAlert('شماره موبایل نامعتبر است', 'error');
			return;
		}

		sendOtpBtn.disabled = true;
		sendOtpBtn.textContent = 'در حال ارسال...';

		try {
			logger.apiRequest('Signin', 'POST', CONFIG.API_URL + '/send-otp', { phone });

			const response = await fetch(CONFIG.API_URL + '/send-otp', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ phone: phone })
			});

			const data = await response.json();
			logger.apiResponse('Signin', response.status, data);

			if (data.success) {
				currentPhone = phone;
				showOtpStep();
				showAlert(data.message + (data.debug_otp ? ' (کد: ' + data.debug_otp + ')' : ''), 'success');

				// Start countdown with remaining time or default 2 minutes
				const countdownTime = data.remaining || 120;
				startCountdown(countdownTime);
			} else {
				// Check if this is a rate limit error for the same phone number
				if (data.remaining && phone === currentPhone) {
					logger.debug('Signin', 'Rate limit for same phone, showing OTP step with countdown');
					showOtpStep();
					showAlert('کد قبلی هنوز معتبر است. لطفا کد ارسال شده را وارد کنید', 'info');
					startCountdown(data.remaining);
				} else {
					// Different phone or other error
					logger.warn('Signin', 'Send OTP failed:', data.message);
					showAlert(data.message, 'error');

					if (data.remaining) {
						startPhoneCountdown(data.remaining);
					}
				}
			}
		} catch (error) {
			logger.error('Signin', 'Error sending OTP:', error);
			showAlert('خطا در ارسال درخواست', 'error');
		} finally {
			sendOtpBtn.disabled = false;
			sendOtpBtn.textContent = 'ارسال کد تایید';
		}
	}

	/**
	 * Verify OTP code
	 */
	async function verifyOtp() {
		const otp = otpInput.value.trim();
		logger.debug('Signin', 'Attempting to verify OTP for phone:', currentPhone);

		if (!otp.match(/^\d{6}$/)) {
			logger.warn('Signin', 'Invalid OTP format:', otp);
			showAlert('کد تایید باید 6 رقم باشد', 'error');
			return;
		}

		verifyOtpBtn.disabled = true;
		verifyOtpBtn.textContent = 'در حال تایید...';

		try {
			logger.apiRequest('Signin', 'POST', CONFIG.API_URL + '/verify-otp', { phone: currentPhone, code: otp });

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
			logger.apiResponse('Signin', response.status, data);

			if (data.success && data.token) {
				logger.info('Signin', 'OTP verification successful, saving token and redirecting');

				// Save token
				TokenManager.save(data.token);

				showAlert('ورود موفقیت‌آمیز بود', 'success');

				// Redirect to panel
				setTimeout(() => {
					window.location.href = CONFIG.PANEL_URL;
				}, 1000);
			} else {
				logger.warn('Signin', 'OTP verification failed:', data.message);
				showAlert(data.message || 'کد نامعتبر است', 'error');
			}
		} catch (error) {
			logger.error('Signin', 'Error verifying OTP:', error);
			showAlert('خطا در تایید کد', 'error');
		} finally {
			verifyOtpBtn.disabled = false;
			verifyOtpBtn.textContent = 'تایید کد';
		}
	}

	/**
	 * Resend OTP code
	 */
	async function resendOtp() {
		if (!currentPhone) {
			logger.warn('Signin', 'Resend OTP called without phone number');
			return;
		}

		logger.debug('Signin', 'Resending OTP to phone:', currentPhone);
		resendOtpBtn.disabled = true;
		resendOtpBtn.textContent = 'در حال ارسال...';

		try {
			logger.apiRequest('Signin', 'POST', CONFIG.API_URL + '/send-otp', { phone: currentPhone });

			const response = await fetch(CONFIG.API_URL + '/send-otp', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ phone: currentPhone })
			});

			const data = await response.json();
			logger.apiResponse('Signin', response.status, data);

			if (data.success) {
				logger.info('Signin', 'OTP resent successfully');
				showAlert(data.message + (data.debug_otp ? ' (کد: ' + data.debug_otp + ')' : ''), 'success');
				otpInput.value = '';
				otpInput.focus();

				// Reset countdown
				const countdownTime = data.remaining || 120;
				startCountdown(countdownTime);
			} else {
				logger.warn('Signin', 'Resend OTP failed:', data.message);
				showAlert(data.message, 'error');

				if (data.remaining) {
					startCountdown(data.remaining);
				}
			}
		} catch (error) {
			logger.error('Signin', 'Error resending OTP:', error);
			showAlert('خطا در ارسال درخواست', 'error');
		} finally {
			resendOtpBtn.disabled = false;
			resendOtpBtn.textContent = 'ارسال مجدد کد';
		}
	}

	// Event listeners
	sendOtpBtn.addEventListener('click', sendOtp);
	verifyOtpBtn.addEventListener('click', verifyOtp);
	editPhoneBtn.addEventListener('click', showPhoneStep);
	resendOtpBtn.addEventListener('click', resendOtp);

	// Allow Enter key to submit
	phoneInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') sendOtpBtn.click();
	});

	otpInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') verifyOtpBtn.click();
	});

	// Check auth status on page load
	checkAuthStatus();
}
