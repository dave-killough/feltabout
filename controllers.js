var express = require('express');
var router = express.Router(); 
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'feltabout' });
}).post('/signup', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO fab_user(user_name, user_password) VALUES ($1,$2)',['dave','test']);
    const results = { 'results': (result) ? result.rows : null};
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send(err);
  }
}).get('/db', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM fab_user');
    const results = { 'results': (result) ? result.rows : null};
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});
module.exports = router;