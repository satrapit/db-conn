<?php

/**
 * Twig Loader Wrapper for DB Conn Plugin
 *
 * This class provides a safe way to load Twig without conflicting with
 * themes (like Timber) that may already have Twig loaded.
 *
 * Note: This file contains references to both Twig 1.x, 2.x, and 3.x classes.
 * The code uses runtime checks to determine which version is available.
 * IDE warnings about undefined classes are expected and can be ignored.
 *
 * @link       https://arsamnet.com
 * @since      1.0.0
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 *
 * @phpcs:disable PHPCompatibility.FunctionNameRestrictions.NewMagicMethods
 * @phpcs:disable WordPress.NamingConventions.ValidVariableName
 *
 * @phpstan-ignore-next-line
 * @psalm-suppress all
 * @SuppressWarnings(PHPMD)
 */

// phpcs:ignoreFile - This file intentionally uses dynamic class loading for multi-version Twig support

/**
 * Twig Loader Wrapper Class.
 *
 * Handles Twig loading with conflict prevention and version compatibility.
 *
 * IMPORTANT: This class references Twig 1.x classes (Twig_Environment, etc.) that may not exist
 * in the current environment. These are loaded dynamically by Timber/theme. Runtime checks ensure
 * the correct version is used. VS Code warnings about undefined types are EXPECTED and SAFE.
 *
 * @package    Db_Conn
 * @subpackage Db_Conn/includes
 * @author     Majid Barkhordari <info@arsamnet.com>
 */
class Db_Conn_Twig_Loader
{
  /**
   * Singleton instance.
   *
   * @var Db_Conn_Twig_Loader
   */
  private static $instance = null;

  /**
   * Whether plugin's autoloader has been loaded.
   *
   * @var bool
   */
  private static $autoloader_loaded = false;

  /**
   * Get singleton instance.
   *
   * @return Db_Conn_Twig_Loader
   */
  public static function get_instance()
  {
    if (null === self::$instance) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  /**
   * Private constructor to prevent direct instantiation.
   */
  private function __construct()
  {
    // Private constructor
  }

  /**
   * Check if Twig is available and load it if necessary.
   *
   * @return bool True if Twig is available, false otherwise.
   */
  public function ensure_twig_available()
  {
    // Always check if Twig is already loaded first
    if ($this->is_twig_loaded()) {
      error_log('DB Conn Plugin: Twig already loaded (likely by Timber)');
      return true;
    }

    // Twig not loaded - only load our own if Timber is NOT present
    // This prevents conflicts with Timber loading Twig later
    if ($this->is_timber_present()) {
      error_log('DB Conn Plugin: Timber detected, will not load plugin Twig');
      // Don't load our Twig, use fallback templates
      return false;
    }

    // No Timber, no Twig - load our own
    error_log('DB Conn Plugin: Loading plugin Twig (no Timber detected)');
    return $this->load_plugin_autoloader();
  }
  /**
   * Check if Timber is present in the theme.
   *
   * @return bool
   */
  public function is_timber_present()
  {
    // IMPORTANT: Check file system first since plugins load before themes
    // and Timber classes won't exist yet during plugin initialization

    // Check if theme has Timber in vendor directory (most reliable check)
    $theme_timber_paths = array(
      get_template_directory() . '/vendor/timber/timber',
      get_stylesheet_directory() . '/vendor/timber/timber',
      get_template_directory() . '/vendor/upstatement/timber',
      get_stylesheet_directory() . '/vendor/upstatement/timber',
      get_template_directory() . '/vendor/autoload.php', // Theme uses Composer
      get_stylesheet_directory() . '/vendor/autoload.php',
    );

    foreach ($theme_timber_paths as $path) {
      if (file_exists($path)) {
        // Double-check it's actually Timber by looking for specific files
        $parent_dir = dirname($path);
        if (
          strpos($path, 'timber') !== false ||
          file_exists($parent_dir . '/timber/timber') ||
          file_exists($parent_dir . '/upstatement/timber')
        ) {
          return true;
        }
      }
    }

    // Fallback: Check if Timber class exists (only works after theme loads)
    if (class_exists('Timber\Timber') || class_exists('Timber')) {
      return true;
    }

    return false;
  }

  /**
   * Callback after theme setup to check Twig availability.
   */
  public function on_theme_setup()
  {
    // Check again if Twig is now loaded by the theme
    if (!$this->is_twig_loaded()) {
      // Theme didn't load Twig, load our own
      $this->load_plugin_autoloader();
    }
  }

  /**
   * Check if Twig is already loaded.
   *
   * @return bool
   */
  private function is_twig_loaded()
  {
    // Check for Twig 3.x, 2.x, or 1.x
    return class_exists('\Twig\Environment') ||
      class_exists('\Twig_Environment');
  }

  /**
   * Load the plugin's composer autoloader.
   *
   * @return bool
   */
  private function load_plugin_autoloader()
  {
    if (self::$autoloader_loaded) {
      return true;
    }

    // Final check: if Timber is present, DO NOT load our autoloader
    // Let Timber load its own Twig version
    if ($this->is_timber_present()) {
      error_log('DB Conn Plugin: Timber detected, skipping plugin Twig autoloader');
      return false;
    }

    $autoload_path = plugin_dir_path(dirname(__FILE__)) . 'vendor/autoload.php';

    if (!file_exists($autoload_path)) {
      return false;
    }

    // Load autoloader only once
    require_once $autoload_path;
    self::$autoloader_loaded = true;

    return $this->is_twig_loaded();
  }

  /**
   * Create a Twig Environment instance compatible with available version.
   *
   * @param string $template_dir The template directory path.
   * @param array  $options      Twig environment options.
   * @return \Twig\Environment|\Twig_Environment|null Twig Environment instance or null on failure.
   *
   * @phpstan-ignore-next-line
   * @psalm-suppress UndefinedClass
   */
  public function create_environment($template_dir, $options = array())
  {
    if (!$this->ensure_twig_available()) {
      return null;
    }

    try {
      $loader = $this->create_loader($template_dir);
      if (!$loader) {
        return null;
      }

      // Create environment based on available version
      if (class_exists('\Twig\Environment')) {
        // Twig 2.x or 3.x
        return new \Twig\Environment($loader, $options);
      } elseif (class_exists('\Twig_Environment')) {
        // Twig 1.x (loaded by Timber or other themes/plugins)
        // @phpstan-ignore-next-line
        /** @psalm-suppress UndefinedClass */
        return new \Twig_Environment($loader, $options);
      }
    } catch (Exception $e) {
      error_log('DB Conn Plugin: Failed to create Twig environment: ' . $e->getMessage());
    }

    return null;
  }

  /**
   * Create a Twig Loader instance compatible with available version.
   *
   * @param string $template_dir The template directory path.
   * @return \Twig\Loader\FilesystemLoader|\Twig_Loader_Filesystem|null Twig Loader instance or null on failure.
   *
   * @phpstan-ignore-next-line
   * @psalm-suppress UndefinedClass
   */
  private function create_loader($template_dir)
  {
    try {
      if (class_exists('\Twig\Loader\FilesystemLoader')) {
        // Twig 2.x or 3.x
        return new \Twig\Loader\FilesystemLoader($template_dir);
      } elseif (class_exists('\Twig_Loader_Filesystem')) {
        // Twig 1.x (loaded by Timber or other themes/plugins)
        // @phpstan-ignore-next-line
        /** @psalm-suppress UndefinedClass */
        return new \Twig_Loader_Filesystem($template_dir);
      }
    } catch (Exception $e) {
      error_log('DB Conn Plugin: Failed to create Twig loader: ' . $e->getMessage());
    }

    return null;
  }

  /**
   * Add a Twig function compatible with available version.
   *
   * @param \Twig\Environment|\Twig_Environment|null $twig_env The Twig environment.
   * @param string $function_name The function name in Twig.
   * @param callable $callback The PHP callback.
   * @return bool Success status.
   *
   * @phpstan-ignore-next-line
   * @psalm-suppress UndefinedClass
   */
  public function add_function($twig_env, $function_name, $callback)
  {
    if (!$twig_env) {
      return false;
    }

    try {
      if (class_exists('\Twig\TwigFunction')) {
        // Twig 2.x or 3.x
        $twig_env->addFunction(new \Twig\TwigFunction($function_name, $callback));
        return true;
      } elseif (class_exists('\Twig_SimpleFunction')) {
        // Twig 1.x (loaded by Timber or other themes/plugins)
        // @phpstan-ignore-next-line
        /** @psalm-suppress UndefinedClass */
        $twig_env->addFunction(new \Twig_SimpleFunction($function_name, $callback));
        return true;
      }
    } catch (Exception $e) {
      error_log('DB Conn Plugin: Failed to add Twig function: ' . $e->getMessage());
    }

    return false;
  }

  /**
   * Add debug extension if available.
   *
   * @param \Twig\Environment|\Twig_Environment|null $twig_env The Twig environment.
   * @return bool Success status.
   *
   * @phpstan-ignore-next-line
   * @psalm-suppress UndefinedClass
   */
  public function add_debug_extension($twig_env)
  {
    if (!$twig_env || !WP_DEBUG) {
      return false;
    }

    try {
      if (class_exists('\Twig\Extension\DebugExtension')) {
        // Twig 2.x or 3.x
        $twig_env->addExtension(new \Twig\Extension\DebugExtension());
        return true;
      } elseif (class_exists('\Twig_Extension_Debug')) {
        // Twig 1.x (loaded by Timber or other themes/plugins)
        // @phpstan-ignore-next-line
        /** @psalm-suppress UndefinedClass */
        $twig_env->addExtension(new \Twig_Extension_Debug());
        return true;
      }
    } catch (Exception $e) {
      error_log('DB Conn Plugin: Failed to add debug extension: ' . $e->getMessage());
    }

    return false;
  }

  /**
   * Get Twig version information.
   *
   * @return string Version info or 'unknown'.
   *
   * @phpstan-ignore-next-line
   * @psalm-suppress UndefinedClass
   * @psalm-suppress UndefinedConstant
   */
  public function get_twig_version()
  {
    if (class_exists('\Twig\Environment')) {
      if (defined('\Twig\Environment::VERSION')) {
        return \Twig\Environment::VERSION;
      }
      return '2.x or 3.x';
    } elseif (class_exists('\Twig_Environment')) {
      // Twig 1.x (loaded by Timber or other themes/plugins)
      // @phpstan-ignore-next-line
      /** @psalm-suppress UndefinedClass */
      if (defined('\Twig_Environment::VERSION')) {
        /** @psalm-suppress UndefinedConstant */
        // @phpstan-ignore-next-line
        return \Twig_Environment::VERSION;
      }
      return '1.x';
    }
    return 'unknown';
  }
}
