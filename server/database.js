const mysql = require('mysql2/promise');

//Allows us to access the ENV file
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.PORT
});

const dbConnect = async (req, res, next) => {

    console.log("in dbConnect");
    
    try {
      // Connecting to our SQL db. req gets modified and is available down the line in other middleware and endpoint functions
      req.db = await pool.getConnection();
      req.db.connection.config.namedPlaceholders = true;
  
      // Traditional mode ensures not null is respected for unsupplied fields, ensures valid JavaScript dates, etc.
      await req.db.query('SET SESSION sql_mode = "TRADITIONAL"');
      await req.db.query(`SET time_zone = '-8:00'`);
  
      // Moves the request on down the line to the next middleware functions and/or the endpoint it's headed for
      await next();
  
      // After the endpoint has been reached and resolved, disconnects from the database
      req.db.release();
    } catch (err) {
      // If anything downstream throw an error, we must release the connection allocated for the request
      console.log(err)
      // If an error occurs, disconnects from the database
      if (req.db) req.db.release();
      throw err;
    }
  }

  module.exports = dbConnect;