# OpenPrep

OpenPrep is a free and open-source platform designed to help students prepare for company placements. It provides curated, community-contributed resources for top companies, including verified Google Drive links for study materials, interview experiences, and preparation guides. The platform is simple, accessible, and always growing through student contributions.

## Features

- **Browse Companies**: Explore a grid of top companies with dedicated resource pages.
- **Company Details**: View detailed preparation resources for specific companies (e.g., interview questions, aptitude tests).
- **Contribute Resources**: Submit your own materials via a user-friendly form (simulated submission for now).
- **Responsive Design**: Works seamlessly on desktop and mobile with light/dark mode support.
- **Search & Filter**: Easily find companies and resources.
- **Modern UI**: Built with accessible components for a smooth user experience.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with Tailwind Merge and Class Variance Authority (CVA)
- **UI Components**: Radix UI primitives, Lucide React icons, Framer Motion for animations
- **Forms & Validation**: React Hook Form with Zod
- **State Management**: Next Themes for theme switching
- **Data Visualization**: Recharts (if needed for future features)
- **Other**: Sonner for toasts, Embla Carousel, Date-fns, and more

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm (package manager; install via `npm install -g pnpm`)

### Installation

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd OpenPrep
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Run the development server:
   ```
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will be available at `http://localhost:3000`. Use `pnpm build` for production builds and `pnpm start` to run the built version.

### Project Structure

- `app/`: Next.js App Router pages and layouts (e.g., `page.tsx` for home, `contribute/page.tsx`).
- `components/`: Reusable UI components (e.g., `navbar.tsx`, `footer.tsx`, `company-grid.tsx`).
- `lib/`: Utility functions (e.g., `companies.ts` for data fetching).
- `public/`: Static assets (e.g., company logos).
- `hooks/`: Custom React hooks (e.g., `use-toast.ts`).
- `styles/`: Global styles (e.g., `globals.css`).

## Contributing

Contributions are welcome! OpenPrep is community-driven.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please follow the existing code style and add tests where applicable. For major changes, open an issue first to discuss.

- Report bugs or suggest features via GitHub Issues.
- Contribute resources through the in-app form or directly to `src/data/companies.json`.

See the [TODO.md](TODO.md) for ongoing tasks.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. (Note: Add a LICENSE file if not present.)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Vercel](https://vercel.com/).
- UI inspired by shadcn/ui components.
- Company logos sourced from public domains (placeholders used where needed).

For questions or feedback, feel free to open an issue!
