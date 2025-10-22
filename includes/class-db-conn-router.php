<?php

/**
 * The routing functionality of the plugin.
 *
 * @link       https://arsamnet.com
 * @since      1.0.0
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 */

/**
 * The routing functionality of the plugin.
 *
 * Handles custom page routing with rewrite rules and Twig template rendering.
 * Uses singleton pattern to prevent multiple instantiations.
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 * @author     Majid Barkhordari <info@arsamnet.com>
 */
class Db_Conn_Router
{

  /**
   * Singleton instance.
   *
   * @since    1.0.0
   * @access   private
   * @var      Db_Conn_Router    $instance    Singleton instance.
   */
  private static $instance = null;

  /**
   * The ID of this plugin.
   *
   * @since    1.0.0
   * @access   private
   * @var      string    $plugin_name    The ID of this plugin.
   */
  private $plugin_name;

  /**
   * The version of this plugin.
   *
   * @since    1.0.0
   * @access   private
   * @var      string    $version    The current version of this plugin.
   */
  private $version;

  /**
   * The Twig environment instance.
   *
   * @since    1.0.0
   * @access   private
   * @var      \Twig\Environment    $twig    The Twig environment.
   */
  private $twig;

  /**
   * The options name for this plugin.
   *
   * @since    1.0.0
   * @access   private
   * @var      string    $option_name    The option name for this plugin.
   */
  private $option_name = 'db_conn_plugin_options';

  /**
   * Get singleton instance.
   *
   * @since    1.0.0
   * @param    string    $plugin_name    The name of this plugin.
   * @param    string    $version        The version of this plugin.
   * @return   Db_Conn_Router             The singleton instance.
   */
  public static function get_instance($plugin_name = '', $version = '')
  {
    if (null === self::$instance) {
      self::$instance = new self($plugin_name, $version);
    }
    return self::$instance;
  }

  /**
   * Initialize the class and set its properties.
   *
   * @since    1.0.0
   * @param    string    $plugin_name    The name of this plugin.
   * @param    string    $version        The version of this plugin.
   */
  public function __construct($plugin_name, $version)
  {
    $this->plugin_name = $plugin_name;
    $this->version = $version;

    // Don't initialize Twig immediately - wait until it's actually needed
    // This allows themes (like Timber) to load their Twig version first
  }

  /**
   * Initialize Twig environment (lazy loading).
   *
   * @since    1.0.0
   */
  private function init_twig()
  {
    // Return if already initialized
    if ($this->twig !== null) {
      return;
    }

    // Use the Twig loader wrapper to prevent conflicts
    $twig_loader = Db_Conn_Twig_Loader::get_instance();

    // Ensure Twig is available
    if (!$twig_loader->ensure_twig_available()) {
      add_action('admin_notices', array($this, 'twig_missing_notice'));
      return;
    }

    try {
      $views_path = plugin_dir_path(dirname(__FILE__)) . 'views';

      // Create Twig environment using the wrapper
      $this->twig = $twig_loader->create_environment($views_path, [
        'cache' => false, // Disable cache for development
        'debug' => WP_DEBUG,
      ]);

      if (!$this->twig) {
        add_action('admin_notices', array($this, 'twig_error_notice'));
        return;
      }

      // Add debug extension if in debug mode
      $twig_loader->add_debug_extension($this->twig);

      // Add WordPress specific functions to Twig
      $this->add_wordpress_functions_to_twig();
    } catch (Exception $e) {
      add_action('admin_notices', array($this, 'twig_error_notice'));
      error_log('DB Conn Plugin: Twig initialization error: ' . $e->getMessage());
    }
  }
  /**
   * Add WordPress functions to Twig environment.
   *
   * @since    1.0.0
   */
  private function add_wordpress_functions_to_twig()
  {
    if (!$this->twig) {
      return;
    }

    // Get the Twig loader wrapper
    $twig_loader = Db_Conn_Twig_Loader::get_instance();

    // Add essential WordPress functions (no theme integration needed)
    $functions = array(
      'get_bloginfo' => 'get_bloginfo',
      'admin_url' => 'admin_url',
      'home_url' => 'home_url',
      '__' => '__',
      'esc_html' => 'esc_html',
      'esc_attr' => 'esc_attr',
      'esc_url' => 'esc_url',
      'wp_nonce_field' => 'wp_nonce_field',
      'wp_create_nonce' => 'wp_create_nonce',
      'is_rtl' => 'is_rtl',
    );

    foreach ($functions as $twig_name => $php_function) {
      $twig_loader->add_function($this->twig, $twig_name, $php_function);
    }
  }

  /**
   * Register rewrite rules for custom pages.
   *
   * @since    1.0.0
   */
  public function register_rewrite_rules()
  {
    $options = get_option($this->option_name, array());
    $signin_slug = isset($options['signin_slug']) ? $options['signin_slug'] : 'signin';
    $panel_slug = isset($options['panel_slug']) ? $options['panel_slug'] : 'panel';    // Add rewrite rules for custom pages
    add_rewrite_rule(
      '^' . $signin_slug . '/?$',
      'index.php?db_conn_page=signin',
      'top'
    );

    add_rewrite_rule(
      '^' . $panel_slug . '/?$',
      'index.php?db_conn_page=panel',
      'top'
    );
  }

  /**
   * Add query vars for custom pages.
   *
   * @since    1.0.0
   * @param    array    $vars    The query vars.
   * @return   array             The modified query vars.
   */
  public function add_query_vars($vars)
  {
    $vars[] = 'db_conn_page';
    return $vars;
  }

  /**
   * Handle template redirect for custom pages.
   *
   * @since    1.0.0
   */
  public function template_redirect()
  {
    $page = get_query_var('db_conn_page');

    if (!$page) {
      return;
    }

    // Prevent WordPress from handling this as a 404
    global $wp_query;
    $wp_query->is_404 = false;
    status_header(200);

    switch ($page) {
      case 'signin':
        $this->render_signin_page();
        break;
      case 'panel':
        $this->render_panel_page();
        break;
      default:
        // Unknown page, show 404
        global $wp_query;
        $wp_query->set_404();
        status_header(404);
        return;
    }

    exit;
  }

  /**
   * Render the signin page.
   *
   * @since    1.0.0
   */
  private function render_signin_page()
  {
    // Initialize Twig lazily when needed
    $this->init_twig();

    if (!$this->twig) {
      wp_die(__('Database Connector: Twig templating engine is not available.', 'db-conn'));
      return;
    }

    try {
      $context = array(
        'page_title' => __('Sign In', 'db-conn'),
        'signin_url' => home_url(add_query_arg(array(), $GLOBALS['wp']->request)),
        'site_name' => get_bloginfo('name'),
        'form_action' => '', // Add your form action URL here
        'nonce' => wp_create_nonce('db_conn_signin'),
      );

      echo $this->twig->render('signin.twig', $context);
    } catch (Exception $e) {
      wp_die('Twig Error: ' . esc_html($e->getMessage()));
    }
  }

  /**
   * Render the panel page.
   *
   * @since    1.0.0
   */
  private function render_panel_page()
  {
    // Initialize Twig lazily when needed
    $this->init_twig();

    if (!$this->twig) {
      wp_die(__('Database Connector: Twig templating engine is not available.', 'db-conn'));
      return;
    }

    try {
      $context = array(
        'page_title' => __('Panel', 'db-conn'),
        'site_name' => get_bloginfo('name'),
        'user_data' => array(), // Add user data here
        'panel_data' => array(), // Add panel specific data here
      );

      echo $this->twig->render('panel.twig', $context);
    } catch (Exception $e) {
      wp_die('Twig Error: ' . esc_html($e->getMessage()));
    }
  }

  /**
   * Admin notice for missing Twig.
   *
   * @since    1.0.0
   */
  public function twig_missing_notice()
  {
    echo '<div class="notice notice-error"><p>';
    echo esc_html(__('Database Connector: Twig templating engine is not available. Please install Twig via Composer.', 'db-conn'));
    echo '</p></div>';
  }
  /**
   * Admin notice for Twig errors.
   *
   * @since    1.0.0
   */
  public function twig_error_notice()
  {
    echo '<div class="notice notice-error"><p>';
    echo esc_html(__('Database Connector: Error initializing Twig templating engine.', 'db-conn'));
    echo '</p></div>';
  }

  /**
   * Flush rewrite rules.
   *
   * @since    1.0.0
   */
  public function flush_rewrite_rules()
  {
    $this->register_rewrite_rules();
    flush_rewrite_rules();
  }

  /**
   * Validate slug against existing WordPress content.
   *
   * @since    1.0.0
   * @param    string    $slug    The slug to validate.
   * @return   bool|WP_Error      True if valid, WP_Error if invalid.
   */
  public function validate_slug($slug)
  {
    return Db_Conn_Functions::validate_slug($slug, '', false);
  }
}
