/**
 * Profile Page
 * User profile management and settings
 */

import { TokenManager } from '../modules/auth.js';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { initializeDarkModeToggle } from '../utils/darkMode.js';
import Modal from '../utils/modal.js';
import validator from '../utils/validation.js';
import toast from '../utils/toast.js';

// Store current user data
let currentUserData = null;

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
		await fetchUserProfile();
		showProfileContent();
		initializeToggles();
		initializeDarkModeToggle('darkModeToggle');
		initializeEditProfileModal();
	} else {
		logger.warn('Profile', 'Invalid token, redirecting to signin');
		window.location.replace(CONFIG.SIGNIN_URL);
	}
}

/**
 * Fetch user profile data from API
 */
async function fetchUserProfile() {
	const token = TokenManager.get();
	if (!token) {
		logger.warn('Profile', 'No token available for profile fetch');
		return;
	}

	try {
		logger.apiRequest('Profile', 'GET', CONFIG.API_URL + '/profile');

		const response = await fetch(CONFIG.API_URL + '/profile', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
		});

		logger.apiResponse('Profile', response.status, response.statusText);

		if (!response.ok) {
			logger.warn('Profile', 'Failed to fetch profile data');
			toast.error('خطا در دریافت اطلاعات پروفایل');
			return;
		}

		const data = await response.json();
		logger.debug('Profile', 'Profile data received:', data);

		if (data.success && data.user) {
			updateProfileUI(data.user);
		} else {
			logger.warn('Profile', 'Invalid profile data structure');
			toast.warning('ساختار داده نامعتبر است');
		}
	} catch (error) {
		logger.error('Profile', 'Error fetching profile data:', error);
		toast.error('خطا در ارتباط با سرور');
	}
}

/**
 * Update profile UI with user data
 */
function updateProfileUI(user) {
	logger.debug('Profile', 'Updating profile UI with user data');

	// Store user data globally for later use
	currentUserData = user;

	// Update profile header
	const profileName = document.querySelector('[data-profile-name]');
	const profilePhone = document.querySelector('[data-profile-phone]');

	if (profileName) {
		const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
		profileName.textContent = fullName || user.phone;
	}

	if (profilePhone) {
		profilePhone.textContent = user.phone;
	}

	// Update profile information details
	const detailName = document.querySelector('[data-detail-name]');
	const detailEmail = document.querySelector('[data-detail-email]');
	const detailPhone = document.querySelector('[data-detail-phone]');
	const detailBirthDate = document.querySelector('[data-detail-birth-date]');
	const detailMemberDate = document.querySelector('[data-detail-member-date]');

	if (detailName) {
		const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
		detailName.textContent = fullName || 'نام تنظیم نشده';
	}

	if (detailEmail) {
		detailEmail.textContent = user.email || 'ایمیل تنظیم نشده';
	}

	if (detailPhone) {
		detailPhone.textContent = user.phone;
	}

	if (detailBirthDate && user.birth_date) {
		// Display birth_date as-is (already in Jalali format from database)
		detailBirthDate.textContent = user.birth_date;
	} else if (detailBirthDate) {
		detailBirthDate.textContent = 'تاریخ تولد تنظیم نشده';
	}

	if (detailMemberDate && user.created_at) {
		detailMemberDate.textContent = formatDate(user.created_at);
	}

	logger.info('Profile', 'Profile UI updated successfully');
}

/**
 * Format date string to Persian format
 */
function formatDate(dateString) {
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('fa-IR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	} catch (error) {
		logger.warn('Profile', 'Error formatting date:', error);
		return dateString;
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
	const settingItem = e.target.closest('.setting-item') || e.target.closest('.menu-item');
	if (!settingItem) {
		logger.warn('Profile', 'Toggle change event fired but no parent setting-item or menu-item found');
		return;
	}

	const settingNameElement = settingItem.querySelector('.font-medium');
	if (!settingNameElement) {
		logger.warn('Profile', 'Toggle change event fired but no .font-medium element found');
		return;
	}

	const settingName = settingNameElement.textContent;
	logger.info('Profile', `Setting toggled: ${settingName} - ${e.target.checked}`);
	// Add your toggle logic here
}

/**
 * Initialize edit profile modal
 */
function initializeEditProfileModal() {
	const editProfileBtn = document.getElementById('edit-profile-btn');

	if (!editProfileBtn) {
		logger.warn('Profile', 'Edit profile button not found');
		return;
	}

	editProfileBtn.addEventListener('click', (e) => {
		e.preventDefault();
		logger.info('Profile', 'Opening edit profile modal');

		// METHOD 1: Create modal content dynamically
		const modalContent = createEditProfileForm();

		// Open modal with inline content
		Modal.open({
			title: 'ویرایش پروفایل',
			content: modalContent,
			onClose: () => {
				logger.info('Profile', 'Edit profile modal closed');
			}
		});

		// METHOD 2 (Alternative): Load content from URL
		// Uncomment to load form from an external page/endpoint
		/*
		Modal.open({
			title: 'Edit Profile',
			url: '/wp-admin/admin-ajax.php?action=get_edit_profile_form',
			onLoad: (html) => {
				logger.info('Profile', 'Edit profile form loaded from URL');
				// Attach event listeners to loaded content
				const form = document.querySelector('#modal-body form');
				if (form) {
					form.addEventListener('submit', handleEditProfileSubmit);
				}
			},
			onClose: () => {
				logger.info('Profile', 'Edit profile modal closed');
			}
		});
		*/
	});

	logger.debug('Profile', 'Edit profile modal initialized');
}

/**
 * Create edit profile form content
 * @returns {HTMLElement} Form element
 */
function createEditProfileForm() {
	const form = document.createElement('div');
	form.className = 'edit-profile-form';
	form.innerHTML = `
		<form id="edit-profile-form-element">
			<div class="card">
				<div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
					<div class="menu-item">
						<span class="icon-wrapper">
							<i class="fi fi-rr-user text-xl"></i>
						</span>
						<input
							type="text"
							id="edit-first-name"
							name="first_name"
							class="flex-1 border-none outline-none text-base font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded transition-all"
							placeholder="نام *"
							required
						>
					</div>

					<div class="menu-item">
						<span class="icon-wrapper">
							<i class="fi fi-rr-user text-xl"></i>
						</span>
						<input
							type="text"
							id="edit-last-name"
							name="last_name"
							class="flex-1 border-none outline-none text-base font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded transition-all"
							placeholder="نام خانوادگی *"
							required
						>
					</div>

					<div class="menu-item">
						<span class="icon-wrapper">
							<i class="fi fi-rr-envelope text-xl"></i>
						</span>
						<input
							type="email"
							id="edit-email"
							name="email"
							class="flex-1 border-none outline-none text-base font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded transition-all"
							placeholder="ایمیل (اختیاری)"
						>
					</div>

					<div class="menu-item">
						<span class="icon-wrapper">
							<i class="fi fi-rr-cake-birthday text-xl"></i>
						</span>
						<input
							type="text"
							id="edit-birth-date"
							name="birth_date"
							class="flex-1 text-right border-none outline-none text-base font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded transition-all"
							placeholder="تاریخ تولد (1365/12/20) *"
							required
							dir="ltr"
						>
					</div>
				</div>
			</div>

			<div class="flex gap-3">
				<button
					type="submit"
					class="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
				>
					ذخیره تغییرات
				</button>
				<button
					type="button"
					id="cancel-edit-profile"
					class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
				>
					انصراف
				</button>
			</div>
		</form>
	`;

	// Add event listeners
	setTimeout(() => {
		const formElement = form.querySelector('#edit-profile-form-element');
		const cancelBtn = form.querySelector('#cancel-edit-profile');

		if (formElement) {
			formElement.addEventListener('submit', handleEditProfileSubmit);
		}

		if (cancelBtn) {
			cancelBtn.addEventListener('click', () => Modal.close());
		}

		// Populate form with current user data
		populateEditForm();
	}, 0);

	return form;
}

/**
 * Populate edit form with current user data
 */
function populateEditForm() {
	if (!currentUserData) {
		logger.warn('Profile', 'No user data available to populate form');
		return;
	}

	logger.debug('Profile', 'Populating form with user data:', currentUserData);

	// Populate form fields with current user data
	const firstNameInput = document.getElementById('edit-first-name');
	const lastNameInput = document.getElementById('edit-last-name');
	const emailInput = document.getElementById('edit-email');
	const birthDateInput = document.getElementById('edit-birth-date');

	if (firstNameInput) firstNameInput.value = currentUserData.first_name || '';
	if (lastNameInput) lastNameInput.value = currentUserData.last_name || '';
	if (emailInput) emailInput.value = currentUserData.email || '';

	// Birth date is already in Jalali format, just display it
	if (birthDateInput && currentUserData.birth_date) {
		birthDateInput.value = currentUserData.birth_date;
	}

	logger.debug('Profile', 'Edit form populated with current user data');
}

/**
 * Handle edit profile form submission
 */
async function handleEditProfileSubmit(e) {
	e.preventDefault();
	logger.info('Profile', 'Submitting profile edit form');

	// Clear previous errors
	validator.clearErrors();

	const formData = new FormData(e.target);
	const data = Object.fromEntries(formData.entries());

	logger.debug('Profile', 'Raw form data:', data);

	// Validate form data
	const isValid = validator.validateProfileForm(data);

	if (!isValid) {
		logger.warn('Profile', 'Form validation failed:', validator.getErrors());
		validator.displayErrors(); // This already shows toast with first error
		return;
	}

	// Sanitize and prepare data for API
	const sanitizedData = validator.sanitizeProfileData(data);
	logger.debug('Profile', 'Sanitized form data:', sanitizedData);

	const token = TokenManager.get();
	if (!token) {
		logger.warn('Profile', 'No token available');
		Modal.close();
		return;
	}

	try {
		// Show loading state
		const submitBtn = e.target.querySelector('button[type="submit"]');
		const originalBtnText = submitBtn?.textContent;
		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.textContent = 'در حال ذخیره...';
		}

		logger.apiRequest('Profile', 'PUT', CONFIG.API_URL + '/profile', sanitizedData);

		const response = await fetch(CONFIG.API_URL + '/profile', {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(sanitizedData)
		});

		logger.apiResponse('Profile', response.status, response.statusText);

		const result = await response.json();

		if (response.ok && result.success) {
			logger.info('Profile', 'Profile updated successfully');

			// Update UI with new data
			if (result.user) {
				updateProfileUI(result.user);
			}

			// Close modal
			Modal.close();

			// Show success notification
			logger.info('Profile', result.message || 'پروفایل با موفقیت به‌روزرسانی شد');
			toast.success(result.message || 'پروفایل با موفقیت به‌روزرسانی شد');
		} else {
			logger.warn('Profile', 'Failed to update profile:', result.message);

			// Re-enable button
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.textContent = originalBtnText;
			}

			// Show error message
			toast.error(result.message || 'خطا در به‌روزرسانی پروفایل');
		}
	} catch (error) {
		logger.error('Profile', 'Error updating profile:', error);

		// Re-enable button
		const submitBtn = e.target.querySelector('button[type="submit"]');
		if (submitBtn) {
			submitBtn.disabled = false;
			submitBtn.textContent = 'ذخیره تغییرات';
		}

		toast.error('خطا در ارتباط با سرور');
	}
}
