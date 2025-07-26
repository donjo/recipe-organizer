import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';
import { load } from '@std/dotenv';

// Load environment variables only in development
// In production (Deno Deploy), env vars are already available
if (Deno.env.get('DENO_DEPLOYMENT_ID') === undefined) {
  await load({ export: true });
}

// Debug environment variables (without showing sensitive data)
console.log('🔍 Database connection debug:');
console.log('DENO_DEPLOYMENT_ID:', Deno.env.get('DENO_DEPLOYMENT_ID') ? 'Present' : 'Not present');
console.log('DATABASE_URL:', Deno.env.get('DATABASE_URL') ? 'Present (length: ' + Deno.env.get('DATABASE_URL')?.length + ')' : 'Not present');
console.log('DATABASE_HOST:', Deno.env.get('DATABASE_HOST') ? 'Present' : 'Not present');

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
  console.log('📝 Building connection string from individual variables...');
  const host = Deno.env.get('DATABASE_HOST') || 'localhost';
  const port = Deno.env.get('DATABASE_PORT') || '5432';
  const user = Deno.env.get('DATABASE_USER') || 'johndonmoyer';
  const password = Deno.env.get('DATABASE_PASSWORD') || '';
  const database = Deno.env.get('DATABASE_NAME') || 'recipe_organizer';

  // Build connection string from individual components
  connectionString = password 
    ? `postgres://${user}:${password}@${host}:${port}/${database}`
    : `postgres://${user}@${host}:${port}/${database}`;
  
  console.log(`📡 Using connection: postgres://${user}:***@${host}:${port}/${database}`);
} else {
  console.log('📡 Using DATABASE_URL from environment');
}

// Create postgres client
// Neon requires SSL connections in production
const isProduction = Deno.env.get('DENO_DEPLOYMENT_ID') !== undefined;

// For Neon, we need to handle SSL properly
let sslConfig;
if (isProduction) {
  // Check if the connection string already has SSL params
  if (connectionString.includes('sslmode=')) {
    sslConfig = 'prefer'; // Let postgres library handle it
    console.log('🔐 SSL config: Using connection string SSL parameters');
  } else {
    sslConfig = { rejectUnauthorized: false };
    console.log('🔐 SSL config: Using custom SSL config');
  }
} else {
  sslConfig = false;
  console.log('🔐 SSL config: Disabled for development');
}

const sql = postgres(connectionString, {
  max: 10,
  ssl: sslConfig,
});

export const db = new Kysely<Database>({
  dialect: new PostgresJSDialect({
    postgres: sql,
  }),
});