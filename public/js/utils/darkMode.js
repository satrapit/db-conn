/**
 * Dark Mode Manager
 * Handles theme switching with localStorage persistence and system preference detection
 */

import { logger } from './logger.js';

const STORAGE_KEY = 'db_conn_theme_mode';
const THEME_AUTO = 'auto';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

/**
 * Dark Mode Manager Class
 */
class DarkModeManager {
	constructor() {
		this.currentMode = THEME_AUTO;
		this.systemPrefersDark = false;
		this.mediaQuery = null;
		this.observers = [];
	}

	/**
	 * Initialize dark mode
	 */
	init() {
		logger.debug('DarkMode', 'Initializing dark mode manager');

		// Check for system preference
		this.setupSystemDetection();

		// Load saved preference
		const savedMode = this.getSavedMode();
		logger.debug('DarkMode', 'Saved mode:', savedMode);

		// Apply theme immediately (before DOM loads to prevent flash)
		this.setMode(savedMode, false);

		// Setup event listeners
		this.setupEventListeners();

		logger.info('DarkMode', `Dark mode initialized with mode: ${this.currentMode}`);
	}

	/**
	 * Setup system dark mode detection
	 */
	setupSystemDetection() {
		if (window.matchMedia) {
			this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			this.systemPrefersDark = this.mediaQuery.matches;

			logger.debug('DarkMode', 'System prefers dark:', this.systemPrefersDark);

			// Listen for system preference changes
			this.mediaQuery.addEventListener('change', (e) => {
				this.systemPrefersDark = e.matches;
				logger.debug('DarkMode', 'System preference changed to:', e.matches ? 'dark' : 'light');

				// If in auto mode, update theme
				if (this.currentMode === THEME_AUTO) {
					this.applyTheme();
				}
			});
		}
	}

	/**
	 * Setup event listeners for UI updates
	 */
	setupEventListeners() {
		// Will be called after DOM is ready
		document.addEventListener('DOMContentLoaded', () => {
			this.updateUI();
		});
	}

	/**
	 * Get saved mode from localStorage
	 * @returns {string} Saved mode or 'auto' as default
	 */
	getSavedMode() {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved && [THEME_AUTO, THEME_LIGHT, THEME_DARK].includes(saved)) {
				return saved;
			}
		} catch (error) {
			logger.error('DarkMode', 'Error reading from localStorage:', error);
		}
		return THEME_AUTO;
	}

	/**
	 * Save mode to localStorage
	 * @param {string} mode - Theme mode to save
	 */
	saveMode(mode) {
		try {
			localStorage.setItem(STORAGE_KEY, mode);
			logger.debug('DarkMode', 'Saved mode to localStorage:', mode);
		} catch (error) {
			logger.error('DarkMode', 'Error saving to localStorage:', error);
		}
	}

	/**
	 * Set theme mode
	 * @param {string} mode - 'auto', 'light', or 'dark'
	 * @param {boolean} save - Whether to save to localStorage
	 */
	setMode(mode, save = true) {
		if (![THEME_AUTO, THEME_LIGHT, THEME_DARK].includes(mode)) {
			logger.warn('DarkMode', 'Invalid mode:', mode);
			return;
		}

		logger.info('DarkMode', `Setting mode to: ${mode}`);
		this.currentMode = mode;

		if (save) {
			this.saveMode(mode);
		}

		this.applyTheme();
		this.updateUI();
		this.notifyObservers();
	}

	/**
	 * Apply the theme to the document
	 */
	applyTheme() {
		const shouldBeDark = this.shouldUseDarkTheme();
		const htmlElement = document.documentElement;

		if (shouldBeDark) {
			htmlElement.classList.add('dark');
			htmlElement.setAttribute('data-theme', 'dark');
			logger.debug('DarkMode', 'Applied dark theme');
		} else {
			htmlElement.classList.remove('dark');
			htmlElement.setAttribute('data-theme', 'light');
			logger.debug('DarkMode', 'Applied light theme');
		}
	}

	/**
	 * Determine if dark theme should be used
	 * @returns {boolean} True if dark theme should be active
	 */
	shouldUseDarkTheme() {
		if (this.currentMode === THEME_DARK) {
			return true;
		}
		if (this.currentMode === THEME_LIGHT) {
			return false;
		}
		// Auto mode - follow system preference
		return this.systemPrefersDark;
	}

	/**
	 * Toggle between light and dark mode (not auto)
	 */
	toggle() {
		const newMode = this.shouldUseDarkTheme() ? THEME_LIGHT : THEME_DARK;
		this.setMode(newMode);
	}

	/**
	 * Get current mode
	 * @returns {string} Current mode
	 */
	getMode() {
		return this.currentMode;
	}

	/**
	 * Check if currently in dark theme
	 * @returns {boolean} True if dark theme is active
	 */
	isDark() {
		return this.shouldUseDarkTheme();
	}

	/**
	 * Update UI elements to reflect current state
	 */
	updateUI() {
		// Update toggle buttons
		const toggleBtns = document.querySelectorAll('[data-theme-toggle]');
		toggleBtns.forEach(btn => {
			const icon = btn.querySelector('.theme-icon');
			if (icon) {
				this.updateToggleIcon(icon);
			}
		});

		// Update radio buttons for theme selector
		const radioButtons = document.querySelectorAll('input[name="theme-mode"]');
		radioButtons.forEach(radio => {
			radio.checked = radio.value === this.currentMode;
		});

		logger.debug('DarkMode', 'UI updated');
	}

	/**
	 * Update toggle button icon
	 * @param {HTMLElement} icon - Icon element
	 */
	updateToggleIcon(icon) {
		const isDark = this.isDark();

		// Clear existing icons
		icon.innerHTML = '';

		if (isDark) {
			// Moon icon for dark mode
			icon.innerHTML = `
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
				</svg>
			`;
		} else {
			// Sun icon for light mode
			icon.innerHTML = `
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
				</svg>
			`;
		}
	}

	/**
	 * Setup theme selector (for settings/preferences page)
	 */
	setupThemeSelector() {
		const selector = document.getElementById('theme-selector');
		if (!selector) return;

		const radioButtons = selector.querySelectorAll('input[name="theme-mode"]');
		radioButtons.forEach(radio => {
			radio.addEventListener('change', (e) => {
				if (e.target.checked) {
					this.setMode(e.target.value);
				}
			});
		});

		logger.debug('DarkMode', 'Theme selector initialized');
	}

	/**
	 * Add observer to be notified of theme changes
	 * @param {Function} callback - Callback function
	 */
	addObserver(callback) {
		if (typeof callback === 'function') {
			this.observers.push(callback);
		}
	}

	/**
	 * Notify all observers of theme change
	 */
	notifyObservers() {
		const isDark = this.isDark();
		this.observers.forEach(callback => {
			try {
				callback(isDark, this.currentMode);
			} catch (error) {
				logger.error('DarkMode', 'Error in observer callback:', error);
			}
		});
	}
}

// Create singleton instance
const darkModeManager = new DarkModeManager();

// Initialize immediately (before DOM loads to prevent flash)
darkModeManager.init();

// Export for use in other modules
export default darkModeManager;

/**
 * Setup dark mode toggle buttons
 */
export function setupDarkModeToggles() {
	const toggleBtns = document.querySelectorAll('[data-theme-toggle]');

	toggleBtns.forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			darkModeManager.toggle();
		});
	});

	logger.debug('DarkMode', `Initialized ${toggleBtns.length} toggle buttons`);
}

/**
 * Get current theme mode
 * @returns {string} Current mode
 */
export function getThemeMode() {
	return darkModeManager.getMode();
}

/**
 * Check if dark mode is active
 * @returns {boolean} True if dark
 */
export function isDarkMode() {
	return darkModeManager.isDark();
}

/**
 * Set theme mode programmatically
 * @param {string} mode - 'auto', 'light', or 'dark'
 */
export function setThemeMode(mode) {
	darkModeManager.setMode(mode);
}
