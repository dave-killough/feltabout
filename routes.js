var express = require('express');
var cookie
var router = express.Router(); 
require('dotenv').config(); // read ENV from .env file
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
const cookieParams = {
  httpOnly: true,
  signed: true,
  maxAge: 300000
}
router.get('/', function(req, res, next) {
  res.render('index', { title: 'feltabout' });
}).post('/signup', async (req, res, next) => {
  try {
    signup_user = req.body["signup-user"];
    signup_password = req.body["signup-password"];
    if (signup_user === "" 
    || signup_password === "") {
      results = { 'status': -2
      , 'message': 'Please provide a user and password.'};
    }
    else {
      params = [ signup_user, signup_password];
      const client = await pool.connect();
      const result1 = await client.query(` 
        SELECT user_id FROM fab_user 
        WHERE user_name = $1
        `, [ signup_user ]
      );
      if (result1.rowCount > 0) { // user already exists
        results = { 'status': -1
        , 'message': 'User taken.  Please select another.'};
      }
      else {
        const result2 = await client.query(`
        INSERT INTO fab_user(user_name, user_password) 
          VALUES ($1,$2) RETURNING user_id
          `,params);
        results = { 'status': 0, 'message': 'All good!!'};
        s_user_id = result2.rows[0]["user_id"];
        res.cookie('fab', s_user_id, cookieParams);
      }  
      client.release(); 
    }
    res.json(results);
  } 
  catch (err) {
    console.error(err);
    results = { 'status': -9, 'message': err.message };
    res.json(results);
  }
}).post('/login', async (req, res, next) => {
  try {
    user = req.body["login-user"];
    password = req.body["login-password"];
    if (user === "" || password === "") {
      results = { 'status': -2
      , 'message': 'Please provide a user and password.'};
    }
    else {
      const client = await pool.connect();
      const result1 = await client.query(` 
        SELECT user_id, user_password 
        FROM fab_user 
        WHERE user_name = $1
        `, [ user ]
      );
      if (result1.rowCount === 0) { // user not found 
        results = { 'status': -1
        , 'message': 'User/password not valid.'};
      }
      else {
        s_user_id = result1.rows[0]["user_id"];
        s_password = result1.rows[0]["user_password"];
        if (password != s_password) {
          results = { 'status': -1
          , 'message': 'User/Password not valid.'};
        }
        else {
          results = { 'status': 0
          , 'message': 'All good!!'};
          res.cookie('fab', s_user_id, cookieParams);
        }
      }  
      client.release(); 
    }
    res.json(results);
  } 
  catch (err) {
    console.error(err);
    results = { 'status': -9, 'message': err.message };
    res.json(results);
  }
}).get('/connections', async (req, res, next) => {
  try {
    c_user_id = req.signedCookies["fab"];
    if (typeof c_user_id === "undefined" 
    || c_user_id === "" 
    ) {
      results = { 'status': -2
      , 'message': 'No user cookie.'};
    }
    else {
      const client = await pool.connect();
      const result1 = await client.query(`
      SELECT user_id FROM fab_user
      WHERE user_id = $1
      `, [c_user_id]
      );
      if (result1.rowCount === 0) {  
        results = { 'status': -1
        , 'message': 'User record not found.'};
      }
      else {
        s_user_id = result1.rows[0]["user_id"];
        const result2 = await client.query(`
          SELECT connection_id, connection_name
              , connection_user_id, update_timestamp
          FROM fab_connection WHERE user_id = $1
          ORDER BY update_timestamp DESC 
          `, [ s_user_id ]
        );
          results = { 'status': 0
          , 'message': 'All good!!'
          , 'result': result2 };
      }
      client.release();
    }
    res.json(results);
  } 
  catch (err) {
    console.error(err);
    results = { 'status': -9, 'message': err.message };
    res.json(results);
  }
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