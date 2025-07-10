const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const fs = require('fs');
const { initializeDigestScheduler } = require('./services/digestService');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'chhimeki_social',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// Database middleware
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/communities', require('./routes/communities'));
app.use('/api/events', require('./routes/events'));
app.use('/api/trends', require('./routes/trends'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/users', require('./routes/users'));
app.use('/api/subscriptions', require('./routes/subscriptions'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      timestamp: result.rows[0].now,
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Run database migrations
async function runMigrations() {
  try {
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).sort();
    
    // Create migrations tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check which migrations have been run
    const completedMigrations = await pool.query(
      'SELECT filename FROM migrations ORDER BY executed_at'
    );
    
    const completedFiles = completedMigrations.rows.map(row => row.filename);
    
    // Run pending migrations
    for (const file of migrationFiles) {
      if (!completedFiles.includes(file)) {
        console.log(`Running migration: ${file}`);
        
        const migrationSql = fs.readFileSync(
          path.join(migrationsDir, file),
          'utf8'
        );
        
        await pool.query(migrationSql);
        
        // Mark migration as completed
        await pool.query(
          'INSERT INTO migrations (filename) VALUES ($1)',
          [file]
        );
        
        console.log(`Completed migration: ${file}`);
      }
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

// Catch-all handler for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    
    // Run migrations
    await runMigrations();
    
    // Initialize digest scheduler
    initializeDigestScheduler(pool);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Subscriptions API: http://localhost:${PORT}/api/subscriptions`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down server...');
  await pool.end();
  process.exit(0);
});

startServer();