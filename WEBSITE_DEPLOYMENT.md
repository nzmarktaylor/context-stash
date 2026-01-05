# Deploying the GitHub Pages Website

This guide will help you deploy the context-stash website to GitHub Pages.

## What You Get

A modern, responsive landing page with:
- ✅ Inline SVG diagrams and illustrations
- ✅ Automatic dark mode support
- ✅ Mobile-responsive design
- ✅ No external dependencies (fast loading)
- ✅ Clean, professional design

## Preview Locally

You can preview the site by opening `docs/index.html` directly in your browser:

### Windows
```bash
start docs/index.html
```

### macOS
```bash
open docs/index.html
```

### Linux
```bash
xdg-open docs/index.html
```

Or use a local web server:
```bash
# Option 1: Python
python -m http.server 8000 --directory docs

# Option 2: Node.js
npx http-server docs

# Option 3: VS Code
# Right-click index.html → "Open with Live Server"
```

Then visit `http://localhost:8000`

## Deploy to GitHub Pages

### Step 1: Update URLs

Before deploying, replace placeholder URLs in these files:

**In `docs/index.html`:**
- Find: `yourusername`
- Replace with: your GitHub username

**In `README.md`:**
- Update the same URLs

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Add GitHub Pages website"
git push origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top navigation)
3. Click **Pages** (left sidebar)
4. Under **Source**:
   - Branch: `main`
   - Folder: `/docs`
5. Click **Save**

### Step 4: Wait for Deployment

GitHub Actions will automatically deploy your site. Check the **Actions** tab to monitor progress.

Your site will be live at:
```
https://yourusername.github.io/context-stash/
```

## Customization

### Change Colors

Edit `docs/assets/style.css`:

```css
:root {
  --primary: #2563eb;        /* Main brand color */
  --secondary: #8b5cf6;      /* Secondary color */
  --accent: #06b6d4;         /* Accent color */
}
```

### Update Content

All content is in `docs/index.html`. The file is well-commented and organized into sections:

- Hero section
- Problem & Solution
- How It Works diagram
- Key Features
- Visual Comparison
- Code Examples
- Use Cases
- Footer

### Add More Diagrams

The site uses inline SVG for diagrams. You can:

1. **Add new SVG sections** in the HTML
2. **Use tools** like Excalidraw or Figma, export as SVG
3. **Generate programmatically** with D3.js or similar

## Using a Custom Domain

1. Add a file `docs/CNAME` with your domain:
   ```
   context-stash.dev
   ```

2. Configure your DNS provider:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `yourusername.github.io`

3. In GitHub Settings → Pages → Custom domain:
   - Enter your domain
   - Check "Enforce HTTPS"

## Troubleshooting

### Site Not Loading

- Check Actions tab for deployment errors
- Ensure `docs/` folder is pushed to `main` branch
- Verify GitHub Pages source is set to `main` → `/docs`

### Styles Not Working

- Clear browser cache (Ctrl/Cmd + Shift + R)
- Check that `assets/style.css` exists
- Verify file paths in `index.html`

### Dark Mode Not Working

Dark mode uses `prefers-color-scheme` media query. It:
- Automatically detects system preference
- No manual toggle needed
- Works in modern browsers

## Analytics (Optional)

Add Google Analytics or Plausible:

**Google Analytics:**
```html
<!-- Add before </head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Plausible:**
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## Maintenance

### Update Content

1. Edit `docs/index.html`
2. Commit and push
3. GitHub Actions auto-deploys

### Monitor Performance

Use PageSpeed Insights:
```
https://pagespeed.web.dev/analysis?url=https://yourusername.github.io/context-stash/
```

## Need Help?

- Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
- Open an issue in the repository
- The site uses vanilla HTML/CSS/SVG (no frameworks)

## What's Included

```
docs/
├── index.html              # Main landing page
├── assets/
│   └── style.css          # All styles (light + dark mode)
├── README.md              # Setup instructions
└── overview.md            # Original design notes

.github/
└── workflows/
    └── pages.yml          # Auto-deploy workflow
```

The site is intentionally simple:
- No build process required
- No JavaScript frameworks
- No external dependencies
- Fast, accessible, and maintainable

Enjoy your new website! 🚀
