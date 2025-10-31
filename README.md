# Database Connector

A WordPress plugin for creating custom sign-in and panel pages with Twig templating and Tailwind CSS.

**Version:** 3.0.0

## Features

- Custom URL routing for sign-in and panel pages
- Twig template engine with layout inheritance
- Tailwind CSS for responsive design
- Multilingual support (English, Persian with RTL)
- Compatible with Timber and other Twig-based themes
- Modular JavaScript architecture with ES6 modules
- OTP-based authentication with token management

## Quick Start

### Installation

1. Upload to `wp-content/plugins/db-conn/`

2. Install dependencies:

   ```bash
   composer install
   npm install
   npm run build
   ```

3. Activate the plugin in WordPress admin

4. Configure slugs at **Settings → Database Connector**

5. Flush permalinks at **Settings → Permalinks** (click Save)

### Access Pages

- Sign In: `https://yoursite.com/signin`
- Panel: `https://yoursite.com/panel`

## Development

### Build Commands

```bash
npm run build        # Build CSS and JS
npm run build:css    # Build CSS only
npm run build:js     # Build JS only
npm run watch:css    # Watch CSS changes
npm run watch:js     # Watch JS changes
npm run dev          # Build and watch for changes
```

### File Structure

```
db-conn/
├── views/
│   ├── layouts/          # Base layouts
│   ├── components/       # Reusable components
│   └── pages/            # Page templates
├── public/
│   ├── css/
│   │   ├── main.css      # Tailwind source
│   │   └── style.css     # Generated (gitignored)
│   └── js/
│       ├── index.js      # JS entry point
│       ├── script.js     # Generated bundle (gitignored)
│       ├── modules/      # Reusable modules
│       │   └── auth.js   # Authentication
│       ├── pages/        # Page-specific logic
│       │   ├── signin.js # Sign-in page
│       │   └── panel.js  # Panel page
│       └── utils/        # Utility functions
│           ├── config.js # Configuration
│           └── cookie.js # Cookie management
├── includes/
│   ├── class-db-conn-router.php   # Custom routing
│   └── ...
└── tailwind.config.js
```

## JavaScript Architecture

### Overview

The JavaScript codebase uses a modular ES6 structure for better maintainability and separation of concerns.

### Directory Structure

```
public/js/
├── index.js              # Entry point (builds to script.js)
├── modules/              # Reusable modules
│   └── auth.js          # Authentication logic
├── pages/                # Page-specific modules
│   ├── signin.js        # Sign-in page
│   └── panel.js         # Panel page
├── utils/                # Utility functions
│   ├── config.js        # Configuration
│   ├── cookie.js        # Cookie utilities
│   └── logger.js        # Debug logging
└── script.js             # Built output (auto-generated)
```

### Module Descriptions

**Entry Point:**

- `index.js` - Initializes auth guard and routes to appropriate page handlers

**Modules (`modules/`):**

- `auth.js` - Core authentication (TokenManager, AuthGuard, logout)

**Pages (`pages/`):**

- `signin.js` - Sign-in page (OTP flow, form validation, countdown timers)
- `panel.js` - Panel page (auth verification, access control)

**Utils (`utils/`):**

- `config.js` - Centralized configuration (API URLs, token settings, debug mode)
- `cookie.js` - Cookie management utilities
- `logger.js` - Debug logging system with conditional output

### Authentication Flow

#### Sign-in Flow

```
User visits /signin
    ↓
initAuthGuard() checks token
    ↓
[Has Token] → Redirect to /panel
[No Token] → Continue
    ↓
DOM Ready → initSigninPage()
    ↓
User enters phone → sendOtp()
    ↓
API: POST /send-otp
    ↓
User enters OTP → verifyOtp()
    ↓
API: POST /verify-otp
    ↓
TokenManager.save(token)
    ↓
Redirect to /panel
```

#### Panel Access Flow

```
User visits /panel
    ↓
initAuthGuard() checks token (server-side + client-side)
    ↓
[No Token] → Redirect to /signin
[Has Token] → Continue
    ↓
DOM Ready → initPanelPage()
    ↓
TokenManager.validate()
    ↓
API: GET /validate-token
    ↓
[Valid] → Show panel content
[Invalid 401/403] → Remove token, redirect to /signin
[Network Error] → Show panel with warning (graceful degradation)
```

### Error Handling

Token validation returns structured errors:

- `NO_TOKEN` - No authentication token found
- `INVALID_TOKEN` - Token is invalid (401/403) → redirects to signin
- `NETWORK_ERROR` - CORS/network issue → allows access with warning

### Import/Export Pattern

All modules use ES6 imports/exports:

```javascript
// Export
export const TokenManager = { ... };
export function initAuthGuard() { ... }

// Import
import { TokenManager, initAuthGuard } from './modules/auth.js';
import { CONFIG } from './utils/config.js';
```

### Build Process

```
Source Files (ES6 Modules)
    ↓
esbuild bundler
    ↓
    ├─ Resolves imports
    ├─ Bundles into single file
    ├─ Minifies code
    └─ Wraps in IIFE
    ↓
script.js (Production Ready)
```

## Configuration

### Settings Page

**Settings → Database Connector**

- **Slug Tab:** Configure page URLs (signin, panel)

### Slug Guidelines

✅ Use: `signin`, `member-login`, `user-panel`, `dashboard`
❌ Avoid: `login`, `admin`, `wp-admin` (reserved)

### API Configuration

Edit `public/js/utils/config.js`:

```javascript
export const CONFIG = {
  API_URL: "https://portal.com/api",
  TOKEN_KEY: "db_conn_auth_token",
  COOKIE_NAME: "db_conn_auth",
  COOKIE_DAYS: 30,
  PANEL_URL: "/panel",
  SIGNIN_URL: "/signin",
  DEBUG_MODE: false, // Enable/disable debug logging
};
```

## Debug Logging

### Overview

The plugin includes a comprehensive debug logging system that can be toggled via configuration. This helps trace execution flow across authentication and OTP processes without cluttering production console output.

### Enable/Disable Logging

Edit `public/js/utils/config.js`:

```javascript
export const CONFIG = {
  // ... other settings
  DEBUG_MODE: true, // Enable debug logging
};
```

### Logger API

The logger provides multiple methods for different log levels:

```javascript
import { logger } from "./utils/logger.js";

// Basic logging (only when DEBUG_MODE = true)
logger.log("ModuleName", "Message", optionalData);
logger.info("ModuleName", "Important event");
logger.warn("ModuleName", "Warning message");
logger.debug("ModuleName", "Detailed debug info", { key: "value" });

// Errors (always logged regardless of DEBUG_MODE)
logger.error("ModuleName", "Error message", errorObject);

// API tracking
logger.apiRequest("ModuleName", "POST", "/api/endpoint", requestData);
logger.apiResponse("ModuleName", 200, responseData);

// State changes
logger.stateChange("ModuleName", "Property", "newValue");

// Grouped logs
logger.group("ModuleName", "Group Title");
logger.groupCollapsed("ModuleName", "Collapsed Group");
// ... nested logs
logger.groupEnd();

// Performance tracking
logger.time("ModuleName", "operation-name");
// ... code to measure
logger.timeEnd("ModuleName", "operation-name");

// Table display
logger.table("ModuleName", arrayOrObject);
```

### Output Format

All logs are prefixed with `[DB-Conn] [ModuleName]`:

```
[DB-Conn] [Auth] Token is valid
[DB-Conn] [Signin] Starting OTP countdown: 120 seconds
[DB-Conn] [Panel] Auth State: authenticated
```

### Where Logging is Used

**Authentication (`modules/auth.js`):**

- Token save/get/remove operations
- Token validation with API
- Auth guard redirect decisions
- Logout actions

**Sign-in Page (`pages/signin.js`):**

- Page initialization
- Phone number validation
- OTP send/verify/resend operations
- API request/response tracking
- Countdown timers
- Step transitions

**Panel Page (`pages/panel.js`):**

- Page initialization
- Token validation flow
- Auth state changes
- Panel content display

### Benefits

- **Development:** Trace execution flow and identify issues quickly
- **Production:** Disable logging to keep console clean
- **Debugging:** Toggle on/off without code changes
- **Organized:** Module-prefixed messages for easy filtering

## Centralized Strings Management

### Overview

All user-facing strings are centralized in `includes/class-db-conn-strings.php` for easy management, translation, and maintenance.

### String Organization

Strings are organized by component/section:

- **navigation** - Navigation components (bottom nav, menu)
- **auth** - Authentication pages (signin, signup)
- **panel** - Panel/dashboard page
- **profile** - Profile page
- **services** - Services page
- **help** - Help/support page
- **about** - About page
- **common** - Shared/common strings (buttons, status, time)

### Usage in PHP

**Get All Strings:**

```php
$all_strings = DB_Conn_Strings::get_all_strings();
```

**Get Section Strings:**

```php
$nav_strings = DB_Conn_Strings::get_section('navigation');
$auth_strings = DB_Conn_Strings::get_section('auth');
```

**Get Specific String (Dot Notation):**

```php
$phone_label = DB_Conn_Strings::get('auth.signin.phone_label');
$panel_title = DB_Conn_Strings::get('panel.page_title');
$save_btn = DB_Conn_Strings::get('common.buttons.save');
```

### Usage in Twig Templates

Strings are automatically passed to all templates via the `strings` variable.

**Access Strings in Templates:**

```twig
{# Navigation #}
<span>{{ strings.navigation.bottom_nav.panel }}</span>
<span>{{ strings.navigation.bottom_nav.services }}</span>

{# Authentication #}
<label>{{ strings.auth.signin.phone_label }}</label>
<button>{{ strings.auth.signin.send_otp_btn }}</button>

{# Common Buttons #}
<button>{{ strings.common.buttons.save }}</button>
<button>{{ strings.common.buttons.cancel }}</button>

{# Page Titles #}
<h1>{{ strings.panel.page_title }}</h1>
<h2>{{ strings.services.plans.title }}</h2>
```

**Loop Through Arrays:**

```twig
{# Service Plan Features #}
{% for feature in strings.services.plans.basic.features %}
  <li>{{ feature }}</li>
{% endfor %}

{# FAQ Items #}
{% for key, item in strings.help.faq %}
  {% if key starts with 'q' %}
    <details>
      <summary>{{ item.question }}</summary>
      <p>{{ item.answer }}</p>
    </details>
  {% endif %}
{% endfor %}
```

### Usage in JavaScript

Strings are available in JavaScript through `window.dbConnPageData.strings`.

**Access Strings in JS:**

```javascript
// Get strings object
const strings = window.dbConnPageData.strings;

// Navigation strings
const panelText = strings.navigation.bottom_nav.panel;
const servicesText = strings.navigation.bottom_nav.services;

// Authentication strings
const phoneLabel = strings.auth.signin.phone_label;
const sendOtpBtn = strings.auth.signin.send_otp_btn;

// Common strings
const saveBtn = strings.common.buttons.save;
const cancelBtn = strings.common.buttons.cancel;

// Status strings
const activeStatus = strings.common.status.active;
const inactiveStatus = strings.common.status.inactive;
```

**Example: Dynamic Error Messages:**

```javascript
function showAlert(message, type = "error") {
  const alert = document.getElementById("alert-message");

  // Use centralized strings for consistent messaging
  const errorPrefix = strings.common.error_prefix || "خطا";
  const successPrefix = strings.common.success_prefix || "موفق";

  alert.textContent =
    type === "error"
      ? `${errorPrefix}: ${message}`
      : `${successPrefix}: ${message}`;
}
```

**Example: Update Button Text:**

```javascript
// Get strings from centralized location
const sendingText = strings.auth.signin.sending || "در حال ارسال...";
const sentText = strings.auth.signin.sent || "ارسال شد";

button.textContent = sending ? sendingText : sentText;
```

### Adding New Strings

**1. Add to PHP Class**

Edit `includes/class-db-conn-strings.php`:

```php
'panel' => array(
    'page_title' => 'پنل',
    'new_section' => array(
        'title' => 'عنوان جدید',
        'description' => 'توضیحات',
    ),
),
```

**2. Use in Template**

```twig
<h2>{{ strings.panel.new_section.title }}</h2>
<p>{{ strings.panel.new_section.description }}</p>
```

**3. Use in JavaScript**

```javascript
const title = window.dbConnPageData.strings.panel.new_section.title;
const description = window.dbConnPageData.strings.panel.new_section.description;
```

### Benefits

- **Centralized Management** - All strings in one location
- **Translation Ready** - Perfect structure for i18n/localization
- **Consistency** - Same strings used across PHP and JavaScript
- **Type Safety** - Clear structure with dot notation
- **Maintainability** - Update once, reflected everywhere

### Best Practices

**✅ DO:**

- Use descriptive keys that explain the string's purpose
- Group related strings together
- Use dot notation for nested access
- Keep strings organized by component/feature

**❌ DON'T:**

- Hardcode strings in templates or JavaScript
- Duplicate strings across different sections
- Use generic keys like `text1`, `label2`
- Mix different languages in the same key

## Template Customization

### Layouts

- `layouts/layout.twig` - Main layout with header/footer
- `layouts/login-layout.twig` - Auth pages (centered card)

### Creating Custom Pages

```twig
{% extends "layouts/layout.twig" %}

{% block content %}
  <div class="card">
    <h2>{{ __('My Page', 'db-conn') }}</h2>
  </div>
{% endblock %}
```

### Available Blocks

**layout.twig:**

- `title` - Page title
- `styles` - Custom CSS
- `content` - Main content
- `scripts` - Custom JavaScript

**login-layout.twig:**

- `title` - Page title
- `content` - Form content
- `footer_links` - Links below card

### Template Variables

```twig
{{ page_title }}      {# Page title #}
{{ site_name }}       {# Site name #}
{{ plugin_url }}      {# Plugin URL #}
{{ lang }}            {# Language code #}
{{ direction }}       {# ltr/rtl #}
{{ current_user }}    {# User object or null #}
```

### WordPress Functions in Twig

Available WordPress functions:

- `get_bloginfo()`, `admin_url()`, `home_url()`
- `__()`, `esc_html()`, `esc_attr()`, `esc_url()`
- `wp_nonce_field()`, `wp_create_nonce()`
- `is_rtl()`, `wp_head()`, `wp_footer()`
- `wp_logout_url()`, `is_user_logged_in()`, `wp_get_current_user()`

## Server-Side Features

### Custom Routing

The plugin uses WordPress rewrite rules to create custom page URLs:

- Configurable slugs via settings page
- Server-side authentication checks
- Automatic redirects for authenticated/unauthenticated users
- Prevents page flash with pre-rendering auth checks

### Authentication Guards

**Server-Side (PHP):**

- Checks `db_conn_auth` cookie before rendering
- Redirects to panel if authenticated user visits signin
- Redirects to signin if unauthenticated user visits panel

**Client-Side (JavaScript):**

- Pre-DOM auth check to prevent page flash
- Token validation with API
- Graceful error handling for CORS/network issues

## Troubleshooting

### 404 Errors

Go to **Settings → Permalinks** → Save Changes

### Twig Not Loading

1. Run `composer install`
2. Check `/vendor` and `/views` exist
3. Enable `WP_DEBUG` in `wp-config.php`

### CSS Not Loading

1. Run `npm run build:css`
2. Check `/public/css/style.css` exists
3. Clear browser cache

### JS Not Working

1. Run `npm run build:js`
2. Check `/public/js/script.js` exists
3. Check browser console for errors
4. Verify API endpoint in `utils/config.js`

### Infinite Redirect Loop

This happens when:

- CORS errors occur during token validation
- Network issues prevent API communication

**Solution:** The plugin now handles this gracefully by allowing access on network errors while showing console warnings.

### CORS Issues

If you see CORS errors in console:

1. Configure CORS headers on your API server
2. Allow `Authorization` header in `Access-Control-Allow-Headers`
3. The plugin will still function but show warnings

## Design Principles

1. **Separation of Concerns** - Each file has a single, well-defined purpose
2. **Modularity** - Code organized into reusable modules
3. **Single Responsibility** - Each module/function does one thing well
4. **Dependency Injection** - Modules import only what they need
5. **Configuration Centralization** - All config in one place
6. **Error Handling** - Graceful degradation for network issues
7. **Type Safety** - Structured return objects for better error handling

## Requirements

- WordPress 5.0+
- PHP 7.4+
- Node.js 14+ (for development)
- Composer (for dependencies)

## Changelog

### 3.0.0 - October 31, 2025

- Updated plugin version to 3.0.0
- Added version display section to profile page
- Updated all version footprints across the codebase

### 3.0.0

- Initial release
- Custom URL routing for sign-in and panel pages
- Twig template engine integration
- Tailwind CSS responsive design
- Multilingual support (English, Persian with RTL)
- OTP-based authentication system

## License

GPL v2 or later

**Author:** Majid Barkhordari
**Website:** [arsamnet.com](https://arsamnet.com)
**Version:** 3.0.0
