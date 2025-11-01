# Toast Utility Documentation

## Overview

Unified toast notification system using Toastify.js. Provides a simple and consistent way to show notifications across the entire application.

## Location

`public/js/utils/toast.js`

## Installation

Already installed as part of the project dependencies:

```json
"toastify-js": "^1.12.0"
```

CSS is automatically imported in `public/css/main.css`.

## Usage

### Import

```javascript
import toast from "../utils/toast.js";
```

Or import specific methods:

```javascript
import { success, error, info, warning } from "../utils/toast.js";
```

## Methods

### 1. Success Toast

```javascript
toast.success("عملیات با موفقیت انجام شد");
```

- **Color**: Green gradient (#00b09b → #96c93d)
- **Use for**: Successful operations, confirmations

### 2. Error Toast

```javascript
toast.error("خطا در انجام عملیات");
```

- **Color**: Red/Orange gradient (#ff5f6d → #ffc371)
- **Use for**: Errors, failures, validation errors

### 3. Info Toast

```javascript
toast.info("اطلاعات بروز شد");
```

- **Color**: Blue gradient (#3b82f6 → #60a5fa)
- **Use for**: Information messages, neutral notifications

### 4. Warning Toast

```javascript
toast.warning("لطفا فرم را کامل کنید");
```

- **Color**: Yellow/Orange gradient (#f59e0b → #fbbf24)
- **Use for**: Warnings, important notices

### 5. Custom Toast

```javascript
toast.show("پیام سفارشی", "success", {
  duration: 5000, // 5 seconds
  gravity: "top",
  position: "right",
});
```

## Default Configuration

All toasts use these default settings:

```javascript
{
    duration: 3000,           // 3 seconds
    close: true,              // Show close button
    gravity: "bottom",        // Position: top or bottom
    position: "center",       // Position: left, center, right
    stopOnFocus: true,        // Pause when mouse over
}
```

## Examples

### Success Notification

```javascript
// Profile update
toast.success("پروفایل با موفقیت به‌روزرسانی شد");

// Login success
toast.success("ورود موفقیت‌آمیز بود");
```

### Error Notification

```javascript
// API error
toast.error("خطا در ارتباط با سرور");

// Validation error
toast.error("ایمیل نامعتبر است");

// Permission error
toast.error("شما دسترسی لازم را ندارید");
```

### Info Notification

```javascript
// Loading complete
toast.info("اطلاعات بارگذاری شد");

// Update available
toast.info("نسخه جدید در دسترس است");
```

### Warning Notification

```javascript
// Incomplete data
toast.warning("لطفا تمام فیلدها را پر کنید");

// Session expiring
toast.warning("جلسه شما به زودی منقضی می‌شود");
```

### Custom Duration

```javascript
// Show for 5 seconds
toast.success("عملیات طولانی با موفقیت انجام شد", {
  duration: 5000,
});

// Sticky toast (won't auto-close)
toast.error("خطای مهم - لطفا بخوانید", {
  duration: -1, // Won't auto-close
});
```

### Custom Position

```javascript
// Top right corner
toast.info("پیام جدید دریافت شد", {
  gravity: "top",
  position: "right",
});

// Bottom left corner
toast.warning("هشدار", {
  gravity: "bottom",
  position: "left",
});
```

## Color Scheme

| Type    | Gradient Colors | Hex Values        |
| ------- | --------------- | ----------------- |
| Success | Green           | #00b09b → #96c93d |
| Error   | Red/Orange      | #ff5f6d → #ffc371 |
| Info    | Blue            | #3b82f6 → #60a5fa |
| Warning | Yellow/Orange   | #f59e0b → #fbbf24 |

## Best Practices

### ✅ Do

- Use appropriate toast types for different scenarios
- Keep messages short and clear
- Use Persian text for user-facing messages
- Show one toast at a time for important actions
- Use success for confirmations
- Use error for failures

### ❌ Don't

- Don't show too many toasts at once
- Don't use toasts for critical errors (use modals instead)
- Don't make messages too long
- Don't override the default duration unless necessary

## Integration Examples

### With API Calls

```javascript
async function updateProfile(data) {
  try {
    const response = await fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      toast.success(result.message || "پروفایل به‌روزرسانی شد");
    } else {
      toast.error(result.message || "خطا در به‌روزرسانی");
    }
  } catch (error) {
    toast.error("خطا در ارتباط با سرور");
  }
}
```

### With Form Validation

```javascript
if (!validator.validateProfileForm(formData)) {
  toast.error("لطفا فرم را به درستی پر کنید");
  return;
}

toast.success("فرم معتبر است");
```

### With Authentication

```javascript
if (!token) {
  toast.warning("لطفا وارد شوید");
  window.location.href = "/signin";
  return;
}
```

## Current Usage

The toast utility is currently used in:

- ✅ **Profile Page** (`profile.js`)
  - Profile update success/error
  - Profile fetch errors
  - Validation errors

## Future Integration

Consider adding to:

- Signin page (replace custom alert system)
- Services page
- Help page
- Any new pages or features

## Technical Details

- **Library**: Toastify.js v1.12.0
- **Bundle Size**: ~5.7kb (minified)
- **Dependencies**: None (standalone)
- **Browser Support**: All modern browsers
- **RTL Support**: ✅ Yes (works with Persian text)

## Customization

To change default colors or settings, edit `public/js/utils/toast.js`:

```javascript
const TOAST_TYPES = {
  success: {
    background: "your-custom-gradient",
  },
  // ... other types
};

const DEFAULT_CONFIG = {
  duration: 4000, // Change default duration
  // ... other settings
};
```

## Troubleshooting

### Toast not showing?

1. Make sure you imported the toast utility
2. Check that Toastify CSS is loaded
3. Verify the build completed successfully

### Text not visible?

- Check toast position (might be off-screen)
- Verify background color contrast

### Toast position wrong?

- Check RTL/LTR settings
- Verify gravity and position parameters
