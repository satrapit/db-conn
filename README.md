# Database Connector WordPress Plugin

A powerful WordPress plugin that provides database connectivity features with an intuitive settings interface.

## Description

Database Connector is a WordPress plugin designed to enhance your website's database connectivity capabilities. The plugin features a modern, tabbed settings interface and follows WordPress best practices for data management and user experience.

## Features

- **Easy Settings Management**: Intuitive tabbed interface in WordPress admin
- **Custom Page Slugs**: Configure custom slugs for login and dashboard pages
- **Data Persistence**: Settings are preserved even after plugin deactivation/uninstallation
- **WordPress Standards**: Built following WordPress coding standards and best practices
- **Automatic Setup**: Smart activation process that preserves existing configurations

## Installation

1. Upload the plugin files to the `/wp-content/plugins/db-conn` directory
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Navigate to Settings > Database Connector to configure the plugin

## Configuration

### Accessing Settings

After activation, you can access the plugin settings by navigating to:
**WordPress Admin → Settings → Database Connector**

### Settings Overview

The plugin provides two main configuration tabs:

#### General Tab

- Contains general plugin information and settings
- Future features will be added to this section

#### Slug Tab

- **Login Page Slug**: Customize the slug for your login page (default: "login")
- **Dashboard Page Slug**: Customize the slug for your dashboard page (default: "dashboard")

### How to Configure Slugs

1. Go to Settings > Database Connector
2. Click on the "Slug" tab
3. Enter your desired slugs in the text fields:
   - Login Page Slug: Enter custom slug for login functionality
   - Dashboard Page Slug: Enter custom slug for dashboard functionality
4. Click "Save Changes"

## Default Settings

When first activated, the plugin creates the following default settings:

| Setting        | Default Value | Description                     |
| -------------- | ------------- | ------------------------------- |
| Login Slug     | `login`       | Default slug for login page     |
| Dashboard Slug | `dashboard`   | Default slug for dashboard page |

## Data Management

### Settings Preservation

**Important**: This plugin follows a data preservation policy to ensure the best user experience:

- ✅ **Settings preserved during deactivation**
- ✅ **Settings preserved during plugin updates**
- ✅ **Settings preserved even after complete uninstallation**
- ✅ **Seamless experience when reinstalling the plugin**

### Benefits of Data Preservation

- **No Configuration Loss**: Your settings are never accidentally deleted
- **Quick Reactivation**: Instantly available when reactivating the plugin
- **Update Safe**: Plugin updates won't reset your configurations
- **Reinstall Friendly**: All settings restored automatically when reinstalling

## Developer Information

### Accessing Settings Programmatically

Developers can access plugin settings using the provided helper functions:

```php
// Get login page slug
$login_slug = db_conn_get_login_slug();

// Get dashboard page slug
$dashboard_slug = db_conn_get_dashboard_slug();

// Get any custom option with default fallback
$custom_value = db_conn_get_option('option_key', 'default_value');

// Get all plugin options
$all_options = db_conn_get_all_options();

// Check if settings exist
if (db_conn_settings_exist()) {
    // Settings are available
}
```

### Settings Structure

Settings are stored in the WordPress options table as `db_conn_plugin_options`:

```php
array(
    'login_slug'    => 'login',
    'dashboard_slug' => 'dashboard',
    'created_date'   => '2025-10-22 12:00:00',
    'version'        => '1.0.0'
)
```

## Plugin Lifecycle

### Activation

- Automatically creates default settings if none exist
- Preserves existing settings if found
- Adds any missing settings keys for compatibility
- Updates version information

### Deactivation

- Preserves all user settings
- Cleans up temporary data only
- Settings remain available for reactivation

### Uninstallation

- **Settings are intentionally preserved**
- Ensures data safety and user convenience
- Allows seamless reinstallation with existing configurations

## Troubleshooting

### Common Issues

**Settings not appearing after activation:**

- Ensure you have admin privileges
- Check that the plugin activated successfully
- Verify database write permissions

**Settings lost after deactivation:**

- This should not happen - settings are preserved permanently
- Check if other plugins are interfering
- Verify multisite configuration if applicable

**Custom slugs not working:**

- Ensure slugs contain only valid characters (letters, numbers, hyphens)
- Avoid duplicate slugs with existing WordPress pages
- Check for conflicts with other plugins or themes

### Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your WordPress version compatibility
3. Ensure proper file permissions
4. Check for plugin conflicts by deactivating other plugins temporarily

## Technical Requirements

- **WordPress Version**: 5.0 or higher
- **PHP Version**: 7.4 or higher
- **MySQL Version**: 5.6 or higher
- **Permissions**: Plugin installation and database write access

## File Structure

```
db-conn/
├── db-conn.php                 # Main plugin file
├── README.md                   # This file
├── LICENSE.txt                 # License information
├── uninstall.php              # Uninstall handler
├── admin/                     # Admin interface files
│   ├── class-db-conn-admin.php
│   ├── class-db-conn-settings.php
│   └── css/
├── includes/                  # Core functionality
│   ├── class-db-conn.php
│   ├── class-db-conn-activator.php
│   ├── class-db-conn-deactivator.php
│   └── db-conn-settings-functions.php
└── public/                    # Public-facing functionality
```

## License

This plugin is licensed under the GPL v2 or later.

```
Database Connector WordPress Plugin
Copyright (C) 2025 Majid Barkhordari

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
```

## Credits

**Author**: Majid Barkhordari  
**Website**: [https://arsamnet.com](https://arsamnet.com)  
**Version**: 1.0.0

---

For more technical documentation and development information, please refer to the source code and inline documentation.
