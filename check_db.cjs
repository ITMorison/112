const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_ibA5nXxpJo0c@ep-still-smoke-adkurg9z.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const client = new Client({ connectionString });

client.connect()
  .then(() => {
    console.log('Connected to the database');
    // Query 1: Get tables in public schema
    return client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  })
  .then(result => {
    console.log('Tables in public schema:', result.rows);
    // Query 2: Get columns for the table 'products'
    return client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products'");
  })
  .then(result => {
    console.log('Columns in products table:', result.rows);
    // Query 3: Count rows in products table
    return client.query("SELECT count(*) FROM products");
  })
  .then(result => {
    const count = result.rows[0].count;
    console.log('Row count in products table:', count);
  })
  .catch(err => {
    console.error('Error:', err);
  })
  .finally(() => {
    client.end();
  });