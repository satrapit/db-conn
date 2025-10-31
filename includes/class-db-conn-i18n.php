<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://arsamnet.com
 * @since    3.0.0
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since    3.0.0
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 * @author     Majid Barkhordari <info@arsamnet.com>
 */
class Db_Conn_i18n
{


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    3.0.0
	 */
	public function load_plugin_textdomain()
	{

		load_plugin_textdomain(
			'db-conn',
			false,
			dirname(dirname(plugin_basename(__FILE__))) . '/languages/'
		);
	}
}