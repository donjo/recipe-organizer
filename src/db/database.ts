import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';
import { load } from '@std/dotenv';

// Load environment variables with allowEmptyValues for local dev
await load({ allowEmptyValues: true });

// Database table types
export interface RecipeTable {
  id: string;
  title: string;
  description: string | null;
  category: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  created_at: Date;
  updated_at: Date;
}

export interface IngredientTable {
  id: string;
  recipe_id: string;
  name: string;
  amount: string;
  unit: string;
  order_index: number;
}

export interface InstructionTable {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
}

// Database schema type
export interface Database {
  recipes: RecipeTable;
  ingredients: IngredientTable;
  instructions: InstructionTable;
}

// Create database connection URL
// Support both DATABASE_URL (production) and individual variables (local dev)
let connectionString = Deno.env.get('DATABASE_URL');

if (!connectionString) {
  const host = Deno.env.get('DATABASE_HOST') || 'localhost';
  const port = Deno.env.get('DATABASE_PORT') || '5432';
  const user = Deno.env.get('DATABASE_USER') || 'johndonmoyer';
  const password = Deno.env.get('DATABASE_PASSWORD') || '';
  const database = Deno.env.get('DATABASE_NAME') || 'recipe_organizer';

  // Build connection string from individual components
  connectionString = password 
    ? `postgres://${user}:${password}@${host}:${port}/${database}`
    : `postgres://${user}@${host}:${port}/${database}`;
}

// Create postgres client
const sql = postgres(connectionString, {
  max: 10,
});

export const db = new Kysely<Database>({
  dialect: new PostgresJSDialect({
    postgres: sql,
  }),
});