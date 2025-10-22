<?php

/**
 * Helper functions class for Database Connector plugin.
 *
 * Provides convenient accessor methods for plugin options and settings.
 *
 * @link       https://arsamnet.com
 * @since      1.0.0
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}

/**
 * Helper functions class for Database Connector plugin.
 *
 * Provides static methods for accessing plugin options and settings.
 *
 * @since      1.0.0
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 * @author     Majid Barkhordari <info@arsamnet.com>
 */
class Db_Conn_Functions
{

	/**
	 * The options name for this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $option_name    The option name for this plugin.
	 */
	private static $option_name = 'db_conn_plugin_options';

	/**
	 * Static cache for options to prevent multiple database calls.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      array|null    $options_cache    Cached options array.
	 */
	private static $options_cache = null;

	/**
	 * Get all options with caching.
	 *
	 * @since    1.0.0
	 * @return   array    The options array.
	 */
	private static function get_cached_options()
	{
		if (null === self::$options_cache) {
			self::$options_cache = get_option(self::$option_name, array());
		}
		return self::$options_cache;
	}

	/**
	 * Clear the options cache.
	 *
	 * @since    1.0.0
	 */
	private static function clear_cache()
	{
		self::$options_cache = null;
	}

	/**
	 * Get Database Connector plugin option.
	 *
	 * @since    1.0.0
	 * @param    string    $key        The option key.
	 * @param    mixed     $default    The default value.
	 * @return   mixed                 The option value.
	 */
	public static function get_option($key, $default = '')
	{
		$options = self::get_cached_options();
		return isset($options[$key]) ? $options[$key] : $default;
	}

	/**
	 * Get signin page slug.
	 *
	 * @since    1.0.0
	 * @return   string    The signin page slug.
	 */
	public static function get_signin_slug()
	{
		return self::get_option('signin_slug', 'signin');
	}

	/**
	 * Get panel page slug.
	 *
	 * @since    1.0.0
	 * @return   string    The panel page slug.
	 */
	public static function get_panel_slug()
	{
		return self::get_option('panel_slug', 'panel');
	}

	/**
	 * Get all Database Connector plugin options with defaults.
	 *
	 * @since    1.0.0
	 * @return   array    The complete options array with defaults.
	 */
	public static function get_all_options()
	{
		$defaults = array(
			'signin_slug'     => 'signin',
			'panel_slug' => 'panel',
			'created_date'   => current_time('mysql'),
			'version'        => defined('DB_CONN_VERSION') ? DB_CONN_VERSION : '1.0.0'
		);

		$options = self::get_cached_options();
		return wp_parse_args($options, $defaults);
	}

	/**
	 * Check if plugin settings exist in database.
	 *
	 * @since    1.0.0
	 * @return   bool    True if settings exist, false otherwise.
	 */
	public static function settings_exist()
	{
		$options = self::get_cached_options();
		return !empty($options);
	}

	/**
	 * Update a plugin option.
	 *
	 * @since    1.0.0
	 * @param    string    $key      The option key.
	 * @param    mixed     $value    The option value.
	 * @return   bool                True if updated, false otherwise.
	 */
	public static function update_option($key, $value)
	{
		$options = self::get_cached_options();
		$options[$key] = $value;
		$result = update_option(self::$option_name, $options);
		if ($result) {
			self::clear_cache(); // Clear cache after update
		}
		return $result;
	}

	/**
	 * Update multiple plugin options at once.
	 *
	 * @since    1.0.0
	 * @param    array    $options    Array of key-value pairs to update.
	 * @return   bool                 True if updated, false otherwise.
	 */
	public static function update_options($options)
	{
		$current_options = self::get_cached_options();
		$updated_options = array_merge($current_options, $options);
		$result = update_option(self::$option_name, $updated_options);
		if ($result) {
			self::clear_cache(); // Clear cache after update
		}
		return $result;
	}

	/**
	 * Delete a plugin option.
	 *
	 * @since    1.0.0
	 * @param    string    $key    The option key to delete.
	 * @return   bool              True if deleted, false otherwise.
	 */
	public static function delete_option($key)
	{
		$options = self::get_cached_options();
		if (isset($options[$key])) {
			unset($options[$key]);
			$result = update_option(self::$option_name, $options);
			if ($result) {
				self::clear_cache(); // Clear cache after deletion
			}
			return $result;
		}
		return false;
	}

	/**
	 * Get the option name used by this plugin.
	 *
	 * @since    1.0.0
	 * @return   string    The option name.
	 */
	public static function get_option_name()
	{
		return self::$option_name;
	}

	/**
	 * Get list of reserved slugs that cannot be used.
	 *
	 * @since    1.0.0
	 * @return   array    Array of reserved slugs.
	 */
	public static function get_reserved_slugs()
	{
		return array(
			'wp-admin',
			'wp-content',
			'wp-includes',
			'wp-json',
			'admin',
			'api',
			'app',
			'archive',
			'attachment',
			'author',
			'blog',
			'category',
			'comment',
			'comments',
			'contact',
			'dashboard',
			'date',
			'day',
			'feed',
			'home',
			'hour',
			'index',
			'login',
			'logout',
			'month',
			'page',
			'paged',
			'post',
			'posts',
			'privacy',
			'register',
			'search',
			'sitemap',
			'tag',
			'tags',
			'user',
			'users',
			'year'
		);
	}

	/**
	 * Validate slug against existing WordPress content and reserved words.
	 *
	 * @since    1.0.0
	 * @param    string    $slug           The slug to validate.
	 * @param    string    $type           Optional. The type of slug (for error messages).
	 * @param    bool      $allow_current  Optional. Whether to allow current plugin slugs. Default true.
	 * @return   bool|WP_Error             True if valid, WP_Error if invalid.
	 */
	public static function validate_slug($slug, $type = '', $allow_current = true)
	{
		// Sanitize the slug
		$slug = sanitize_title($slug);

		if (empty($slug)) {
			$message = $type ? sprintf(__('%s slug cannot be empty.', 'db-conn'), ucfirst($type)) : __('Slug cannot be empty.', 'db-conn');
			return new WP_Error('empty_slug', $message);
		}

		// Check cache first for performance
		$cache_key = 'db_conn_slug_valid_' . md5($slug . $type . (int)$allow_current);
		$cached_result = get_transient($cache_key);

		if (false !== $cached_result) {
			// Return cached result (true or WP_Error serialized)
			if (is_array($cached_result) && isset($cached_result['error'])) {
				return new WP_Error($cached_result['code'], $cached_result['message']);
			}
			return $cached_result;
		}

		// Get reserved slugs
		$reserved_slugs = self::get_reserved_slugs();

		// If allowing current plugin slugs, remove them from reserved list
		if ($allow_current) {
			$current_options = self::get_cached_options();
			if (isset($current_options['signin_slug'])) {
				$reserved_slugs = array_diff($reserved_slugs, array($current_options['signin_slug']));
			}
			if (isset($current_options['panel_slug'])) {
				$reserved_slugs = array_diff($reserved_slugs, array($current_options['panel_slug']));
			}
		}

		// Check against reserved slugs
		if (in_array($slug, $reserved_slugs)) {
			$error = new WP_Error('reserved_slug', sprintf(__('The slug "%s" is reserved by WordPress.', 'db-conn'), $slug));
			// Cache error for 5 minutes
			set_transient($cache_key, array('error' => true, 'code' => 'reserved_slug', 'message' => $error->get_error_message()), 5 * MINUTE_IN_SECONDS);
			return $error;
		}

		// Check against existing pages
		$existing_page = get_page_by_path($slug);
		if ($existing_page) {
			$error = new WP_Error('existing_page', sprintf(__('A page with slug "%s" already exists.', 'db-conn'), $slug));
			set_transient($cache_key, array('error' => true, 'code' => 'existing_page', 'message' => $error->get_error_message()), 5 * MINUTE_IN_SECONDS);
			return $error;
		}

		// Check against existing posts
		$existing_post = get_page_by_path($slug, OBJECT, 'post');
		if ($existing_post) {
			$error = new WP_Error('existing_post', sprintf(__('A post with slug "%s" already exists.', 'db-conn'), $slug));
			set_transient($cache_key, array('error' => true, 'code' => 'existing_post', 'message' => $error->get_error_message()), 5 * MINUTE_IN_SECONDS);
			return $error;
		}

		// Check against custom post types
		$post_types = get_post_types(array('public' => true), 'names');
		foreach ($post_types as $post_type) {
			if ($post_type === 'attachment') continue; // Skip attachments

			$existing_cpt = get_page_by_path($slug, OBJECT, $post_type);
			if ($existing_cpt) {
				$error = new WP_Error('existing_cpt', sprintf(__('Content with slug "%s" already exists.', 'db-conn'), $slug));
				set_transient($cache_key, array('error' => true, 'code' => 'existing_cpt', 'message' => $error->get_error_message()), 5 * MINUTE_IN_SECONDS);
				return $error;
			}
		}

		// Check against taxonomies
		$taxonomies = get_taxonomies(array('public' => true), 'names');
		foreach ($taxonomies as $taxonomy) {
			$term = get_term_by('slug', $slug, $taxonomy);
			if ($term) {
				$error = new WP_Error('existing_term', sprintf(__('A %s with slug "%s" already exists.', 'db-conn'), $taxonomy, $slug));
				set_transient($cache_key, array('error' => true, 'code' => 'existing_term', 'message' => $error->get_error_message()), 5 * MINUTE_IN_SECONDS);
				return $error;
			}
		}

		// Valid slug - cache the result for 5 minutes
		set_transient($cache_key, true, 5 * MINUTE_IN_SECONDS);
		return true;
	}
}

// Backward compatibility: Keep procedural function wrappers
if (!function_exists('db_conn_get_option')) {
	/**
	 * Get Database Connector plugin option.
	 *
	 * @since    1.0.0
	 * @param    string    $key        The option key.
	 * @param    mixed     $default    The default value.
	 * @return   mixed                 The option value.
	 */
	function db_conn_get_option($key, $default = '')
	{
		return Db_Conn_Functions::get_option($key, $default);
	}
}

if (!function_exists('db_conn_get_signin_slug')) {
	/**
	 * Get signin page slug.
	 *
	 * @since    1.0.0
	 * @return   string    The signin page slug.
	 */
	function db_conn_get_signin_slug()
	{
		return Db_Conn_Functions::get_signin_slug();
	}
}

if (!function_exists('db_conn_get_panel_slug')) {
	/**
	 * Get panel page slug.
	 *
	 * @since    1.0.0
	 * @return   string    The panel page slug.
	 */
	function db_conn_get_panel_slug()
	{
		return Db_Conn_Functions::get_panel_slug();
	}
}

if (!function_exists('db_conn_get_all_options')) {
	/**
	 * Get all Database Connector plugin options with defaults.
	 *
	 * @since    1.0.0
	 * @return   array    The complete options array with defaults.
	 */
	function db_conn_get_all_options()
	{
		return Db_Conn_Functions::get_all_options();
	}
}

if (!function_exists('db_conn_settings_exist')) {
	/**
	 * Check if plugin settings exist in database.
	 *
	 * @since    1.0.0
	 * @return   bool    True if settings exist, false otherwise.
	 */
	function db_conn_settings_exist()
	{
		return Db_Conn_Functions::settings_exist();
	}
}
