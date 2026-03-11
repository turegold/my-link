# GEMINI.md - Project Context

This file provides context for Gemini CLI interactions within the `my-profile` repository.

## Project Overview

*   **Project Name:** `my-profile`
*   **Type:** Next.js Web Application
*   **Purpose:** A personal profile/portfolio project bootstrapped with `create-next-app`.
*   **Key Technologies:**
    *   **Framework:** Next.js 16.1.6 (App Router)
    *   **Library:** React 19.2.3
    *   **Language:** TypeScript
    *   **Styling:** Tailwind CSS v4 (using `@tailwindcss/postcss`)
    *   **Linting:** ESLint 9+

## Architecture

*   **App Router:** The project uses the Next.js App Router.
    *   `app/`: Contains the core routing and layout logic.
    *   `app/layout.tsx`: Root layout for the application, including font loading and global styles.
    *   `app/page.tsx`: The main entry point (Home page).
    *   `app/globals.css`: Global CSS and Tailwind CSS v4 configuration.
*   **Public Assets:** Located in the `public/` directory (SVGs for Next.js, Vercel, etc.).
*   **Configuration:**
    *   `next.config.ts`: Next.js specific configuration.
    *   `tsconfig.json`: TypeScript configuration with path aliases (e.g., `@/*` mapping to `./*`).
    *   `postcss.config.mjs`: PostCSS configuration for Tailwind CSS.

## Building and Running

The following scripts are defined in `package.json`:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the development server at `http://localhost:3000` |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint for code quality and style checks |

## Development Conventions

*   **Styling:** Prefer Tailwind CSS v4 utility classes. Tailwind is integrated via `@import "tailwindcss"` in `app/globals.css`.
*   **TypeScript:** Use strict typing. The project is configured with `"strict": true` in `tsconfig.json`.
*   **Fonts:** Uses `next/font/google` for Geist and Geist Mono.
*   **Components:** Organize components within the `app/` directory or create a separate `components/` directory if needed (currently using `app/` for the main page).
*   **Icons/Images:** Use the `next/image` component for optimized image loading.
