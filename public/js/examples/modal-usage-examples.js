/**
 * Modal Usage Examples
 * Demonstrates different ways to use the Modal utility
 */

import Modal from '../utils/modal.js';

/**
 * Example 1: Open modal with inline HTML content
 */
export function openModalWithInlineContent() {
	Modal.open({
		title: 'Welcome',
		content: `
			<div class="text-center">
				<h3 class="text-lg font-semibold mb-4">Hello!</h3>
				<p class="text-gray-600 dark:text-gray-400">This is inline content.</p>
			</div>
		`,
		onClose: () => {
			console.log('Modal closed');
		}
	});
}

/**
 * Example 2: Open modal with DOM element
 */
export function openModalWithElement() {
	const element = document.createElement('div');
	element.className = 'space-y-4';
	element.innerHTML = `
		<p class="text-gray-700 dark:text-gray-300">This is a DOM element</p>
		<button class="btn-primary">Click me</button>
	`;

	Modal.open({
		title: 'Dynamic Element',
		content: element,
		onClose: () => {
			console.log('Element modal closed');
		}
	});
}

/**
 * Example 3: Load content from another page/URL
 */
export function openModalFromUrl() {
	Modal.open({
		title: 'Loading Content',
		url: '/wp-admin/admin-ajax.php?action=get_modal_content',
		onLoad: (html) => {
			console.log('Content loaded successfully');
			// You can manipulate the loaded content here
		},
		onClose: () => {
			console.log('URL modal closed');
		}
	});
}

/**
 * Example 4: Load content from WordPress page
 */
export function openModalWithWordPressContent() {
	// Assuming you have a page slug or ID
	const pageSlug = 'terms-and-conditions';

	Modal.open({
		title: 'Terms and Conditions',
		url: `/?page_slug=${pageSlug}&modal=1`,
		onLoad: (html) => {
			console.log('WordPress page loaded in modal');
		},
		onClose: () => {
			console.log('WordPress content modal closed');
		}
	});
}

/**
 * Example 5: Load content from API endpoint
 */
export function openModalWithApiContent() {
	const token = localStorage.getItem('auth_token');

	Modal.open({
		title: 'User Details',
		url: '/wp-json/dbconn/v1/user/details',
		onLoad: (html) => {
			console.log('API content loaded');
			// Add event listeners to loaded content
			const buttons = document.querySelectorAll('#modal-body button');
			buttons.forEach(btn => {
				btn.addEventListener('click', handleButtonClick);
			});
		},
		onClose: () => {
			console.log('API content modal closed');
		}
	});
}

/**
 * Example 6: Load form from another page
 */
export function openModalWithForm() {
	Modal.open({
		title: 'Contact Form',
		url: '/contact-form.html',
		onLoad: (html) => {
			// Attach form submit handler
			const form = document.querySelector('#modal-body form');
			if (form) {
				form.addEventListener('submit', async (e) => {
					e.preventDefault();
					const formData = new FormData(form);

					// Handle form submission
					try {
						const response = await fetch('/api/contact', {
							method: 'POST',
							body: formData
						});

						if (response.ok) {
							Modal.close();
							alert('Form submitted successfully!');
						}
					} catch (error) {
						console.error('Form submission error:', error);
					}
				});
			}
		}
	});
}

/**
 * Example helper function for button clicks
 */
function handleButtonClick(e) {
	console.log('Button clicked:', e.target);
}

// Example: Attach to global scope for testing in console
if (typeof window !== 'undefined') {
	window.ModalExamples = {
		openModalWithInlineContent,
		openModalWithElement,
		openModalFromUrl,
		openModalWithWordPressContent,
		openModalWithApiContent,
		openModalWithForm
	};
}
