var express = require('express');
var router = express.Router(); 
require('dotenv').config(); // read ENV from .env file
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'feltabout' });
}).post('/signup', async (req, res) => {
  try {
    signup_user = req.body["signup-user"];
    signup_password = req.body["signup-password"];
    if (signup_user === "" || signup_password === "") {
      results = { 'status': -2, 'message': 'Please provide a user and password.'};
    }
    else {
      params = [ signup_user, signup_password];
      const client = await pool.connect();
      const result1 = await client.query( // does the passed user already exist?
        'SELECT user_id FROM fab_user WHERE user_name = $1', [ signup_user ]
      );
      if (result1.rowCount > 0) { // user already exists
        results = { 'status': -1, 'message': 'This user is already taken.'};
      }
      else {
        const result2 = await client.query(
          'INSERT INTO fab_user(user_name, user_password) VALUES ($1,$2)',params);
        results = { 'status': 0, 'message': 'All good!!'};
      }      
    }
    res.json(results);
  } 
  catch (err) {
    console.error(err);
    results = { 'status': -9, 'message': err.message };
    res.json(results);
  }
  client.release(); 
}).get('/db', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM fab_user');
    const results = { 'results': (result) ? result.rows : null};
    res.json(results);
    client.release();
  } 
  catch (err) {
    console.error(err);
    res.send(err);
  }
});
module.exports = router;