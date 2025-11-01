/**
 * Form Validation Utility
 * Global validation functions for forms across the entire project
 */

import { logger } from './logger.js';
import toast from './toast.js';

/**
 * Validation class with various validation methods
 */
class Validator {
	constructor() {
		this.errors = {};
	}

	/**
	 * Reset errors
	 */
	reset() {
		this.errors = {};
	}

	/**
	 * Check if there are any validation errors
	 */
	hasErrors() {
		return Object.keys(this.errors).length > 0;
	}

	/**
	 * Get all errors
	 */
	getErrors() {
		return this.errors;
	}

	/**
	 * Get error for specific field
	 */
	getError(fieldName) {
		return this.errors[fieldName] || null;
	}

	/**
	 * Set error for a field
	 */
	setError(fieldName, message) {
		this.errors[fieldName] = message;
	}

	/**
	 * Sanitize string - remove HTML tags and trim whitespace
	 */
	sanitizeString(value) {
		if (typeof value !== 'string') {
			return '';
		}
		// Remove HTML tags and trim
		return value.replace(/<[^>]*>/g, '').trim();
	}

	/**
	 * Convert Persian/Arabic numerals to English numerals
	 */
	normalizeNumbers(str) {
		if (typeof str !== 'string') {
			return str;
		}

		const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
		const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
		const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

		let result = str;

		// Convert Persian numbers
		persianNumbers.forEach((persianNum, index) => {
			result = result.replace(new RegExp(persianNum, 'g'), englishNumbers[index]);
		});

		// Convert Arabic numbers
		arabicNumbers.forEach((arabicNum, index) => {
			result = result.replace(new RegExp(arabicNum, 'g'), englishNumbers[index]);
		});

		return result;
	}

	/**
	 * Validate required field
	 */
	validateRequired(value, fieldName, label = null) {
		const sanitized = this.sanitizeString(value);

		if (!sanitized || sanitized.length === 0) {
			this.setError(fieldName, `${label || fieldName} الزامی است`);
			return false;
		}

		return true;
	}

	/**
	 * Validate email format
	 */
	validateEmail(value, fieldName, required = false, label = null) {
		const sanitized = this.sanitizeString(value);

		// If not required and empty, it's valid
		if (!required && (!sanitized || sanitized.length === 0)) {
			return true;
		}

		// If required and empty, set error
		if (required && (!sanitized || sanitized.length === 0)) {
			this.setError(fieldName, `${label || 'ایمیل'} الزامی است`);
			return false;
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(sanitized)) {
			this.setError(fieldName, `${label || 'ایمیل'} نامعتبر است`);
			return false;
		}

		return true;
	}

	/**
	 * Validate Jalali date in YYYY/MM/DD format
	 * Accepts Persian, Arabic, or English numerals
	 */
	validateJalaliDate(value, fieldName, required = true, label = null) {
		const sanitized = this.sanitizeString(value);

		// If not required and empty, it's valid
		if (!required && (!sanitized || sanitized.length === 0)) {
			return true;
		}

		// If required and empty, set error
		if (required && (!sanitized || sanitized.length === 0)) {
			this.setError(fieldName, `${label || 'تاریخ'} الزامی است`);
			return false;
		}

		// Normalize Persian/Arabic numbers to English
		const normalized = this.normalizeNumbers(sanitized);

		// Check format YYYY/MM/DD
		const dateRegex = /^(\d{4})\/(\d{2})\/(\d{2})$/;
		const match = normalized.match(dateRegex);

		if (!match) {
			this.setError(fieldName, `${label || 'تاریخ'} باید به فرمت YYYY/MM/DD باشد`);
			return false;
		}

		const year = parseInt(match[1], 10);
		const month = parseInt(match[2], 10);
		const day = parseInt(match[3], 10);

		// Validate Jalali date ranges
		if (year < 1300 || year > 1500) {
			this.setError(fieldName, `سال ${label || 'تاریخ'} نامعتبر است (باید بین ۱۳۰۰ تا ۱۵۰۰ باشد)`);
			return false;
		}

		if (month < 1 || month > 12) {
			this.setError(fieldName, `ماه ${label || 'تاریخ'} نامعتبر است (باید بین ۱ تا ۱۲ باشد)`);
			return false;
		}

		// Jalali calendar day validation
		if (month >= 1 && month <= 6) {
			// First 6 months have 31 days
			if (day < 1 || day > 31) {
				this.setError(fieldName, `روز ${label || 'تاریخ'} نامعتبر است`);
				return false;
			}
		} else if (month >= 7 && month <= 11) {
			// Months 7-11 have 30 days
			if (day < 1 || day > 30) {
				this.setError(fieldName, `روز ${label || 'تاریخ'} نامعتبر است`);
				return false;
			}
		} else if (month === 12) {
			// Month 12 has 29 or 30 days (leap year)
			const isLeapYear = this.isJalaliLeapYear(year);
			const maxDay = isLeapYear ? 30 : 29;
			if (day < 1 || day > maxDay) {
				this.setError(fieldName, `روز ${label || 'تاریخ'} نامعتبر است (در سال ${year} ماه ۱۲ حداکثر ${maxDay} روز دارد)`);
				return false;
			}
		}

		return true;
	}

	/**
	 * Check if a Jalali year is a leap year
	 */
	isJalaliLeapYear(year) {
		const breaks = [
			-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181,
			1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
		];

		const gy = year + 621;
		let leapJ = -14;
		let jp = breaks[0];

		let jump;
		for (let i = 1; i < breaks.length; i++) {
			const jm = breaks[i];
			jump = jm - jp;
			if (year < jm) break;
			leapJ += Math.floor(jump / 33) * 8 + Math.floor((jump % 33) / 4);
			jp = jm;
		}

		let n = year - jp;
		if (jump) {
			leapJ += Math.floor(n / 33) * 8 + Math.floor((n % 33 + 3) / 4);
		}

		if ((jump % 33) === 4 && (jump - n) === 4) {
			leapJ++;
		}

		const leapG = Math.floor((gy / 4)) - Math.floor((((gy / 100) + 1) * 3) / 4) - 150;
		return (leapJ - leapG) === 1;
	}

	/**
	 * Convert Jalali date to Gregorian format for API (YYYY-MM-DD)
	 */
	jalaliToGregorian(jalaliDate) {
		// Normalize numbers first
		const normalized = this.normalizeNumbers(jalaliDate);

		const match = normalized.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
		if (!match) {
			return null;
		}

		const jy = parseInt(match[1], 10);
		const jm = parseInt(match[2], 10);
		const jd = parseInt(match[3], 10);

		// Jalali to Gregorian conversion algorithm
		const gy = jy + 621;
		const gm = (jm < 7) ? jm + 3 : jm - 3;
		const gd = jd;

		const breaks = [
			-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181,
			1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
		];

		let leapJ = -14;
		let jp = breaks[0];
		let jump;

		for (let i = 1; i < breaks.length; i++) {
			const jm2 = breaks[i];
			jump = jm2 - jp;
			if (jy < jm2) break;
			leapJ += Math.floor(jump / 33) * 8 + Math.floor((jump % 33) / 4);
			jp = jm2;
		}

		let n = jy - jp;
		if (jump) {
			leapJ += Math.floor(n / 33) * 8 + Math.floor((n % 33 + 3) / 4);
		}

		if ((jump % 33) === 4 && (jump - n) === 4) {
			leapJ++;
		}

		const leapG = Math.floor((gy / 4)) - Math.floor((((gy / 100) + 1) * 3) / 4) - 150;
		const march = 20 + leapJ - leapG;

		let sal_a;
		if (jump && (jump - n) < 6) {
			n = n - jump + Math.floor((jump + 4) / 33) * 33;
		}
		sal_a = Math.floor((n + 1) / 33) - 1;

		const b = (n + 1) % 33;
		const c = Math.floor(b / 4);

		if (b === 33) {
			sal_a++;
		}

		const sal_b = sal_a * 8 + c + Math.floor((b % 4) / 4);
		const gy2 = gy + Math.floor(sal_b / 366);

		const dayOfYear = ((sal_b % 366) + (jm <= 6 ? (jm - 1) * 31 : (jm - 7) * 30 + 186) + jd);

		const gregorianYear = gy2;
		const startDay = new Date(gregorianYear, 2, march); // March 20/21
		const result = new Date(startDay.getTime() + (dayOfYear - 1) * 86400000);

		const year = result.getFullYear();
		const month = String(result.getMonth() + 1).padStart(2, '0');
		const day = String(result.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	/**
	 * Validate name field (first name or last name)
	 */
	validateName(value, fieldName, label = null) {
		const sanitized = this.sanitizeString(value);

		if (!sanitized || sanitized.length === 0) {
			this.setError(fieldName, `${label || fieldName} الزامی است`);
			return false;
		}

		// Check minimum length
		if (sanitized.length < 2) {
			this.setError(fieldName, `${label || fieldName} باید حداقل ۲ کاراکتر باشد`);
			return false;
		}

		// Check maximum length
		if (sanitized.length > 50) {
			this.setError(fieldName, `${label || fieldName} باید حداکثر ۵۰ کاراکتر باشد`);
			return false;
		}

		return true;
	}

	/**
	 * Validate profile form with all fields
	 */
	validateProfileForm(formData) {
		this.reset();

		const firstName = formData.first_name || '';
		const lastName = formData.last_name || '';
		const email = formData.email || '';
		const birthDate = formData.birth_date || '';

		// Validate first name (required, sanitized)
		this.validateName(firstName, 'first_name', 'نام');

		// Validate last name (required, sanitized)
		this.validateName(lastName, 'last_name', 'نام خانوادگی');

		// Validate email (optional, sanitized)
		this.validateEmail(email, 'email', false, 'ایمیل');

		// Validate birth date (required, Jalali format)
		this.validateJalaliDate(birthDate, 'birth_date', true, 'تاریخ تولد');

		return !this.hasErrors();
	}

	/**
	 * Sanitize and prepare form data for submission
	 */
	sanitizeProfileData(formData) {
		const sanitized = {
			first_name: this.sanitizeString(formData.first_name || ''),
			last_name: this.sanitizeString(formData.last_name || ''),
			email: this.sanitizeString(formData.email || ''),
			birth_date: ''
		};

		// Normalize numbers in birth_date but keep Jalali format
		const birthDate = formData.birth_date || '';
		if (birthDate) {
			const normalized = this.normalizeNumbers(birthDate);
			sanitized.birth_date = normalized; // Store as Jalali YYYY/MM/DD
		}

		return sanitized;
	}

	/**
	 * Display validation errors in the UI
	 */
	displayErrors(errors = null) {
		const errorsToDisplay = errors || this.errors;

		// Clear previous error messages and styles
		document.querySelectorAll('.field-error').forEach(el => el.remove());
		document.querySelectorAll('.input-error').forEach(el => {
			el.classList.remove('input-error');
		});

		// If no errors, return
		if (Object.keys(errorsToDisplay).length === 0) {
			return;
		}

		// Only highlight inputs with error class (no inline messages)
		Object.keys(errorsToDisplay).forEach(fieldName => {
			const input = document.querySelector(`[name="${fieldName}"]`) ||
				document.getElementById(`edit-${fieldName.replace('_', '-')}`);

			if (input) {
				// Add error class to input
				input.classList.add('input-error');
			}
		});

		// Show toast notification with first error
		const firstError = Object.values(errorsToDisplay)[0];
		if (firstError) {
			toast.error(firstError);
		}

		logger.debug('Validation', 'Errors displayed:', errorsToDisplay);
	}

	/**
	 * Clear all validation errors from UI
	 */
	clearErrors() {
		document.querySelectorAll('.field-error').forEach(el => el.remove());
		document.querySelectorAll('.input-error').forEach(el => {
			el.classList.remove('input-error');
		});
		this.reset();
	}
}

// Export singleton instance
const validator = new Validator();

export default validator;
export { Validator };
