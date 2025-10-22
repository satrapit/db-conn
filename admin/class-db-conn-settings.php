<?php

/**
 * The settings-specific functionality of the plugin.
 *
 * @link       https://arsamnet.com
 * @since      1.0.0
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/admin
 */

/**
 * The settings-specific functionality of the plugin.
 *
 * Defines the settings page with tabbed interface for Database Connector plugin.
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/admin
 * @author     Majid Barkhordari <info@arsamnet.com>
 */
class Db_Conn_Settings
{

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
   * The options name for this plugin.
   *
   * @since    1.0.0
   * @access   private
   * @var      string    $option_name    The option name for this plugin.
   */
  private $option_name = 'db_conn_plugin_options';

  /**
   * Initialize the class and set its properties.
   *
   * @since    1.0.0
   * @param      string    $plugin_name       The name of this plugin.
   * @param      string    $version    The version of this plugin.
   */
  public function __construct($plugin_name, $version)
  {

    $this->plugin_name = $plugin_name;
    $this->version = $version;
  }

  /**
   * Add the settings page to the admin menu.
   *
   * @since    1.0.0
   */
  public function add_settings_page()
  {
    add_options_page(
      __('Database Connector Settings', 'db-conn'),
      __('Database Connector', 'db-conn'),
      'manage_options',
      'db-conn-settings',
      array($this, 'display_settings_page')
    );
  }

  /**
   * Register the settings for this plugin.
   *
   * @since    1.0.0
   */
  public function register_settings()
  {
    register_setting(
      'db_conn_settings_group',
      $this->option_name,
      array($this, 'sanitize_settings')
    );

    // General settings section
    add_settings_section(
      'db_conn_general_section',
      __('General Settings', 'db-conn'),
      array($this, 'general_section_callback'),
      'db-conn-general'
    );

    // Slug settings section
    add_settings_section(
      'db_conn_slug_section',
      __('Slug Settings', 'db-conn'),
      array($this, 'slug_section_callback'),
      'db-conn-slug'
    );

    // Login slug field
    add_settings_field(
      'login_slug',
      __('Login Page Slug', 'db-conn'),
      array($this, 'login_slug_callback'),
      'db-conn-slug',
      'db_conn_slug_section'
    );

    // Dashboard slug field
    add_settings_field(
      'dashboard_slug',
      __('Dashboard Page Slug', 'db-conn'),
      array($this, 'dashboard_slug_callback'),
      'db-conn-slug',
      'db_conn_slug_section'
    );
  }

  /**
   * Display the settings page.
   *
   * @since    1.0.0
   */
  public function display_settings_page()
  {
    // Get the active tab from the $_GET param
    $default_tab = 'general';
    $tab = isset($_GET['tab']) ? $_GET['tab'] : $default_tab;
?>
    <div class="wrap db-conn-settings">
      <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

      <nav class="nav-tab-wrapper">
        <a href="?page=db-conn-settings&tab=general" class="nav-tab <?php echo $tab === 'general' ? 'nav-tab-active' : ''; ?>">
          <?php _e('General', 'db-conn'); ?>
        </a>
        <a href="?page=db-conn-settings&tab=slug" class="nav-tab <?php echo $tab === 'slug' ? 'nav-tab-active' : ''; ?>">
          <?php _e('Slug', 'db-conn'); ?>
        </a>
      </nav>

      <div class="tab-content">
        <?php
        switch ($tab) {
          case 'general':
            $this->display_general_tab();
            break;
          case 'slug':
            $this->display_slug_tab();
            break;
        }
        ?>
      </div>
    </div>
  <?php
  }

  /**
   * Display the general tab content.
   *
   * @since    1.0.0
   */
  private function display_general_tab()
  {
  ?>
    <form action="options.php" method="post">
      <?php
      settings_fields('db_conn_settings_group');
      do_settings_sections('db-conn-general');
      ?>
      <div style="margin-top: 20px;">
        <p><?php _e('This is the general settings tab.', 'db-conn'); ?></p>
      </div>
      <?php submit_button(); ?>
    </form>
  <?php
  }

  /**
   * Display the slug tab content.
   *
   * @since    1.0.0
   */
  private function display_slug_tab()
  {
  ?>
    <form action="options.php" method="post">
      <?php
      settings_fields('db_conn_settings_group');
      do_settings_sections('db-conn-slug');
      submit_button();
      ?>
    </form>
  <?php
  }

  /**
   * General section callback.
   *
   * @since    1.0.0
   */
  public function general_section_callback()
  {
    echo '<p>' . __('Configure general settings for the Database Connector plugin.', 'db-conn') . '</p>';
  }

  /**
   * Slug section callback.
   *
   * @since    1.0.0
   */
  public function slug_section_callback()
  {
    echo '<p>' . __('Configure custom slugs for plugin pages.', 'db-conn') . '</p>';
  }

  /**
   * Login slug field callback.
   *
   * @since    1.0.0
   */
  public function login_slug_callback()
  {
    $options = get_option($this->option_name, array());
    $value = isset($options['login_slug']) ? $options['login_slug'] : 'login';
  ?>
    <input type="text" id="login_slug" name="<?php echo $this->option_name; ?>[login_slug]" value="<?php echo esc_attr($value); ?>" class="regular-text" />
    <p class="description"><?php _e('Enter the custom slug for the login page.', 'db-conn'); ?></p>
  <?php
  }

  /**
   * Dashboard slug field callback.
   *
   * @since    1.0.0
   */
  public function dashboard_slug_callback()
  {
    $options = get_option($this->option_name, array());
    $value = isset($options['dashboard_slug']) ? $options['dashboard_slug'] : 'dashboard';
  ?>
    <input type="text" id="dashboard_slug" name="<?php echo $this->option_name; ?>[dashboard_slug]" value="<?php echo esc_attr($value); ?>" class="regular-text" />
    <p class="description"><?php _e('Enter the custom slug for the dashboard page.', 'db-conn'); ?></p>
<?php
  }

  /**
   * Sanitize the settings.
   *
   * @since    1.0.0
   * @param    array    $input    The input array.
   * @return   array              The sanitized array.
   */
  public function sanitize_settings($input)
  {
    $sanitized = array();

    if (isset($input['login_slug'])) {
      $sanitized['login_slug'] = sanitize_title($input['login_slug']);
    }

    if (isset($input['dashboard_slug'])) {
      $sanitized['dashboard_slug'] = sanitize_title($input['dashboard_slug']);
    }

    return $sanitized;
  }

  /**
   * Get plugin option value.
   *
   * @since    1.0.0
   * @param    string    $key    The option key.
   * @param    mixed     $default    The default value.
   * @return   mixed              The option value.
   */
  public function get_option($key, $default = '')
  {
    $options = get_option($this->option_name, array());
    return isset($options[$key]) ? $options[$key] : $default;
  }
}
