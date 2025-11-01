/**
 * Modal Utility
 * Provides functions to open, close, and manage modal dialogs
 */

const Modal = {
	overlay: null,
	title: null,
	body: null,
	closeBtn: null,
	backdrop: null,

	/**
	 * Initialize the modal
	 */
	init() {
		this.overlay = document.getElementById('app-modal');
		this.title = document.getElementById('modal-title');
		this.body = document.getElementById('modal-body');
		this.closeBtn = document.getElementById('modal-close');
		this.backdrop = this.overlay?.querySelector('.absolute.inset-0');

		if (!this.overlay) return;

		// Close button click
		this.closeBtn?.addEventListener('click', () => this.close());

		// Backdrop click
		this.backdrop?.addEventListener('click', () => this.close());

		// ESC key to close
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && this.isOpen()) {
				this.close();
			}
		});
	},

	/**
	 * Open the modal with content
	 * @param {Object} options - Modal options
	 * @param {string} options.title - Modal title
	 * @param {string|HTMLElement} options.content - Modal content (HTML string or element)
	 * @param {string} options.url - URL to fetch content from (alternative to content)
	 * @param {Function} options.onClose - Callback when modal closes
	 * @param {Function} options.onLoad - Callback when content is loaded (for URL mode)
	 */
	async open({ title = 'Modal', content = '', url = null, onClose = null, onLoad = null } = {}) {
		if (!this.overlay) return;

		// Set title
		if (this.title) {
			this.title.textContent = title;
		}

		// Show loading state if fetching from URL
		if (url) {
			this.showLoading();
		}

		// Store callbacks
		this.onCloseCallback = onClose;
		this.onLoadCallback = onLoad;

		// Show modal
		this.overlay.classList.remove('hidden');
		// Trigger reflow for animation
		void this.overlay.offsetHeight;
		this.overlay.classList.add('show');

		// Prevent body scroll
		document.body.style.overflow = 'hidden';

		// Load content
		if (url) {
			await this.loadContentFromUrl(url);
		} else {
			this.setContent(content);
		}
	},

	/**
	 * Set modal content
	 * @param {string|HTMLElement} content - Content to display
	 */
	setContent(content) {
		if (!this.body) return;

		if (typeof content === 'string') {
			this.body.innerHTML = content;
		} else if (content instanceof HTMLElement) {
			this.body.innerHTML = '';
			this.body.appendChild(content);
		}
	},

	/**
	 * Show loading spinner in modal
	 */
	showLoading() {
		if (!this.body) return;

		this.body.innerHTML = `
			<div class="flex items-center justify-center py-12">
				<div class="loader"></div>
			</div>
			<style>
				.loader {
					width: 50px;
					padding: 8px;
					aspect-ratio: 1;
					border-radius: 50%;
					background: #00a796;
					--_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
					-webkit-mask: var(--_m);
					mask: var(--_m);
					-webkit-mask-composite: source-out;
					mask-composite: subtract;
					animation: spin 1s infinite linear;
				}
				@keyframes spin {
					to { transform: rotate(1turn); }
				}
			</style>
		`;
	},

	/**
	 * Load content from URL via fetch
	 * @param {string} url - URL to fetch content from
	 */
	async loadContentFromUrl(url) {
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const html = await response.text();
			this.setContent(html);

			// Call onLoad callback if exists
			if (this.onLoadCallback && typeof this.onLoadCallback === 'function') {
				this.onLoadCallback(html);
			}
		} catch (error) {
			console.error('Modal: Error loading content from URL:', error);
			this.showError('Failed to load content. Please try again.');
		}
	},

	/**
	 * Show error message in modal
	 * @param {string} message - Error message to display
	 */
	showError(message) {
		if (!this.body) return;

		this.body.innerHTML = `
			<div class="flex flex-col items-center justify-center py-12 text-center">
				<i class="fi fi-rr-cross-circle text-6xl text-red-500 mb-4"></i>
				<p class="text-gray-700 dark:text-gray-300">${message}</p>
			</div>
		`;
	},

	/**
	 * Close the modal
	 */
	close() {
		if (!this.overlay) return;

		this.overlay.classList.remove('show');

		setTimeout(() => {
			this.overlay.classList.add('hidden');
			// Restore body scroll
			document.body.style.overflow = '';

			// Clear content
			if (this.body) {
				this.body.innerHTML = '';
			}

			// Call onClose callback if exists
			if (this.onCloseCallback && typeof this.onCloseCallback === 'function') {
				this.onCloseCallback();
				this.onCloseCallback = null;
			}
		}, 300); // Match transition duration
	},

	/**
	 * Check if modal is currently open
	 * @returns {boolean}
	 */
	isOpen() {
		return this.overlay && this.overlay.classList.contains('show');
	}
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => Modal.init());
} else {
	Modal.init();
}

// Export for use in other modules
export default Modal;
