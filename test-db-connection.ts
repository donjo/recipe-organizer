import { db } from './src/db/database.ts';

console.log('🔌 Testing database connection...');

try {
  // Try a simple query to test the connection
  const result = await db
    .selectFrom('recipes')
    .select('id')
    .limit(1)
    .execute();
  
  console.log('✅ Database connection successful!');
  console.log('📊 The recipes table exists and is accessible');
} catch (error) {
  if (error.message.includes('does not exist')) {
    console.log('⚠️  Database connected but tables not created yet');
    console.log('💡 Run: deno task migrate:up');
  } else {
    console.error('❌ Database connection failed:', error.message);
  }
} finally {
  // Note: There's a compatibility issue with destroy() in Deno
  // The connection will close automatically when the process ends
}