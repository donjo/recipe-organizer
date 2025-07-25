import { db } from './database.ts';
import { up as createTables, down as dropTables } from './migrations/001_create_tables.ts';

const command = Deno.args[0];

async function runMigrations() {
  console.log('🚀 Running migrations...');
  
  try {
    await createTables(db);
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    Deno.exit(1);
  }
}

async function rollbackMigrations() {
  console.log('🔄 Rolling back migrations...');
  
  try {
    await dropTables(db);
    console.log('✅ Rollback completed successfully!');
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    Deno.exit(1);
  }
}

if (command === 'up') {
  await runMigrations();
} else if (command === 'down') {
  await rollbackMigrations();
} else {
  console.log('Usage: deno run --allow-net --allow-read --allow-env migrate.ts [up|down]');
  Deno.exit(1);
}

await db.destroy();