/**
 * Main Entry Point
 * Initializes the application and routes to appropriate page handlers
 */

import { initAuthGuard } from './modules/auth.js';
import { initSigninPage } from './pages/signin.js';
import { initPanelPage } from './pages/panel.js';

// Run auth guard immediately (before DOM loads) to prevent page flash
initAuthGuard();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	console.log('DB Conn plugin loaded');

	// Detect and initialize signin page
	const signinPage = document.getElementById('phone-step');
	if (signinPage) {
		console.log('Signin page detected, initializing...');
		initSigninPage();
	}

	// Detect and initialize panel page
	const panelPage = document.querySelector('[data-page="panel"]');
	if (panelPage) {
		console.log('Panel page detected, checking authentication...');
		initPanelPage();
	}
});
