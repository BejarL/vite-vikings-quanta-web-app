const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

//Allows us to access the ENV file
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'Quanta',
  port: process.env.PORT
});

const dbConnect = async (req, res, next) => {
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
    await req.db.release();
  } catch (err) {
    // If anything downstream throw an error, we must release the connection allocated for the request
    console.log(err)
    // If an error occurs, disconnects from the database 
    if (req.db) req.db.release();
    throw err;
  }
}

const verifyJwt = async (req, res, next) => {
  //get the jwt token from req header
  const { authorization: authHeader } = req.headers;

  //check if there is a jwt token
  if (!authHeader) {
    res.json({ success: false, err: "Invalid authorization, no authorization headers" });
    return;
  }

  //split the authorization, then verify it starts with bearer
  const [scheme, jwtToken] = authHeader.split(" ");

  if (scheme !== "Bearer") {
    res.json({ sucess: false, err: "Invalid authorization, invalid authorization scheme" });
    return;
  }
 
  try {
    
    //decode the jwt, then tack on the payload of user info to the req obj to be used in later requests
    const decodedJwtObject = jwt.verify(jwtToken, process.env.JWT_KEY);
    req.user = decodedJwtObject;
    
  } catch (err) {
    console.log(err);
    if (
      err.message &&
      (err.message.toUpperCase() === "INVALID TOKEN" ||
        err.message.toUpperCase() === "JWT EXPIRED")
    ) {
      req.status = err.status || 500;
      req.body = err.message;
      req.app.emit("jwt-error", err, req);
    } else {
      throw (err.status || 500, err.message);
    }
  }

  await next();
}

exports.dbConnect = dbConnect;
exports.verifyJwt = verifyJwt;