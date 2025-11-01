# Modal Component Documentation

The modal component provides a flexible, reusable modal dialog system that can display content from multiple sources.

## Features

- ✅ Load content inline (HTML string or DOM element)
- ✅ Load content from external URL/page
- ✅ Automatic loading state
- ✅ Error handling
- ✅ Dark mode support
- ✅ Mobile responsive (slide from bottom on mobile, centered on desktop)
- ✅ Close via X button, backdrop click, or ESC key
- ✅ Prevent body scroll when open
- ✅ Callbacks for onClose and onLoad events

## Usage

### 1. Import the Modal

```javascript
import Modal from "./utils/modal.js";
```

### 2. Open Modal with Inline Content

```javascript
Modal.open({
  title: "Modal Title",
  content: "<p>Your HTML content here</p>",
});
```

### 3. Open Modal with DOM Element

```javascript
const element = document.createElement("div");
element.innerHTML = "<p>Dynamic content</p>";

Modal.open({
  title: "Modal Title",
  content: element,
});
```

### 4. Load Content from URL

```javascript
Modal.open({
  title: "Loading from URL",
  url: "/path/to/content",
  onLoad: (html) => {
    console.log("Content loaded");
    // Manipulate loaded content here
  },
});
```

## API Reference

### `Modal.open(options)`

Opens the modal with the specified options.

**Parameters:**

| Option    | Type               | Required | Description                     |
| --------- | ------------------ | -------- | ------------------------------- |
| `title`   | String             | No       | Modal title (default: 'Modal')  |
| `content` | String/HTMLElement | No\*     | Content to display              |
| `url`     | String             | No\*     | URL to fetch content from       |
| `onClose` | Function           | No       | Callback when modal closes      |
| `onLoad`  | Function           | No       | Callback when URL content loads |

\*Either `content` or `url` should be provided.

**Example:**

```javascript
Modal.open({
  title: "Edit Profile",
  content: "<form>...</form>",
  onClose: () => {
    console.log("Modal closed");
  },
});
```

### `Modal.close()`

Closes the modal.

```javascript
Modal.close();
```

### `Modal.isOpen()`

Checks if modal is currently open.

```javascript
if (Modal.isOpen()) {
  console.log("Modal is open");
}
```

## Examples

### Load WordPress Page Content

```javascript
Modal.open({
  title: "Terms of Service",
  url: "/?page_slug=terms&modal=1",
});
```

### Load API Data

```javascript
Modal.open({
  title: "User Profile",
  url: "/wp-json/myapi/v1/profile",
  onLoad: (html) => {
    // Add event listeners to loaded content
    const saveBtn = document.querySelector("#modal-body #save-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", handleSave);
    }
  },
});
```

### Form Submission

```javascript
Modal.open({
  title: "Contact Us",
  url: "/contact-form",
  onLoad: () => {
    const form = document.querySelector("#modal-body form");
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        Modal.close();
        alert("Submitted!");
      }
    });
  },
});
```

## Styling

The modal uses Tailwind CSS classes and is fully responsive:

- **Mobile**: Slides up from bottom, rounded top corners
- **Desktop**: Centered, fully rounded corners, max-width 600px
- **Dark Mode**: Automatically adapts to dark theme

## Notes

- Modal automatically shows a loading spinner when fetching from URL
- Failed URL requests show an error message
- Modal prevents body scrolling when open
- Only one modal can be open at a time
- The modal is globally available on all pages (included in `layout.twig`)
