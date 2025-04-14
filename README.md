# 10x Astro Starter

## Project Description

10x Astro Starter is a comprehensive boilerplate project designed to help you quickly build fast, efficient, and scalable web applications. It leverages Astro 5 for high-performance static site generation combined with React 19 for interactive components. Built with TypeScript 5 and styled using Tailwind CSS 4 along with accessible components from Shadcn/ui, this starter kit incorporates modern best practices for both frontend and backend development.

## Tech Stack

- **Frontend:**

  - Astro 5 – Fast, minimal JavaScript static site generation
  - React 19 – For building interactive UIs
  - TypeScript 5 – Ensured type safety and improved developer experience
  - Tailwind CSS 4 – Utility-first styling for rapid UI development
  - Shadcn/ui – Accessible and customizable React components

- **Backend:**

  - Supabase – A complete backend solution with PostgreSQL as the database

- **AI Integration:**

  - Openrouter.ai – Access to various models (OpenAI, Anthropic, Google, etc.) with cost control mechanisms

- **CI/CD & Hosting:**
  - GitHub Actions – For continuous integration and deployment pipelines
  - DigitalOcean – Hosting platform using Docker images

## Getting Started Locally

### Prerequisites

- Node.js version specified in the `.nvmrc` (currently v22.14.0).
- A Git client to clone the repository.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd 10x-cards
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` (or the port indicated in the terminal) to see the application in action.

## Available Scripts

Within the project directory, you can run:

- `npm run dev` – Starts the Astro development server.
- `npm run build` – Builds the project for production.
- `npm run preview` – Serves the production build locally.
- `npm run astro` – Access Astro CLI commands.
- `npm run lint` – Runs ESLint to analyze code quality.
- `npm run lint:fix` – Automatically fixes linting errors.
- `npm run format` – Formats the code using Prettier.

## Project Scope

This project serves as a robust starting point for developing production-ready web applications. It incorporates modern best practices, a clean and scalable architecture, and essential tools and libraries to facilitate smooth development workflows. Refer to the [Product Requirements Document](./prd.md) for comprehensive details on project requirements and scope.

## Project Status

Version: 0.0.1

This project is in its early stages and is actively maintained. Contributions, bug reports, and feature requests are welcome.

## License

This project is licensed under the MIT License.
