import { db } from './database.ts';
import { up as createTables } from './migrations/001_create_tables.ts';

export async function runMigrationsIfNeeded() {
  try {
    console.log('🔍 Checking if migrations are needed...');
    
    // Check if recipes table exists
    const result = await db
      .selectFrom('information_schema.tables')
      .select('table_name')
      .where('table_schema', '=', 'public')
      .where('table_name', '=', 'recipes')
      .executeTakeFirst();
    
    if (!result) {
      console.log('📦 Tables not found, running migrations...');
      await createTables(db);
      console.log('✅ Migrations completed successfully!');
    } else {
      console.log('✅ Tables already exist, skipping migrations');
    }
  } catch (error) {
    console.error('❌ Migration check/run failed:', error);
    // Don't exit the process, let the app start anyway
    // The user will see the database error in the UI
  }
}