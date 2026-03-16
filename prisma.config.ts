import path from 'node:path';
import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  migrations: {
    seed: 'npx ts-node ./prisma/seed.ts'
  },
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5434/nexus_db?schema=public'
  }
});
