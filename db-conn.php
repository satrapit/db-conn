<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://arsamnet.com
 * @since             3.0.0
 * @package           Db_Conn
 *
 * @wordpress-plugin
 * Plugin Name:       Database Connector
 * Plugin URI:        https://arsamnet.com
 * Description:       Database Connector is a WordPress plugin that allows you to connect to external databases and display data on your website.
 * Version:           3.0.0
 * Author:            Majid Barkhordari
 * Author URI:        https://arsamnet.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       db-conn
 * Domain Path:       /languages
 * Requires at least: 5.0
 * Requires PHP:      7.2
 */

// If this file is called directly, abort.
if (! defined('WPINC')) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 3.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('DB_CONN_VERSION', '3.0.0');

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-db-conn-activator.php
 */
function activate_db_conn()
{
	require_once plugin_dir_path(__FILE__) . 'includes/class-db-conn-activator.php';
	Db_Conn_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-db-conn-deactivator.php
 */
function deactivate_db_conn()
{
	require_once plugin_dir_path(__FILE__) . 'includes/class-db-conn-deactivator.php';
	Db_Conn_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_db_conn');
register_deactivation_hook(__FILE__, 'deactivate_db_conn');

/**
 * Load plugin textdomain for header translations.
 */
add_action('init', 'db_conn_load_plugin_textdomain');
function db_conn_load_plugin_textdomain()
{
	load_plugin_textdomain('db-conn', false, dirname(plugin_basename(__FILE__)) . '/languages/');
}

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path(__FILE__) . 'includes/class-db-conn.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    3.0.0
 */
function run_db_conn()
{

	$plugin = new Db_Conn();
	$plugin->run();
}
run_db_conn();