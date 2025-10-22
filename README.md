# Database Connector WordPress Plugin

A WordPress plugin that creates custom sign-in and panel pages with Twig templating support.

## Overview

Database Connector adds two custom pages to your WordPress site:

- **Sign In Page** - Custom sign-in page (default: `/signin`)
- **Panel Page** - User dashboard/panel (default: `/panel`)

**Key Features:**

- Custom URL routing without creating WordPress pages
- Twig template engine for modern, clean templates
- Smart slug validation to prevent conflicts
- Mobile-friendly, responsive design
- Compatible with Timber and other Twig-based themes
- **Multilingual support** with English and Persian (RTL support included)
- Fully internationalized and translation-ready

## Languages

The plugin is fully translated and supports:

- 🇺🇸 **English (en_US)** - Base language
- 🇮🇷 **Persian/Farsi (fa_IR)** - Full translation with RTL support

For translation documentation, see [TRANSLATION.md](TRANSLATION.md)

## Installation

1. **Upload the plugin** to `wp-content/plugins/db-conn/`

2. **Install dependencies:**

   ```bash
   cd wp-content/plugins/db-conn
   composer install
   ```

3. **Activate** the plugin in WordPress admin

4. **Configure slugs:**

   - Go to Settings → Database Connector
   - Click the "Slug" tab
   - Set your custom page slugs (e.g., `signin`, `panel`)
   - Click "Save Changes"

5. **Access your pages:**
   - Sign In: `https://yoursite.com/signin`
   - Panel: `https://yoursite.com/panel`

## Configuration

### Settings Page

Navigate to **Settings → Database Connector** and use the tabbed interface:

**General Tab:** Plugin information and global settings

**Slug Tab:** Configure custom page URLs

- Sign In Page Slug (e.g., `signin`)
- Panel Page Slug (e.g., `panel`)

### Slug Guidelines

✅ **Good:** `signin`, `member-login`, `user-panel`, `dashboard`
❌ **Avoid:** `login`, `admin`, `wp-admin` (reserved words)
⚠️ **Check:** Make sure slugs don't conflict with existing pages/posts

## Twig Compatibility

The plugin works seamlessly with Timber-enabled themes and other Twig-based plugins.

**How it works:**

- Automatically detects if Twig is already loaded by your theme
- Uses existing Twig version if available
- Supports Twig 1.x, 2.x, and 3.x
- Prevents version conflicts and fatal errors

**No configuration needed** - compatibility is automatic!

## Template Customization

Templates are located in the `views/` folder:

- `signin.twig` - Sign in page
- `panel.twig` - Panel page

### Common Template Variables

**Sign In Page:**

```twig
{{ page_title }}           {# "Sign In" #}
{{ site_name }}            {# Site name #}
{{ error_message }}        {# Error feedback #}
{{ registration_url }}     {# Registration link #}
```

**Panel Page:**

```twig
{{ user_data.display_name }}  {# Current user #}
{{ user_data.avatar_url }}    {# User avatar #}
{{ panel_data }}              {# Custom data #}
{{ logout_url }}              {# Logout URL #}
```

### WordPress Functions in Twig

```twig
{{ wp_head() }}
{{ wp_footer() }}
{{ get_bloginfo('name') }}
{{ home_url('/') }}
{{ __('Text', 'textdomain') }}
{{ esc_html(variable) }}
```

## Developer Guide

### Helper Functions

```php
// Get page URLs
$signin_url = db_conn_get_signin_url();
$panel_url = db_conn_get_panel_url();

// Check current page
if (is_db_conn_page('signin')) {
    // On signin page
}

// Get settings
$signin_slug = db_conn_get_signin_slug();
$panel_slug = db_conn_get_panel_slug();
```

### Add Custom Panel Data

```php
add_filter('db_conn_panel_context', 'add_my_panel_data');
function add_my_panel_data($context) {
    $context['panel_data'] = array(
        'total_records' => 100,
        'recent_activities' => get_recent_activities()
    );
    return $context;
}
```

## Troubleshooting

### 404 Errors on Custom Pages

**Solution:** Flush rewrite rules

- Go to **Settings → Permalinks** and click "Save Changes"
- Or run `flush_rewrite_rules();` in your code

### Twig Templates Not Loading

1. Run `composer install` in the plugin directory
2. Ensure `/vendor` and `/views` directories exist
3. Enable `WP_DEBUG = true` in `wp-config.php` to see errors
4. Check file permissions

### Slug Validation Errors

- Avoid reserved words like `login`, `admin`, `wp-admin`
- Check for existing pages/posts with the same slug
- Use unique slugs for sign-in and panel pages
- Use only letters, numbers, and hyphens

### Enable Debug Mode

```php
// In wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
// Check wp-content/debug.log for errors
```

## Requirements

| Component | Minimum | Recommended |
| --------- | ------- | ----------- |
| WordPress | 5.0+    | 6.0+        |
| PHP       | 7.4+    | 8.0+        |
| MySQL     | 5.6+    | 8.0+        |

**Dependencies:** Twig (installed via Composer)

**Browser Support:** Chrome, Firefox, Safari, Edge (recent versions)

## Security

The plugin includes built-in security features:

- CSRF protection with nonce verification
- Input sanitization
- Permission checks for admin settings
- XSS protection in templates
- Prepared statements for database queries

## License

**GPL v2 or later**

```
Database Connector WordPress Plugin
Copyright (C) 2025 Majid Barkhordari

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.
```

**Author:** Majid Barkhordari
**Website:** [https://arsamnet.com](https://arsamnet.com)
**Version:** 1.0.0

---

## Quick Reference

**Settings:** `/wp-admin/options-general.php?page=db-conn-settings`

**Key Functions:**

```php
db_conn_get_signin_url()      // Get signin page URL
db_conn_get_panel_url()       // Get panel page URL
is_db_conn_page('signin')     // Check current page
```

**Template Files:**

- `/views/signin.twig`
- `/views/panel.twig`

**Fix 404 Errors:** Go to Settings → Permalinks → Save Changes
