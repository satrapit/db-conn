# Validation Utility Documentation

## Overview

Global form validation utility for the entire project. Provides comprehensive validation methods for user input fields with sanitization and Jalali date support.

## Location

`public/js/utils/validation.js`

## Usage

### Import

```javascript
import validator from "../utils/validation.js";
```

## Features

### 1. String Sanitization

Removes HTML tags and trims whitespace from user input.

```javascript
const clean = validator.sanitizeString('<script>alert("xss")</script>Hello  ');
// Result: "Hello"
```

### 2. Number Normalization

Converts Persian/Arabic numerals to English numerals.

```javascript
const normalized = validator.normalizeNumbers("۱۴۰۳/۰۱/۰۱");
// Result: "1403/01/01"

const arabic = validator.normalizeNumbers("٢٠٢٥/١٢/٣١");
// Result: "2025/12/31"
```

### 3. Field Validation Methods

#### Required Field

```javascript
validator.validateRequired(value, "first_name", "نام");
// Returns: boolean
// Sets error if empty
```

#### Email Validation

```javascript
// Required email
validator.validateEmail(value, "email", true, "ایمیل");

// Optional email
validator.validateEmail(value, "email", false, "ایمیل");
```

#### Name Validation

```javascript
validator.validateName(value, "first_name", "نام");
// Validates:
// - Required (not empty)
// - Minimum 2 characters
// - Maximum 50 characters
```

#### Jalali Date Validation

```javascript
validator.validateJalaliDate("۱۴۰۳/۰۱/۰۱", "birth_date", true, "تاریخ تولد");
// Accepts: Persian, Arabic, or English numerals
// Format: YYYY/MM/DD
// Validates:
// - Year range (1300-1500)
// - Month range (1-12)
// - Day range based on month
// - Leap years
```

### 4. Profile Form Validation

#### Validate Entire Form

```javascript
const formData = {
  first_name: "علی",
  last_name: "احمدی",
  email: "ali@example.com",
  birth_date: "۱۳۷۰/۰۵/۱۵",
};

const isValid = validator.validateProfileForm(formData);

if (!isValid) {
  const errors = validator.getErrors();
  console.log(errors);
  // {
  //   first_name: "نام الزامی است",
  //   email: "ایمیل نامعتبر است"
  // }
}
```

#### Sanitize Form Data

```javascript
const sanitized = validator.sanitizeProfileData(formData);
// Returns:
// {
//   first_name: "علی",
//   last_name: "احمدی",
//   email: "ali@example.com",
//   birth_date: "1991-08-06" // Converted to Gregorian
// }
```

### 5. Error Management

#### Get All Errors

```javascript
const errors = validator.getErrors();
// Returns: { fieldName: "error message", ... }
```

#### Get Single Field Error

```javascript
const error = validator.getError("email");
// Returns: "ایمیل نامعتبر است" or null
```

#### Check for Errors

```javascript
const hasErrors = validator.hasErrors();
// Returns: boolean
```

#### Reset Errors

```javascript
validator.reset();
```

### 6. UI Error Display

#### Display Errors in Form

```javascript
validator.displayErrors();
// Automatically finds input fields and shows error messages
// Adds 'input-error' class to inputs
// Creates error message elements
```

#### Clear UI Errors

```javascript
validator.clearErrors();
// Removes error messages and classes from UI
// Resets error state
```

## Field Specifications

### First Name (`first_name`)

- **Type**: String
- **Required**: Yes
- **Sanitization**: HTML tags removed, trimmed
- **Validation**:
  - Minimum 2 characters
  - Maximum 50 characters
- **Error Messages**: "نام الزامی است", "نام باید حداقل ۲ کاراکتر باشد"

### Last Name (`last_name`)

- **Type**: String
- **Required**: Yes
- **Sanitization**: HTML tags removed, trimmed
- **Validation**:
  - Minimum 2 characters
  - Maximum 50 characters
- **Error Messages**: "نام خانوادگی الزامی است", "نام خانوادگی باید حداقل ۲ کاراکتر باشد"

### Email (`email`)

- **Type**: Email
- **Required**: No (Optional)
- **Sanitization**: HTML tags removed, trimmed
- **Validation**: Valid email format
- **Error Messages**: "ایمیل نامعتبر است"

### Birth Date (`birth_date`)

- **Type**: Jalali Date
- **Format**: YYYY/MM/DD
- **Required**: Yes
- **Number Support**: Persian (۰-۹), Arabic (٠-٩), English (0-9)
- **Validation**:
  - Year: 1300-1500
  - Month: 1-12
  - Day: Based on month (31, 30, 29/30 for month 12)
  - Leap year calculation
- **Conversion**: Automatically converts to Gregorian (YYYY-MM-DD) for API
- **Error Messages**:
  - "تاریخ تولد الزامی است"
  - "تاریخ تولد باید به فرمت YYYY/MM/DD باشد"
  - "سال تاریخ تولد نامعتبر است (باید بین ۱۳۰۰ تا ۱۵۰۰ باشد)"

## Date Conversion

### Jalali to Gregorian

```javascript
const gregorian = validator.jalaliToGregorian("۱۴۰۳/۰۱/۰۱");
// Returns: "2024-03-20" (format: YYYY-MM-DD)
```

### Check Leap Year

```javascript
const isLeap = validator.isJalaliLeapYear(1403);
// Returns: boolean
```

## Complete Example

```javascript
import validator from "../utils/validation.js";

// Form submission handler
async function handleSubmit(e) {
  e.preventDefault();

  // Clear previous errors
  validator.clearErrors();

  // Get form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  // Validate
  const isValid = validator.validateProfileForm(data);

  if (!isValid) {
    // Show errors in UI
    validator.displayErrors();
    return;
  }

  // Sanitize and prepare for API
  const sanitizedData = validator.sanitizeProfileData(data);

  // Send to API
  await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sanitizedData),
  });
}
```

## CSS Classes

### Input Error State

```css
.input-error {
  @apply border-red-500 bg-red-50 dark:bg-red-900/20 !important;
}
```

### Error Message

```css
.field-error {
  @apply text-red-500 text-sm mt-1 px-4 animate-fade-in;
}
```

## API Integration

The validator automatically prepares data in the correct format for the API:

**Frontend Input (Jalali)**:

```javascript
{
  first_name: "علی",
  last_name: "احمدی",
  email: "ali@example.com",
  birth_date: "۱۳۷۰/۰۵/۱۵"
}
```

**API Output (Gregorian)**:

```javascript
{
  first_name: "علی",
  last_name: "احمدی",
  email: "ali@example.com",
  birth_date: "1991-08-06"
}
```

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ ES6+ required
- ✅ Supports Persian/Arabic numeral input
- ✅ RTL and LTR text direction

## Notes

- Mobile number is **not included** in validation (read-only in profile)
- All string fields are sanitized to prevent XSS attacks
- Date conversion handles leap years correctly
- Error messages are in Persian for better UX
