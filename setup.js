const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Read migration files
    const migrations = [
      '003_subscription_system.sql',
      '004_chat_system.sql'
    ];
    
    for (const migration of migrations) {
      const migrationPath = path.join(__dirname, 'server', 'migrations', migration);
      
      if (fs.existsSync(migrationPath)) {
        console.log(`📄 Running migration: ${migration}`);
        const sql = fs.readFileSync(migrationPath, 'utf8');
        await pool.query(sql);
        console.log(`✅ Migration ${migration} completed`);
      } else {
        console.log(`⚠️  Migration file not found: ${migration}`);
      }
    }
    
    console.log('🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigrations();