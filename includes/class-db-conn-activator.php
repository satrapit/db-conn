<?php

/**
 * Fired during plugin activation
 *
 * @link       https://arsamnet.com
 * @since      3.0.0
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      3.0.0
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 * @author     Majid Barkhordari <info@arsamnet.com>
 */
class Db_Conn_Activator
{

	/**
	 * Plugin activation logic.
	 *
	 * This method runs when the plugin is activated and sets up default settings
	 * if they don't already exist in the database.
	 *
	 * @since    3.0.0
	 */
	public static function activate()
	{

		// Check if plugin settings exist, if not create default settings
		self::create_default_settings();

		// Flush rewrite rules to ensure any custom endpoints work
		flush_rewrite_rules();
	}

	/**
	 * Create default plugin settings if they don't exist.
	 *
	 * @since    3.0.0
	 * @access   private
	 */
	private static function create_default_settings()
	{

		$option_name = 'db_conn_plugin_options';

		// Check if settings already exist
		$existing_settings = get_option($option_name);

		// If settings don't exist, create default settings
		if (false === $existing_settings) {

			$default_settings = array(
				'signin_slug'    => 'signin',
				'panel_slug' => 'panel',
				'created_date'   => current_time('mysql'),
				'version'        => DB_CONN_VERSION
			);

			// Add the default settings to the database
			add_option($option_name, $default_settings);

			// Log activation for debugging purposes
			error_log('Database Connector: Default settings created during plugin activation.');
		} else {

			// Settings exist, but let's ensure all required keys are present
			$updated_settings = self::ensure_all_settings_keys($existing_settings);

			// Update if new keys were added
			if ($updated_settings !== $existing_settings) {
				update_option($option_name, $updated_settings);
				error_log('Database Connector: Missing settings keys added during plugin activation.');
			}
		}
	}

	/**
	 * Ensure all required settings keys exist.
	 *
	 * @since    3.0.0
	 * @access   private
	 * @param    array    $existing_settings    Current settings array.
	 * @return   array                          Updated settings array.
	 */
	private static function ensure_all_settings_keys($existing_settings)
	{

		$default_keys = array(
			'signin_slug'    => 'signin',
			'panel_slug' => 'panel',
			'created_date'   => current_time('mysql'),
			'version'        => DB_CONN_VERSION
		);

		// Merge existing settings with defaults (existing values take precedence)
		$updated_settings = wp_parse_args($existing_settings, $default_keys);

		// Update version to current version
		$updated_settings['version'] = DB_CONN_VERSION;

		return $updated_settings;
	}
}
