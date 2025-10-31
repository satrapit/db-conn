<?php

/**
 * The settings-specific functionality of the plugin.
 *
 * @link       https://arsamnet.com
 * @since      3.0.0
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
   * The options name for this plugin.
   *
   * @since    3.0.0
   * @access   private
   * @var      string    $option_name    The option name for this plugin.
   */
  private $option_name = 'db_conn_plugin_options';

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
  }

  /**
   * Add the settings page to the admin menu.
   *
   * @since    3.0.0
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
   * @since    3.0.0
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

    // Sign-in slug field
    add_settings_field(
      'signin_slug',
      __('Sign In Page Slug', 'db-conn'),
      array($this, 'signin_slug_callback'),
      'db-conn-slug',
      'db_conn_slug_section'
    );

    // Dashboard slug field
    add_settings_field(
      'panel_slug',
      __('Panel Page Slug', 'db-conn'),
      array($this, 'panel_slug_callback'),
      'db-conn-slug',
      'db_conn_slug_section'
    );

    // Services slug field
    add_settings_field(
      'services_slug',
      __('Services Page Slug', 'db-conn'),
      array($this, 'services_slug_callback'),
      'db-conn-slug',
      'db_conn_slug_section'
    );

    // Help slug field
    add_settings_field(
      'help_slug',
      __('Help Page Slug', 'db-conn'),
      array($this, 'help_slug_callback'),
      'db-conn-slug',
      'db_conn_slug_section'
    );

    // Profile slug field
    add_settings_field(
      'profile_slug',
      __('Profile Page Slug', 'db-conn'),
      array($this, 'profile_slug_callback'),
      'db-conn-slug',
      'db_conn_slug_section'
    );

    // About slug field
    add_settings_field(
      'about_slug',
      __('About Page Slug', 'db-conn'),
      array($this, 'about_slug_callback'),
      'db-conn-slug',
      'db_conn_slug_section'
    );
  }

  /**
   * Display the settings page.
   *
   * @since    3.0.0
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
        <a href="?page=db-conn-settings&tab=general"
          class="nav-tab <?php echo $tab === 'general' ? 'nav-tab-active' : ''; ?>">
          <?php _e('General', 'db-conn'); ?>
        </a>
        <a href="?page=db-conn-settings&tab=slug" class="nav-tab <?php echo $tab === 'slug' ? 'nav-tab-active' : ''; ?>">
          <?php _e('Page slugs', 'db-conn'); ?>
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
   * @since    3.0.0
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
   * @since    3.0.0
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
   * @since    3.0.0
   */
  public function general_section_callback()
  {
    echo '<p>' . __('Configure general settings for the Database Connector plugin.', 'db-conn') . '</p>';
  }

  /**
   * Slug section callback.
   *
   * @since    3.0.0
   */
  public function slug_section_callback()
  {
    echo '<p>' . __('Configure custom slugs for plugin pages.', 'db-conn') . '</p>';
  }

  /**
   * Sign-in slug field callback.
   *
   * @since    3.0.0
   */
  public function signin_slug_callback()
  {
    $options = get_option($this->option_name, array());
    $value = isset($options['signin_slug']) ? $options['signin_slug'] : 'signin';
  ?>
    <input type="text" id="signin_slug" name="<?php echo $this->option_name; ?>[signin_slug]"
      value="<?php echo esc_attr($value); ?>" class="regular-text" />
    <p class="description"><?php _e('Enter the custom slug for the sign in page.', 'db-conn'); ?></p>
  <?php
  }
  /**
   * Dashboard slug field callback.
   *
   * @since    3.0.0
   */
  public function panel_slug_callback()
  {
    $options = get_option($this->option_name, array());
    $value = isset($options['panel_slug']) ? $options['panel_slug'] : 'panel';
  ?>
    <input type="text" id="panel_slug" name="<?php echo $this->option_name; ?>[panel_slug]"
      value="<?php echo esc_attr($value); ?>" class="regular-text" />
    <p class="description"><?php _e('Enter the custom slug for the panel page.', 'db-conn'); ?></p>
  <?php
  }

  /**
   * Services slug field callback.
   *
   * @since    3.0.0
   */
  public function services_slug_callback()
  {
    $options = get_option($this->option_name, array());
    $value = isset($options['services_slug']) ? $options['services_slug'] : 'services';
  ?>
    <input type="text" id="services_slug" name="<?php echo $this->option_name; ?>[services_slug]"
      value="<?php echo esc_attr($value); ?>" class="regular-text" />
    <p class="description"><?php _e('Enter the custom slug for the services page.', 'db-conn'); ?></p>
  <?php
  }

  /**
   * Help slug field callback.
   *
   * @since    3.0.0
   */
  public function help_slug_callback()
  {
    $options = get_option($this->option_name, array());
    $value = isset($options['help_slug']) ? $options['help_slug'] : 'help';
  ?>
    <input type="text" id="help_slug" name="<?php echo $this->option_name; ?>[help_slug]"
      value="<?php echo esc_attr($value); ?>" class="regular-text" />
    <p class="description"><?php _e('Enter the custom slug for the help page.', 'db-conn'); ?></p>
  <?php
  }

  /**
   * Profile slug field callback.
   *
   * @since    3.0.0
   */
  public function profile_slug_callback()
  {
    $options = get_option($this->option_name, array());
    $value = isset($options['profile_slug']) ? $options['profile_slug'] : 'profile';
  ?>
    <input type="text" id="profile_slug" name="<?php echo $this->option_name; ?>[profile_slug]"
      value="<?php echo esc_attr($value); ?>" class="regular-text" />
    <p class="description"><?php _e('Enter the custom slug for the profile page.', 'db-conn'); ?></p>
  <?php
  }

  /**
   * About slug field callback.
   *
   * @since    3.0.0
   */
  public function about_slug_callback()
  {
    $options = get_option($this->option_name, array());
    $value = isset($options['about_slug']) ? $options['about_slug'] : 'about';
  ?>
    <input type="text" id="about_slug" name="<?php echo $this->option_name; ?>[about_slug]"
      value="<?php echo esc_attr($value); ?>" class="regular-text" />
    <p class="description"><?php _e('Enter the custom slug for the about page.', 'db-conn'); ?></p>
<?php
  }

  /**
   * Sanitize the settings.
   *
   * @since    3.0.0
   * @param    array    $input    The input array.
   * @return   array              The sanitized array.
   */
  public function sanitize_settings($input)
  {
    // Verify nonce for security
    if (!isset($_POST['_wpnonce']) || !wp_verify_nonce($_POST['_wpnonce'], 'db_conn_settings_group-options')) {
      add_settings_error(
        $this->option_name,
        'nonce_failed',
        __('Security check failed. Please try again.', 'db-conn'),
        'error'
      );
      return get_option($this->option_name, array());
    }

    // Verify user capabilities
    if (!current_user_can('manage_options')) {
      add_settings_error(
        $this->option_name,
        'unauthorized',
        __('You do not have permission to modify these settings.', 'db-conn'),
        'error'
      );
      return get_option($this->option_name, array());
    }

    $sanitized = array();
    $old_options = get_option($this->option_name, array());
    $slugs_changed = false;

    if (isset($input['signin_slug'])) {
      $signin_slug = sanitize_title($input['signin_slug']);

      // Validate the signin slug
      $validation_result = $this->validate_slug($signin_slug, 'signin');
      if (is_wp_error($validation_result)) {
        add_settings_error(
          $this->option_name,
          'signin_slug_error',
          $validation_result->get_error_message(),
          'error'
        );
        // Keep the old value if validation fails
        $sanitized['signin_slug'] = isset($old_options['signin_slug']) ? $old_options['signin_slug'] : 'signin';
      } else {
        $sanitized['signin_slug'] = $signin_slug;
        // Check if slug changed
        if (!isset($old_options['signin_slug']) || $old_options['signin_slug'] !== $signin_slug) {
          $slugs_changed = true;
        }
      }
    }

    if (isset($input['panel_slug'])) {
      $panel_slug = sanitize_title($input['panel_slug']);

      // Validate the panel slug
      $validation_result = $this->validate_slug($panel_slug, 'panel');
      if (is_wp_error($validation_result)) {
        add_settings_error(
          $this->option_name,
          'panel_slug_error',
          $validation_result->get_error_message(),
          'error'
        );
        // Keep the old value if validation fails
        $sanitized['panel_slug'] = isset($old_options['panel_slug']) ? $old_options['panel_slug'] : 'panel';
      } else {
        $sanitized['panel_slug'] = $panel_slug;
        // Check if slug changed
        if (!isset($old_options['panel_slug']) || $old_options['panel_slug'] !== $panel_slug) {
          $slugs_changed = true;
        }
      }
    }

    // Sanitize and validate all other page slugs
    $page_slugs = array('services', 'help', 'profile', 'about');
    foreach ($page_slugs as $page_type) {
      $input_key = $page_type . '_slug';
      if (isset($input[$input_key])) {
        $slug = sanitize_title($input[$input_key]);

        // Validate the slug
        $validation_result = $this->validate_slug($slug, $page_type);
        if (is_wp_error($validation_result)) {
          add_settings_error(
            $this->option_name,
            $input_key . '_error',
            $validation_result->get_error_message(),
            'error'
          );
          // Keep the old value if validation fails
          $sanitized[$input_key] = isset($old_options[$input_key]) ? $old_options[$input_key] : $page_type;
        } else {
          $sanitized[$input_key] = $slug;
          // Check if slug changed
          if (!isset($old_options[$input_key]) || $old_options[$input_key] !== $slug) {
            $slugs_changed = true;
          }
        }
      }
    }

    // Check for duplicate slugs within our own settings
    $all_slugs = array();
    foreach ($sanitized as $key => $value) {
      if (strpos($key, '_slug') !== false) {
        if (in_array($value, $all_slugs)) {
          add_settings_error(
            $this->option_name,
            'duplicate_slugs_error',
            sprintf(__('Duplicate slug detected: %s. All page slugs must be unique.', 'db-conn'), $value),
            'error'
          );
          // Reset to old options
          $sanitized = $old_options;
          $slugs_changed = false;
          break;
        }
        $all_slugs[] = $value;
      }
    }

    // If slugs changed and no errors, schedule rewrite rules flush
    if ($slugs_changed && !get_settings_errors($this->option_name)) {
      // Use transient to trigger flush on next page load
      set_transient('db_conn_flush_rewrite_rules', 1, 60);

      add_settings_error(
        $this->option_name,
        'slugs_updated',
        __('Slugs updated successfully. Rewrite rules have been refreshed.', 'db-conn'),
        'success'
      );
    }

    return $sanitized;
  }

  /**
   * Get plugin option value.
   *
   * @since    3.0.0
   * @param    string    $key    The option key.
   * @param    mixed     $default    The default value.
   * @return   mixed              The option value.
   */
  public function get_option($key, $default = '')
  {
    $options = get_option($this->option_name, array());
    return isset($options[$key]) ? $options[$key] : $default;
  }

  /**
   * Validate slug against existing WordPress content.
   *
   * @since    3.0.0
   * @param    string    $slug    The slug to validate.
   * @param    string    $type    The type of slug (signin/panel).
   * @return   bool|WP_Error      True if valid, WP_Error if invalid.
   */
  private function validate_slug($slug, $type = '')
  {
    return Db_Conn_Functions::validate_slug($slug, $type, true);
  }
}
