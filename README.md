# Brian Does Everything — Website

Bold, dark, Gary Vee-inspired personal site built with Astro + Tailwind CSS.

## Setup

```bash
npm install
npm run dev      # Dev server at localhost:4321
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

## Deploy to Netlify

Connect the repo to Netlify. The `netlify.toml` handles build config automatically.

## Blog

Add `.mdx` files to `src/content/blog/` with frontmatter:

```yaml
---
title: "Post Title"
description: "Short description"
pubDate: 2025-02-10
image: /images/optional-image.jpg
tags: ["tag1", "tag2"]
---
```

## Stack

- [Astro](https://astro.build) — Static site generator
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS
- [MDX](https://mdxjs.com/) — Blog content
- Deployed on [Netlify](https://netlify.com)
