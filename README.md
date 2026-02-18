<p align="center">
  <img src="public/esummit_logo.png" alt="E-Summit 2026 Logo" width="200" />
</p>

<h1 align="center">E-Summit 2026</h1>

<p align="center">
  <strong>The official website for E-Summit 2026, organized by the Entrepreneurship Development Cell (EDC) of BIT Mesra.</strong>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" /></a>
</p>

---

## 📖 About

E-Summit is the flagship entrepreneurship event of **BIT Mesra**, bringing together aspiring entrepreneurs, industry leaders, and innovators. This website serves as the central hub for event information, registrations, team management, and live updates.

## ✨ Features

- **Immersive Landing Page** — Hero section with 3D effects (Three.js / OGL), animated gradients, and smooth scroll (Lenis)
- **Event Management** — Browse events, view detailed schedules, and manage team registrations
- **Authentication** — Secure sign-up/login powered by Supabase Auth
- **User Profiles** — Personalized profiles with onboarding flow
- **Speaker Showcase** — Dedicated pages for current and past speakers
- **Admin Dashboard** — Full administrative panel for event, team, and content management
- **MDX Content** — Rich content editing with live preview using `next-mdx-remote`
- **Analytics** — Integrated PostHog for product analytics and event tracking
- **Progressive Web App** — Installable PWA with offline-ready manifest and responsive screenshots
- **Dark Mode** — Theme toggling via `next-themes` with a dark-first design
- **Contact & FAQ** — Contact form and interactive FAQ section

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, React Compiler) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com), CSS Modules |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/), [Lenis](https://lenis.darkroom.engineering/) (smooth scroll) |
| **3D / WebGL** | [Three.js](https://threejs.org), [OGL](https://ogl.dev) |
| **Backend / Auth** | [Supabase](https://supabase.com) (Auth, Database, SSR) |
| **Data Fetching** | [TanStack React Query](https://tanstack.com/query), [Axios](https://axios-http.com) |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) validation |
| **Media** | [Cloudinary](https://cloudinary.com) (via `next-cloudinary`) |
| **Analytics** | [PostHog](https://posthog.com) |
| **Content** | [MDX](https://mdxjs.com) (via `next-mdx-remote`) |

## 📁 Project Structure

```
e-summit26/
├── app/                    # Next.js App Router pages & API routes
│   ├── admin/              # Admin dashboard
│   ├── api/                # REST API endpoints (events, teams, users, etc.)
│   ├── auth/               # Authentication pages
│   ├── events/             # Events listing & details
│   ├── speakers/           # Speaker pages
│   ├── teams/              # Team pages
│   ├── venue/              # Venue information
│   ├── contact/            # Contact page
│   ├── profile/            # User profile
│   └── protected/          # Authenticated routes
├── components/             # Reusable React components
│   ├── ui/                 # shadcn/ui primitives
│   ├── chat/               # Chat components
│   └── providers/          # Context providers (theme, etc.)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions & configurations
├── stores/                 # State management
├── types/                  # TypeScript type definitions
├── config/                 # App configuration
├── navigation/             # Navigation config
├── server/                 # Server-side utilities
└── public/                 # Static assets (images, fonts, icons)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/EDC-BITM/e-summit26.git
   cd e-summit26
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the project root. Refer to the required Supabase, PostHog, and Cloudinary keys:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
   NEXT_PUBLIC_POSTHOG_HOST=your_posthog_host
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

> Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

## 📄 License

This project is maintained by the **Entrepreneurship Development Cell (EDC), BIT Mesra**.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/EDC-BITM">EDC BIT Mesra</a>
</p>
