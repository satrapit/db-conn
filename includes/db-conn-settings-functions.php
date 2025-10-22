<?php

/**
 * Helper functions for Database Connector plugin settings.
 *
 * @link       https://arsamnet.com
 * @since      1.0.0
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 */

// If this file is called directly, abort.
if (! defined('WPINC')) {
  die;
}

/**
 * Get Database Connector plugin option.
 *
 * @since    1.0.0
 * @param    string    $key    The option key.
 * @param    mixed     $default    The default value.
 * @return   mixed              The option value.
 */
function db_conn_get_option($key, $default = '')
{
  $options = get_option('db_conn_plugin_options');
  return isset($options[$key]) ? $options[$key] : $default;
}

/**
 * Get login page slug.
 *
 * @since    1.0.0
 * @return   string    The login page slug.
 */
function db_conn_get_login_slug()
{
  return db_conn_get_option('login_slug', 'login');
}

/**
 * Get dashboard page slug.
 *
 * @since    1.0.0
 * @return   string    The dashboard page slug.
 */
function db_conn_get_dashboard_slug()
{
  return db_conn_get_option('dashboard_slug', 'dashboard');
}

/**
 * Get all Database Connector plugin options with defaults.
 *
 * @since    1.0.0
 * @return   array    The complete options array with defaults.
 */
function db_conn_get_all_options()
{
  $defaults = array(
    'login_slug'    => 'login',
    'dashboard_slug' => 'dashboard',
    'created_date'   => current_time('mysql'),
    'version'        => defined('DB_CONN_VERSION') ? DB_CONN_VERSION : '1.0.0'
  );

  $options = get_option('db_conn_plugin_options', array());
  return wp_parse_args($options, $defaults);
}

/**
 * Check if plugin settings exist in database.
 *
 * @since    1.0.0
 * @return   bool    True if settings exist, false otherwise.
 */
function db_conn_settings_exist()
{
  $options = get_option('db_conn_plugin_options');
  return false !== $options;
}
