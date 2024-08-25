import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/server/schema';

const sql = neon(process.env.POSTGRES_DATABASE_URL as string);
export const db = drizzle(sql, { schema, logger: true });
