/**
 * Profile Page
 * User profile management and settings
 */

import { TokenManager } from '../modules/auth.js';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import darkModeManager from '../utils/darkMode.js';
import Modal from '../utils/modal.js';

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
		initializeDarkModeToggle();
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
			return;
		}

		const data = await response.json();
		logger.debug('Profile', 'Profile data received:', data);

		if (data.success && data.user) {
			updateProfileUI(data.user);
		} else {
			logger.warn('Profile', 'Invalid profile data structure');
		}
	} catch (error) {
		logger.error('Profile', 'Error fetching profile data:', error);
	}
}

/**
 * Update profile UI with user data
 */
function updateProfileUI(user) {
	logger.debug('Profile', 'Updating profile UI with user data');

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
	const settingName = e.target.closest('.setting-item').querySelector('.font-medium').textContent;
	logger.info('Profile', `Setting toggled: ${settingName} - ${e.target.checked}`);
	// Add your toggle logic here
}

/**
 * Initialize dark mode toggle
 */
function initializeDarkModeToggle() {
	const darkModeToggle = document.getElementById('darkModeToggle');

	if (!darkModeToggle) {
		logger.warn('Profile', 'Dark mode toggle not found');
		return;
	}

	// Set initial state based on current theme
	darkModeToggle.checked = darkModeManager.isDark();

	// Listen for toggle changes
	darkModeToggle.addEventListener('change', (e) => {
		e.preventDefault();
		darkModeManager.toggle();
		logger.info('Profile', `Dark mode toggled: ${darkModeManager.isDark()}`);
	});

	// Listen for dark mode changes from other sources
	darkModeManager.addObserver((isDark) => {
		darkModeToggle.checked = isDark;
		logger.debug('Profile', `Dark mode toggle updated: ${isDark}`);
	});

	logger.debug('Profile', 'Dark mode toggle initialized');
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
				<div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-6">
					<div class="menu-item">
						<span class="icon-wrapper">
							<i class="fi fi-rr-user text-xl"></i>
						</span>
						<input
							type="text"
							id="edit-first-name"
							name="first_name"
							class="flex-1 bg-transparent border-none outline-none text-base font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-gray-50 dark:focus:bg-gray-700 rounded transition-all"
							placeholder="First Name"
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
							class="flex-1 bg-transparent border-none outline-none text-base font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-gray-50 dark:focus:bg-gray-700 rounded transition-all"
							placeholder="Last Name"
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
							class="flex-1 bg-transparent border-none outline-none text-base font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-gray-50 dark:focus:bg-gray-700 rounded transition-all"
							placeholder="Email"
						>
					</div>

					<div class="menu-item">
						<span class="icon-wrapper">
							<i class="fi fi-rr-cake-birthday text-xl"></i>
							<span class="notification-dot"></span>
						</span>
						<input
							type="date"
							id="edit-birth-date"
							name="birth_date"
							class="flex-1 bg-transparent border-none outline-none text-base font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-gray-50 dark:focus:bg-gray-700 rounded transition-all"
							placeholder="Birth Date"
						>
					</div>
				</div>
			</div>

			<div class="flex gap-3">
				<button
					type="submit"
					class="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
				>
					Save Changes
				</button>
				<button
					type="button"
					id="cancel-edit-profile"
					class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
				>
					Cancel
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
	// Get current displayed values
	const currentName = document.querySelector('[data-detail-name]')?.textContent || '';
	const currentEmail = document.querySelector('[data-detail-email]')?.textContent || '';
	const currentBirthDate = document.querySelector('[data-detail-birth-date]')?.textContent || '';

	// Split name into first and last
	const nameParts = currentName.split(' ');
	const firstName = nameParts[0] || '';
	const lastName = nameParts.slice(1).join(' ') || '';

	// Populate form fields
	const firstNameInput = document.getElementById('edit-first-name');
	const lastNameInput = document.getElementById('edit-last-name');
	const emailInput = document.getElementById('edit-email');
	const birthDateInput = document.getElementById('edit-birth-date');

	if (firstNameInput) firstNameInput.value = firstName;
	if (lastNameInput) lastNameInput.value = lastName;
	if (emailInput && !currentEmail.includes('تنظیم نشده')) emailInput.value = currentEmail;
	// Birth date would need proper formatting - left empty for now

	logger.debug('Profile', 'Edit form populated with current data');
}

/**
 * Handle edit profile form submission
 */
async function handleEditProfileSubmit(e) {
	e.preventDefault();
	logger.info('Profile', 'Submitting profile edit form');

	const formData = new FormData(e.target);
	const data = Object.fromEntries(formData.entries());

	logger.debug('Profile', 'Form data:', data);

	// TODO: Send API request to update profile
	// For now, just close the modal and show success message
	Modal.close();
	logger.info('Profile', 'Profile updated (demo - implement API call)');

	// You would typically make an API call here:
	// const token = TokenManager.get();
	// await fetch(CONFIG.API_URL + '/profile', {
	//     method: 'PUT',
	//     headers: {
	//         'Authorization': 'Bearer ' + token,
	//         'Content-Type': 'application/json'
	//     },
	//     body: JSON.stringify(data)
	// });
}
