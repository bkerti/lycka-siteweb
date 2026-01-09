
require('dotenv').config({ path: './.env.local' });
const { Pool } = require('pg');

// Connect to the default 'postgres' database to run the CREATE DATABASE command
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres', // Connect to the default db
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

const dbName = process.env.DB_DATABASE;

pool.connect(async (err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  try {
    await client.query(`CREATE DATABASE "${dbName}" ENCODING 'UTF8'`);
    console.log(`Database '${dbName}' created successfully.`);
  } catch (createErr) {
    // If the database already exists, it will throw an error.
    // We can check for the specific error code '42P04' for "duplicate_database".
    if (createErr.code === '42P04') {
      console.log(`Database '${dbName}' already exists.`);
    } else {
      console.error(`Error creating database '${dbName}':`, createErr.stack);
    }
  } finally {
    release();
    pool.end();
  }
});
