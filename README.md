# CV - Alexandre Hebert

A modern, multi-language resume site built with Astro (Vite), TypeScript, and Tailwind CSS.

## Features

- **Multilingual**: English and French versions
- **Static Generation**: Astro builds fast, static HTML
- **Styled with Tailwind**: Modern, responsive design
- **Print-friendly**: Optimized for PDF export
- **i18n Support**: Date formatting per locale using date-fns
- **Markdown Support**: Render markdown content in resume data

## Tech Stack

- **Astro** - Static site framework powered by Vite
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **date-fns** - Date manipulation and formatting
- **showdown** - Markdown to HTML converter

## Project Structure

```
src/
├── components/
│   └── CvPage.astro  # Main CV page template
├── lib/
│   └── cv.ts         # Locale helpers + markdown/date utilities
├── pages/
│   ├── index.astro   # Default locale (fr)
│   └── [locale].astro# Locale pages (/en, /fr)
├── index.css         # Tailwind CSS input
└── data/
    ├── en.yaml       # English resume data
    └── fr.yaml       # French resume data
```

## Scripts

```bash
# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type-check Astro
npm run check
```

## Development

1. Edit your resume data in `src/data/en.yaml` and `src/data/fr.yaml`
2. Modify the template in `src/components/CvPage.astro`
3. Update styles in `src/index.css`
4. Run `npm run dev` for live preview
5. Run `npm run build` for production output

## Output

- `dist/index.html` - Default locale (fr)
- `dist/en/index.html` - English version
- `dist/fr/index.html` - French version

## License

ISC
