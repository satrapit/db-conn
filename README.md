# Database Connector

A WordPress plugin for creating custom sign-in and panel pages with Twig templating and Tailwind CSS.

## Features

- Custom URL routing for sign-in and panel pages
- Twig template engine with layout inheritance
- Tailwind CSS for responsive design
- Multilingual support (English, Persian with RTL)
- Compatible with Timber and other Twig-based themes

## Quick Start

### Installation

1. Upload to `wp-content/plugins/db-conn/`

2. Install dependencies:

   ```bash
   composer install
   npm install
   npm run build
   ```

3. Activate the plugin in WordPress admin

4. Configure slugs at **Settings → Database Connector**

5. Flush permalinks at **Settings → Permalinks** (click Save)

### Access Pages

- Sign In: `https://yoursite.com/signin`
- Panel: `https://yoursite.com/panel`

## Development

### Build Commands

```bash
npm run build        # Build CSS and JS
npm run build:css    # Build CSS only
npm run build:js     # Build JS only
npm run dev          # Build and watch for changes
```

### File Structure

```
db-conn/
├── views/
│   ├── layouts/          # Base layouts
│   ├── components/       # Reusable components
│   └── pages/            # Page templates
├── public/
│   ├── css/
│   │   ├── main.css      # Tailwind source
│   │   └── style.css     # Generated (gitignored)
│   └── js/
│       ├── main.js       # JS source
│       └── script.js     # Generated (gitignored)
└── tailwind.config.js
```

## Configuration

### Settings Page

**Settings → Database Connector**

- **Slug Tab:** Configure page URLs (signin, panel)

### Slug Guidelines

✅ Use: `signin`, `member-login`, `user-panel`, `dashboard`
❌ Avoid: `login`, `admin`, `wp-admin` (reserved)

## Template Customization

### Layouts

- `layouts/layout.twig` - Main layout with header/footer
- `layouts/login-layout.twig` - Auth pages (centered card)

### Creating Custom Pages

```twig
{% extends "layouts/layout.twig" %}

{% block content %}
  <div class="card">
    <h2>{{ __('My Page', 'db-conn') }}</h2>
  </div>
{% endblock %}
```

### Available Blocks

**layout.twig:**

- `title` - Page title
- `styles` - Custom CSS
- `content` - Main content
- `scripts` - Custom JavaScript

**login-layout.twig:**

- `title` - Page title
- `content` - Form content
- `footer_links` - Links below card

### Template Variables

```twig
{{ page_title }}      {# Page title #}
{{ site_name }}       {# Site name #}
{{ plugin_url }}      {# Plugin URL #}
{{ lang }}            {# Language code #}
{{ direction }}       {# ltr/rtl #}
{{ current_user }}    {# User object or null #}
```

## Troubleshooting

### 404 Errors

Go to **Settings → Permalinks** → Save Changes

### Twig Not Loading

1. Run `composer install`
2. Check `/vendor` and `/views` exist
3. Enable `WP_DEBUG` in `wp-config.php`

### CSS Not Loading

1. Run `npm run build:css`
2. Check `/public/css/style.css` exists
3. Clear browser cache

## Requirements

- WordPress 5.0+
- PHP 7.4+
- Node.js (for development)

## License

GPL v2 or later

**Author:** Majid Barkhordari
**Website:** [arsamnet.com](https://arsamnet.com)
**Version:** 1.0.0
