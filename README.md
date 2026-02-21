# CV - Alexandre Hebert

A modern AI-powered resume chatbot built with Astro, TypeScript, React, and Groq (free AI).

## Features

- **AI Chat Interface**: Ask questions about Alexandre's career in English or French
- **Multilingual**: English and French versions of traditional CV
- **Free AI**: Uses Groq's free tier (Llama 3.3 70B model)
- **Hybrid Rendering**: Static CV pages + serverless chat API
- **Styled with Tailwind**: Modern, responsive design
- **Print-friendly CV**: Traditional CV optimized for PDF export
- **Vercel-ready**: Deploy to Vercel with one click

## Tech Stack

- **Astro (Hybrid)** - Static + serverless framework
- **TypeScript** - Type-safe development
- **React** - Chat UI components
- **Vercel AI SDK** - Streaming chat responses
- **Groq** - Free, fast AI inference (Llama 3.3 70B)
- **Tailwind CSS** - Utility-first CSS framework
- **date-fns** - Date manipulation and formatting
- **showdown** - Markdown to HTML converter

## Project Structure

```
src/
├── components/
│   ├── CvPage.astro        # Traditional CV template
│   └── ChatInterface.tsx   # AI chat interface (React)
├── lib/
│   └── cv.ts               # Locale helpers + markdown/date utilities
├── pages/
│   ├── index.astro         # AI chat homepage
│   ├── api/
│   │   └── chat.ts         # Chat API endpoint (serverless)
│   └── cv/
│       ├── fr.astro        # French CV
│       └── [locale].astro  # Locale CV pages (/cv/en, /cv/fr)
├── index.css               # Tailwind CSS input
└── data/
    ├── en.yaml             # English resume data
    └── fr.yaml             # French resume data
```

## Setup

1. **Clone and install dependencies**:
   ```bash
   pnpm install
   ```

2. **Get a free Groq API key**:
   - Visit https://console.groq.com
   - Sign up (no credit card required)
   - Create an API key

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=gsk_your_actual_key_here
   ```

## Development

```bash
# Start dev server with HMR
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type-check Astro
pnpm check
```

Visit:
- `http://localhost:4321` - AI chat interface
- `http://localhost:4321/cv/en` - Traditional CV (English)
- `http://localhost:4321/cv/fr` - Traditional CV (French)

## Deployment to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set environment variable in Vercel dashboard**:
   - Go to your project settings
   - Add `GROQ_API_KEY` with your API key
   - Redeploy

Or use the Vercel GitHub integration for automatic deployments.

## AI Personality

The AI chatbot is designed to:
- **Only discuss Alexandre's career** - redirects off-topic questions back to his resume
- **Be enthusiastic and supportive** - acts as Alexandre's biggest fan
- **Auto-detect language** - responds in English or French based on the question
- **Handle criticism with humor** - stays humble but defensive when asked to criticize Alexandre
- **Reference specific experiences** - has access to full resume data in context

## Editing Resume Data

1. Update `src/data/en.yaml` and `src/data/fr.yaml` with your information
2. The AI system prompt in `src/pages/api/chat.ts` includes resume data
3. Rebuild the site to update both CV pages and AI knowledge

## License

ISC
