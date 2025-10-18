import type { Config } from 'drizzle-kit'

import { config } from 'dotenv'

config({ path: '.env.local' })
console.log("process.env.DATABASE_URL", process.env.DATABASE_URL);
export default {
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
