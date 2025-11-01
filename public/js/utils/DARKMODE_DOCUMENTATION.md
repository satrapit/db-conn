# Dark Mode Utility Documentation

The Dark Mode utility provides a comprehensive system for managing theme switching with localStorage persistence and system preference detection.

## Features

- 🌓 Automatic system preference detection
- 💾 Persistent theme storage (localStorage)
- 🔄 Three modes: Auto, Light, Dark
- 🎯 Simple toggle initialization for checkboxes
- 🔔 Observer pattern for theme change notifications
- ⚡ Zero flash on page load (initializes before DOM)

## Basic Usage

### Import the Utility

```javascript
import { initializeDarkModeToggle } from "../utils/darkMode.js";
```

### Initialize a Dark Mode Toggle Checkbox

The easiest way to add dark mode toggle functionality to any page:

```javascript
// In your page initialization function
export async function initYourPage() {
  // ... other initialization code ...

  // Initialize dark mode toggle with the checkbox ID
  initializeDarkModeToggle("darkModeToggle");
}
```

### HTML Structure

Your HTML should have a checkbox with the ID you pass to the function:

```html
<label class="toggle-switch">
  <input type="checkbox" id="darkModeToggle" />
  <span class="toggle-slider"></span>
</label>
```

## Advanced Usage

### Check Current Dark Mode State

```javascript
import { isDarkMode } from "../utils/darkMode.js";

if (isDarkMode()) {
  console.log("Dark mode is currently active");
}
```

### Get Current Theme Mode

```javascript
import { getThemeMode } from "../utils/darkMode.js";

const mode = getThemeMode(); // Returns: 'auto', 'light', or 'dark'
console.log(`Current theme mode: ${mode}`);
```

### Programmatically Set Theme Mode

```javascript
import { setThemeMode } from "../utils/darkMode.js";

// Set to dark mode
setThemeMode("dark");

// Set to light mode
setThemeMode("light");

// Set to auto (follow system preference)
setThemeMode("auto");
```

### Setup Multiple Toggle Buttons

For buttons with `data-theme-toggle` attribute:

```javascript
import { setupDarkModeToggles } from "../utils/darkMode.js";

// This will find all elements with [data-theme-toggle] and add click handlers
setupDarkModeToggles();
```

HTML example:

```html
<button data-theme-toggle>
  <i class="fi fi-rr-moon-stars"></i>
  Toggle Dark Mode
</button>
```

### Using the Dark Mode Manager Directly

For advanced use cases, you can import the manager instance:

```javascript
import darkModeManager from "../utils/darkMode.js";

// Add an observer to react to theme changes
darkModeManager.addObserver((isDark, currentMode) => {
  console.log(
    `Theme changed: ${isDark ? "Dark" : "Light"}, Mode: ${currentMode}`
  );

  // Update your UI accordingly
  if (isDark) {
    // Apply dark mode specific changes
  } else {
    // Apply light mode specific changes
  }
});

// Toggle the theme
darkModeManager.toggle();

// Check if dark mode is active
const isDark = darkModeManager.isDark();

// Get current mode
const mode = darkModeManager.getMode();

// Set mode
darkModeManager.setMode("auto");
```

## Complete Example

Here's a complete example of adding dark mode to a new page:

```javascript
// pages/settings.js
import { TokenManager } from "../modules/auth.js";
import { CONFIG } from "../utils/config.js";
import { logger } from "../utils/logger.js";
import { initializeDarkModeToggle } from "../utils/darkMode.js";

export async function initSettingsPage() {
  logger.info("Settings", "Initializing settings page");

  // Check authentication
  const token = TokenManager.get();
  if (!token) {
    window.location.replace(CONFIG.SIGNIN_URL);
    return;
  }

  // Initialize dark mode toggle
  initializeDarkModeToggle("settingsDarkModeToggle");

  // Other initialization code...
}
```

And the corresponding HTML:

```html
<div class="settings-page" data-page="settings">
  <h2>Settings</h2>

  <div class="setting-item">
    <span class="text-base font-medium">Dark Mode</span>
    <label class="toggle-switch">
      <input type="checkbox" id="settingsDarkModeToggle" />
      <span class="toggle-slider"></span>
    </label>
  </div>
</div>
```

## API Reference

### Functions

#### `initializeDarkModeToggle(elementId)`

Initialize a checkbox element as a dark mode toggle.

- **Parameters:**
  - `elementId` (string): The ID of the checkbox element
- **Returns:** boolean - True if successfully initialized, false if element not found
- **Example:**
  ```javascript
  initializeDarkModeToggle("darkModeToggle");
  ```

#### `setupDarkModeToggles()`

Setup all elements with `[data-theme-toggle]` attribute as toggle buttons.

- **Parameters:** None
- **Returns:** void
- **Example:**
  ```javascript
  setupDarkModeToggles();
  ```

#### `isDarkMode()`

Check if dark mode is currently active.

- **Parameters:** None
- **Returns:** boolean - True if dark mode is active
- **Example:**
  ```javascript
  if (isDarkMode()) {
    console.log("Dark mode is on");
  }
  ```

#### `getThemeMode()`

Get the current theme mode setting.

- **Parameters:** None
- **Returns:** string - 'auto', 'light', or 'dark'
- **Example:**
  ```javascript
  const mode = getThemeMode();
  ```

#### `setThemeMode(mode)`

Programmatically set the theme mode.

- **Parameters:**
  - `mode` (string): 'auto', 'light', or 'dark'
- **Returns:** void
- **Example:**
  ```javascript
  setThemeMode("dark");
  ```

### Dark Mode Manager Methods

#### `addObserver(callback)`

Add an observer function that will be called when theme changes.

- **Parameters:**
  - `callback` (function): Function to call on theme change. Receives `(isDark, currentMode)` parameters.
- **Example:**
  ```javascript
  darkModeManager.addObserver((isDark, mode) => {
    console.log(`Theme: ${isDark ? "Dark" : "Light"}, Mode: ${mode}`);
  });
  ```

#### `toggle()`

Toggle between light and dark mode.

- **Example:**
  ```javascript
  darkModeManager.toggle();
  ```

## Storage and Persistence

The dark mode preference is stored in:

- **localStorage key:** `db_conn_theme_mode`
- **Possible values:** `'auto'`, `'light'`, `'dark'`

The utility automatically:

- Loads saved preference on initialization
- Saves changes to localStorage
- Listens to system preference changes when in 'auto' mode
- Prevents flash of wrong theme by initializing before DOM load

## Browser Support

- Modern browsers with localStorage support
- `matchMedia` API for system preference detection
- Gracefully degrades if matchMedia is not available

## Notes

- The dark mode manager is a singleton and initializes automatically
- Theme is applied by adding/removing the `dark` class on `<html>` element
- Uses Tailwind CSS dark mode convention
- System preference is only used when mode is set to 'auto'
- All observers are called whenever the theme changes from any source
