<?php

/**
 * Fired during plugin deactivation
 *
 * @link       https://arsamnet.com
 * @since      3.0.0
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      3.0.0
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 * @author     Majid Barkhordari <info@arsamnet.com>
 */
class Db_Conn_Deactivator
{

	/**
	 * Plugin deactivation logic.
	 *
	 * This method runs when the plugin is deactivated. We preserve user settings
	 * permanently to ensure data persistence across deactivation and even uninstallation.
	 *
	 * @since    3.0.0
	 */
	public static function deactivate()
	{

		// Flush rewrite rules to clean up any custom endpoints
		flush_rewrite_rules();

		// Note: We intentionally do NOT delete user settings here or anywhere else
		// This provides the best user experience as settings persist even after uninstall
		// and will be available if the plugin is reinstalled in the future

		// Log deactivation for debugging purposes
		error_log('Database Connector: Plugin deactivated. Settings preserved permanently.');
	}
}
