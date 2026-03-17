# Blogr landing page

Rebuilt as a clean, accessible, pixel-faithful landing page with a modern (but simple) toolchain.

## Tech

- Vite (dev server + build)
- ESLint + Prettier (formatting and basic JS linting)
- Plain HTML/CSS/JS (no framework)

## Project structure

- `index.html`: App shell and page markup
- `src/main.js`: Menu + dropdown behavior (accessible)
- `src/styles/index.css`: Styling (variables, responsive layout)
- `public/images/*`: Static assets (icons/illustrations/patterns)

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Quality

Format:

```bash
npm run format
```

Lint:

```bash
npm run lint
```

## Deploy notes

This is a static site after build.

- **Vercel/Netlify**: set build command to `npm run build` and publish directory to `dist`
- **GitHub Pages**: deploy the `dist` folder (for example via an Actions workflow)

