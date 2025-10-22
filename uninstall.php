<?php

/**
 * Fired when the plugin is uninstalled.
 *
 * When populating this file, consider the following flow
 * of control:
 *
 * - This method should be static
 * - Check if the $_REQUEST content actually is the plugin name
 * - Run an admin referrer check to make sure it goes through authentication
 * - Verify the output of $_GET makes sense
 * - Repeat with other user roles. Best directly by using the links/query string parameters.
 * - Repeat things for multisite. Once for a single site in the network, once sitewide.
 *
 * This file may be updated more in future version of the Boilerplate; however, this is the
 * general skeleton and outline for how the file should work.
 *
 * For more information, see the following discussion:
 * https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate/pull/123#issuecomment-28541913
 *
 * @link       https://arsamnet.com
 * @since      1.0.0
 *
 * @package    Db_Conn
 */

// If uninstall not called from WordPress, then exit.
if (! defined('WP_UNINSTALL_PLUGIN')) {
	exit;
}

/**
 * Plugin uninstall handler.
 *
 * NOTE: This plugin intentionally preserves all user settings and data
 * even after uninstallation. This ensures that if users reinstall the
 * plugin in the future, their configurations will be retained.
 *
 * The following data is preserved:
 * - Plugin settings (db_conn_plugin_options)
 * - User configurations
 * - Custom slugs and preferences
 *
 * This approach provides a better user experience and follows the principle
 * of data preservation for user-generated content and configurations.
 */

// Log uninstall event for debugging purposes
error_log('Database Connector: Plugin uninstalled. User settings preserved for future use.');
