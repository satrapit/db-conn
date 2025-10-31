<?php

/**
 * Register all actions and filters for the plugin
 *
 * @link       https://arsamnet.com
 * @since    3.0.0
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 */

/**
 * Register all actions and filters for the plugin.
 *
 * Optimized to register hooks immediately with WordPress API instead of storing in arrays.
 * This reduces memory overhead and improves performance.
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 * @author     Majid Barkhordari <info@arsamnet.com>
 */
class Db_Conn_Loader
{

	/**
	 * Initialize the loader.
	 *
	 * @since    3.0.0
	 */
	public function __construct()
	{
		// No need to initialize arrays - hooks are registered immediately
	}

	/**
	 * Add a new action and register it immediately with WordPress.
	 *
	 * @since    3.0.0
	 * @param    string               $hook             The name of the WordPress action that is being registered.
	 * @param    object               $component        A reference to the instance of the object on which the action is defined.
	 * @param    string               $callback         The name of the function definition on the $component.
	 * @param    int                  $priority         Optional. The priority at which the function should be fired. Default is 10.
	 * @param    int                  $accepted_args    Optional. The number of arguments that should be passed to the $callback. Default is 1.
	 */
	public function add_action($hook, $component, $callback, $priority = 10, $accepted_args = 1)
	{
		add_action($hook, array($component, $callback), $priority, $accepted_args);
	}

	/**
	 * Add a new filter and register it immediately with WordPress.
	 *
	 * @since    3.0.0
	 * @param    string               $hook             The name of the WordPress filter that is being registered.
	 * @param    object               $component        A reference to the instance of the object on which the filter is defined.
	 * @param    string               $callback         The name of the function definition on the $component.
	 * @param    int                  $priority         Optional. The priority at which the function should be fired. Default is 10.
	 * @param    int                  $accepted_args    Optional. The number of arguments that should be passed to the $callback. Default is 1
	 */
	public function add_filter($hook, $component, $callback, $priority = 10, $accepted_args = 1)
	{
		add_filter($hook, array($component, $callback), $priority, $accepted_args);
	}

	/**
	 * Run method for backward compatibility.
	 *
	 * Hooks are now registered immediately, so this method is no longer needed
	 * but kept for backward compatibility.
	 *
	 * @since    3.0.0
	 */
	public function run()
	{
		// Hooks are registered immediately when add_action/add_filter are called
		// This method is kept for backward compatibility
	}
}