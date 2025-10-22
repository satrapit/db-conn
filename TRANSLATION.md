# Database Connector - Multilingual Support

## Overview

The Database Connector plugin is fully internationalized and supports multiple languages. Currently, it includes:

- **English (en_US)** - Base language
- **Persian/Farsi (fa_IR)** - Full translation with RTL support

## Available Translations

### English (en_US)

- Default language
- File: `languages/db-conn-en_US.po` and `languages/db-conn-en_US.mo`

### Persian (fa_IR)

- Full Persian translation
- RTL (Right-to-Left) support
- File: `languages/db-conn-fa_IR.po` and `languages/db-conn-fa_IR.mo`

## How to Add a New Translation

### Method 1: Using Poedit (Recommended)

1. Download and install [Poedit](https://poedit.net/)
2. Open `languages/db-conn.pot` in Poedit
3. Click "Create New Translation"
4. Select your language
5. Translate all strings
6. Save the file (Poedit will automatically create both .po and .mo files)
7. Name the files as `db-conn-{locale}.po` and `db-conn-{locale}.mo`
   - Example: `db-conn-es_ES.po` for Spanish (Spain)
   - Example: `db-conn-fr_FR.po` for French (France)

### Method 2: Manual Translation

1. Copy `languages/db-conn.pot` to `languages/db-conn-{locale}.po`
2. Edit the .po file header:
   ```
   "Language: {locale}\n"
   "Language-Team: {Language Name}\n"
   ```
3. Translate all `msgstr` entries
4. Compile the .po file to .mo using the provided script:
   ```bash
   php compile-translations.php
   ```

## Locale Codes

Common locale codes:

- `en_US` - English (United States)
- `fa_IR` - Persian/Farsi (Iran)
- `ar` - Arabic
- `es_ES` - Spanish (Spain)
- `fr_FR` - French (France)
- `de_DE` - German (Germany)
- `it_IT` - Italian (Italy)
- `pt_BR` - Portuguese (Brazil)
- `ru_RU` - Russian (Russia)
- `zh_CN` - Chinese (Simplified)
- `ja` - Japanese

## RTL (Right-to-Left) Support

The plugin includes built-in RTL support for languages like Persian, Arabic, and Hebrew.

### RTL Languages

RTL CSS is automatically loaded for RTL languages. The following files provide RTL support:

- `admin/css/db-conn-admin-rtl.css` - Admin area RTL styles
- `public/css/db-conn-public-rtl.css` - Public pages RTL styles

### Adding RTL Support for Your Language

If your language is RTL but not automatically detected:

1. WordPress should detect RTL languages automatically
2. The plugin checks `is_rtl()` function
3. RTL CSS is loaded automatically when needed

## Translation Files Structure

```
languages/
├── db-conn.pot              # Template file (do not edit)
├── db-conn-en_US.po         # English PO file
├── db-conn-en_US.mo         # English MO file (compiled)
├── db-conn-fa_IR.po         # Persian PO file
└── db-conn-fa_IR.mo         # Persian MO file (compiled)
```

## Translatable Strings

All user-facing strings in the plugin use WordPress translation functions:

- `__()` - Returns translated string
- `_e()` - Echoes translated string
- `esc_html__()` - Returns escaped translated string
- `esc_attr__()` - Returns attribute-escaped translated string

### In Twig Templates

Translation in Twig templates uses the `__()` function:

```twig
{{ __('Sign In', 'db-conn') }}
```

## Updating Translations

When the plugin is updated with new strings:

1. Update `languages/db-conn.pot` with new strings
2. Open your .po file in Poedit
3. Click "Catalog" → "Update from POT file"
4. Select the updated `db-conn.pot` file
5. Translate new strings
6. Save (Poedit will compile to .mo automatically)

Or use the compile script:

```bash
php compile-translations.php
```

## Testing Translations

1. Change WordPress language in Settings → General → Site Language
2. Clear browser cache
3. Visit plugin settings and public pages
4. Verify all strings are translated correctly

## Contributing Translations

If you'd like to contribute a translation:

1. Create translation files as described above
2. Test thoroughly
3. Submit via GitHub pull request or contact the plugin author

## Support

For translation issues or questions:

- Email: info@arsamnet.com
- Website: https://arsamnet.com

## Credits

- English: Majid Barkhordari
- Persian: Majid Barkhordari

---

Thank you for helping make Database Connector accessible to users worldwide!
