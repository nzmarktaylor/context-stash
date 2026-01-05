# Publishing to npm

This guide helps you publish context-stash to npm.

## Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com)
2. **npm CLI Login**: Run `npm login` in your terminal
3. **Package Name**: Verify `context-stash` is available on npm

## Pre-Publication Checklist

- [ ] Update version in `package.json` if needed
- [ ] Update `CHANGELOG.md` with changes
- [ ] Update repository URLs in `package.json`
- [ ] Update author information in `package.json`
- [ ] Run tests: `npm run build` (ensure no errors)
- [ ] Review `.npmignore` to exclude unnecessary files
- [ ] Review `README.md` for accuracy

## Publishing Steps

### 1. Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 2. Test Local Installation

Test the package locally before publishing:

```bash
npm pack
```

This creates a `.tgz` file. Install it globally:

```bash
npm install -g context-stash-1.0.0.tgz
```

Test the commands:

```bash
context-stash --help
context-stash --init
```

### 3. Publish to npm

For first-time publication:

```bash
npm publish
```

For scoped packages (if using @yourname/context-stash):

```bash
npm publish --access public
```

### 4. Verify Publication

Check that your package appears on npm:

```
https://www.npmjs.com/package/context-stash
```

Test installation:

```bash
npm install -g context-stash
context-stash --help
```

## Version Updates

When publishing updates, follow semantic versioning:

### Patch Release (1.0.0 → 1.0.1)

Bug fixes only:

```bash
npm version patch
npm publish
```

### Minor Release (1.0.0 → 1.1.0)

New features (backward compatible):

```bash
npm version minor
npm publish
```

### Major Release (1.0.0 → 2.0.0)

Breaking changes:

```bash
npm version major
npm publish
```

## Common Issues

### "You do not have permission to publish"

The package name is taken. Choose a different name or scope it:

```json
{
  "name": "@yourname/context-stash"
}
```

### "npm ERR! 403 Forbidden"

Make sure you're logged in:

```bash
npm login
```

### "Missing required files"

Check `package.json` `files` field includes `dist`:

```json
{
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

## Beta/Alpha Releases

For testing before official release:

```bash
npm version prerelease --preid=beta
npm publish --tag beta
```

Users can install with:

```bash
npm install -g context-stash@beta
```

## Unpublishing (Use with Caution)

If you need to unpublish within 72 hours:

```bash
npm unpublish context-stash@1.0.0
```

**Warning**: Unpublishing is discouraged. Use deprecation instead:

```bash
npm deprecate context-stash@1.0.0 "This version has critical bugs. Please upgrade to 1.0.1"
```

## Automated Publishing with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add your npm token to GitHub repository secrets as `NPM_TOKEN`.

## Maintenance

After publication:

1. Tag the release in Git:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. Create a GitHub release with the changelog

3. Monitor npm statistics:
   ```
   https://npm-stat.com/charts.html?package=context-stash
   ```

4. Respond to issues on GitHub

## Support

- npm documentation: https://docs.npmjs.com/
- npm support: https://www.npmjs.com/support
