# GitHub Pages Setup

This directory contains the GitHub Pages website for context-stash.

## Local Development

To preview the site locally:

1. Install a local web server (optional):
   ```bash
   npm install -g http-server
   ```

2. Serve the docs directory:
   ```bash
   http-server docs
   ```

3. Open `http://localhost:8080` in your browser

Or simply open `docs/index.html` directly in your browser.

## Deployment

The site is automatically deployed to GitHub Pages when you push to the `main` branch.

### Enable GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select:
   - Branch: `main`
   - Folder: `/docs`
4. Click "Save"

Your site will be live at: `https://yourusername.github.io/context-stash/`

## Customization

### Update Links

Before publishing, update these placeholder URLs in `docs/index.html`:

- `https://github.com/yourusername/context-stash` → Your actual GitHub URL
- `https://www.npmjs.com/package/context-stash` → Your npm package URL

### Customize Styling

Edit `docs/assets/style.css` to change colors, fonts, or layout.

### Add Content

The site is a single-page design. All sections are in `docs/index.html`.

## Structure

```
docs/
├── index.html           # Main landing page
├── assets/
│   └── style.css       # Styles with light/dark mode
└── overview.md         # Original overview (not published)
```

## Features

- 📱 Responsive design (mobile & desktop)
- 🌙 Automatic dark mode support
- 🎨 Inline SVG diagrams
- ⚡ Fast loading (no external dependencies)
- ♿ Accessible HTML
