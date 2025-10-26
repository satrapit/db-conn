/**
 * Main Entry Point
 * Initializes the application and routes to appropriate page handlers
 */

import { initAuthGuard } from './modules/auth.js';
import { initSigninPage } from './pages/signin.js';
import { initPanelPage } from './pages/panel.js';
import { initHomePage } from './pages/home.js';
import { initProfilePage } from './pages/profile.js';
import { initServicesPage } from './pages/services.js';
import { initHelpPage } from './pages/help.js';
import { initAboutPage } from './pages/about.js';

// Run auth guard immediately (before DOM loads) to prevent page flash
initAuthGuard();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	console.log('DB Conn plugin loaded');

	// Initialize app navigation
	initAppNavigation();

	// Detect and initialize signin page
	const signinPage = document.getElementById('phone-step');
	if (signinPage) {
		console.log('Signin page detected, initializing...');
		initSigninPage();
	}

	// Detect and initialize specific pages
	const currentPage = document.querySelector('[data-page]');
	if (currentPage) {
		const pageName = currentPage.getAttribute('data-page');
		console.log(`${pageName} page detected, initializing...`);

		switch (pageName) {
			case 'panel':
				initPanelPage();
				break;
			case 'home':
				initHomePage();
				break;
			case 'profile':
				initProfilePage();
				break;
			case 'services':
				initServicesPage();
				break;
			case 'help':
				initHelpPage();
				break;
			case 'about':
				initAboutPage();
				break;
			default:
				console.warn(`Unknown page: ${pageName}`);
		}
	}
});

/**
 * Initialize app navigation
 * Handles mobile menu, bottom nav, and user menu
 */
function initAppNavigation() {
	// Mobile menu toggle
	const mobileMenuBtn = document.getElementById('mobileMenuBtn');
	const mobileSidebar = document.getElementById('mobileSidebar');
	const sidebarOverlay = document.getElementById('sidebarOverlay');
	const closeSidebarBtn = document.getElementById('closeSidebarBtn');

	if (mobileMenuBtn && mobileSidebar) {
		mobileMenuBtn.addEventListener('click', () => {
			mobileSidebar.classList.add('active');
			sidebarOverlay.classList.add('active');
			document.body.style.overflow = 'hidden';
		});

		const closeSidebar = () => {
			mobileSidebar.classList.remove('active');
			sidebarOverlay.classList.remove('active');
			document.body.style.overflow = '';
		};

		closeSidebarBtn?.addEventListener('click', closeSidebar);
		sidebarOverlay?.addEventListener('click', closeSidebar);
	}

	// User menu toggle
	const userMenuBtn = document.getElementById('userMenuBtn');
	const userDropdown = document.getElementById('userDropdown');

	if (userMenuBtn && userDropdown) {
		userMenuBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			userDropdown.classList.toggle('show');
		});

		// Close dropdown when clicking outside
		document.addEventListener('click', (e) => {
			if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
				userDropdown.classList.remove('show');
			}
		});
	}

	// Handle navigation link clicks
	const navLinks = document.querySelectorAll('[data-nav]');
	navLinks.forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const page = link.getAttribute('data-nav');
			console.log(`Navigating to: ${page}`);

			// Update active states
			updateActiveNav(page);

			// In a real app, you would navigate here
			// For now, just log and optionally reload
			// window.location.href = `/${page}`;
		});
	});
}

/**
 * Update active navigation states
 */
function updateActiveNav(page) {
	// Update all nav links
	const allNavLinks = document.querySelectorAll('[data-nav]');
	allNavLinks.forEach(link => {
		const linkPage = link.getAttribute('data-nav');
		if (linkPage === page) {
			link.classList.add('active');
		} else {
			link.classList.remove('active');
		}
	});
}

