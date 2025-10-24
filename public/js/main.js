/**
 * All of the code for your public-facing JavaScript source
 * should reside in this file.
 *
 * This is the input file that will be bundled into script.js
 */

// Import auth module
import AuthModule from './auth.js';

// DOM Ready
document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	// Your JavaScript code here
	console.log('DB Conn plugin loaded');

	// Initialize authentication module
	console.log('AuthModule is available');

	// Check if we're on the signin page
	const signinPage = document.getElementById('phone-step');
	if (signinPage) {
		console.log('Signin page detected, initializing auth...');
		AuthModule.init();
	}

	// Check if we're on a protected page (like panel)
	const panelPage = document.querySelector('[data-page="panel"]');
	if (panelPage) {
		console.log('Panel page detected, checking authentication...');
		AuthModule.checkAuth();
	}

});
