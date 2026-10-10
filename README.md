# PDFGPT 📄🤖

PDFGPT is a modern, full-stack Next.js application designed to let users upload PDF documents and interact with them using AI-powered chat interfaces. 

Built with scalability, type safety, and clean UI in mind.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router)
- **Database ORM:** [Drizzle ORM](https://drizzle.team)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [shadcn/ui](https://shadcn.com)
- **Package Manager:** [pnpm](https://pnpm.io)

---

## 🛠️ Getting Started

### 1. Prerequisites

Ensure you have **Node.js** (v18.x or higher) and **pnpm** installed on your system.

### 2. Clone the Repository

```bash
git clone https://github.com
cd pdfgpt
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Environment Variables

Create a `.env.local` file in the root directory and add your database and AI API keys:

```env
# Database Connection
DATABASE_URL=your_database_connection_string

# AI / OpenAI API Key (if applicable)
OPENAI_API_KEY=your_openai_api_key
```

### 5. Database Migrations

Generate and push your database schema using Drizzle:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 6. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📁 Project Structure

```text
├── local/               # Local environment configurations or data
├── migrations/          # Drizzle SQL migration files
├── public/              # Static assets (images, icons, etc.)
├── src/                 # Application source code
│   ├── app/             # Next.js App Router (pages and API routes)
│   ├── components/      # Reusable UI components
│   └── lib/             # Utility functions, database clients, and config
├── components.json      # shadcn/ui configuration file
├── drizzle.config.ts    # Drizzle ORM configuration
└── next.config.ts       # Next.js configuration
```

---

## 📜 Available Scripts

- `pnpm dev` – Starts the development server.
- `pnpm build` – Builds the application for production.
- `pnpm start` – Starts the production server after building.
- `pnpm lint` – Runs ESLint to check for code quality issues.
