# React + TypeScript + Vite

## Production SEO domain

The confirmed production domain is `https://www.boldandbrightspace.in/`. Set `VITE_SITE_URL` in Vercel Production to this HTTPS root URL. A configured production build adds matching canonical and `og:url` tags, absolute social-preview image URLs, the Organization schema's website and full logo URLs, a one-URL `dist/sitemap.xml`, and its absolute URL in `dist/robots.txt`. If the value is unset, canonical, `og:url`, social-image URLs, Organization website/logo properties, and the generated sitemap are omitted; the site remains crawlable. Invalid URLs fail the build after Vite clears the output directory, preventing stale generated SEO files from being mistaken for a successful build.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
