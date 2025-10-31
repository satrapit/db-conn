<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://arsamnet.com
 * @since      3.0.0
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/admin
 * @author     Majid Barkhordari <info@arsamnet.com>
 */
class Db_Conn_Admin
{

	/**
	 * The ID of this plugin.
	 *
	 * @since    3.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    3.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * The settings instance.
	 *
	 * @since    3.0.0
	 * @access   private
	 * @var      Db_Conn_Settings    $settings    The settings instance.
	 */
	private $settings;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    3.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		// Load the settings class
		$this->load_settings_class();
	}

	/**
	 * Load the settings class.
	 *
	 * @since    3.0.0
	 * @access   private
	 */
	private function load_settings_class()
	{

		/**
		 * The class responsible for defining the settings functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path(dirname(__FILE__)) . 'admin/class-db-conn-settings.php';

		$this->settings = new Db_Conn_Settings($this->plugin_name, $this->version);
	}

	/**
	 * Add the settings menu page.
	 *
	 * @since    3.0.0
	 */
	public function add_plugin_admin_menu()
	{
		$this->settings->add_settings_page();
	}

	/**
	 * Register plugin settings.
	 *
	 * @since    3.0.0
	 */
	public function register_plugin_settings()
	{
		$this->settings->register_settings();
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    3.0.0
	 */
	public function enqueue_styles()
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Db_Conn_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Db_Conn_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/db-conn-admin.css', array(), $this->version, 'all');

		// Load RTL stylesheet for RTL languages
		if (is_rtl()) {
			wp_enqueue_style($this->plugin_name . '-rtl', plugin_dir_url(__FILE__) . 'css/db-conn-admin-rtl.css', array($this->plugin_name), $this->version, 'all');
		}
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    3.0.0
	 */
	public function enqueue_scripts()
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Db_Conn_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Db_Conn_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/db-conn-admin.js', array('jquery'), $this->version, false);
	}

	/**
	 * Add settings link to the plugin actions on the plugins page.
	 *
	 * @since    3.0.0
	 * @param    array    $links    An array of plugin action links.
	 * @return   array              Modified array of plugin action links.
	 */
	public function add_plugin_action_links($links)
	{
		$settings_link = '<a href="' . admin_url('options-general.php?page=db-conn-settings') . '">' . __('Settings', 'db-conn') . '</a>';
		array_unshift($links, $settings_link);
		return $links;
	}
}