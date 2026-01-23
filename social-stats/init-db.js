// init-db.js - Database initialization script
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'social_stats.db');

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  console.log('⚠️  Database already exists. Skipping initialization.');
  console.log('   To reinitialize, delete social_stats.db and run this script again.');
  process.exit(0);
}

const db = new sqlite3.Database(dbPath, async (err) => {
  if (err) {
    console.error('❌ Error creating database:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Database created successfully');
  
  try {
    // Read and execute schema
    const schema = fs.readFileSync(path.resolve(__dirname, '../sqlserver.txt'), 'utf8');
    
    // Execute schema statements
    await new Promise((resolve, reject) => {
      db.exec(schema, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Database schema created');
    
    // Add level column
    await new Promise((resolve, reject) => {
      db.run('ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Added level column to users table');
    
    // Hash passwords
    const adminHash = await bcrypt.hash('admin', 10);
    const testHash = await bcrypt.hash('test', 10);
    const giulioHash = await bcrypt.hash('giulio', 10);
    const lucaHash = await bcrypt.hash('luca', 10);
    
    // Insert initial users
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password, role, points, level) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    await new Promise((resolve, reject) => {
      stmt.run('admin', 'admin@example.it', adminHash, 'admin', 100, 5, (err) => {
        if (err) reject(err);
      });
      stmt.run('test', 'test@example.com', testHash, 'user', 50, 3, (err) => {
        if (err) reject(err);
      });
      stmt.run('giulio', 'giulio@example.it', giulioHash, 'user', 75, 4, (err) => {
        if (err) reject(err);
      });
      stmt.run('luca', 'luca@example.it', lucaHash, 'user', 25, 2, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    stmt.finalize();
    
    console.log('✅ Initial users created:');
    console.log('   - admin (admin@example.it) - password: admin - role: admin');
    console.log('   - test (test@example.com) - password: test - role: user');
    console.log('   - giulio (giulio@example.it) - password: giulio - role: user');
    console.log('   - luca (luca@example.it) - password: luca - role: user');
    console.log('');
    console.log('✅ Database initialization complete!');
    console.log('   You can now start the server with: node app.js');
    
  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
    process.exit(1);
  } finally {
    db.close();
  }
});
