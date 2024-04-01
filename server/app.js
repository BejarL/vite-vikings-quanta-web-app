const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const dbConnect = require('./database');

const app = express();
const port = 3000;

const corsOptions = {
   origin: '*', 
   credentials: true,  
   'access-control-allow-credentials': true,
   optionSuccessStatus: 200,
}

app.use(cors(corsOptions));

// Makes Express parse the JSON body of any requests and adds the body to the req object
app.use(bodyParser.json());

//adds database connection to req.db 
app.use((req, res, next) => dbConnect(req, res, next));
 
app.put('/signup', async (req, res) => {
    try {
        //get the data from the request to create a new user
        const {
            username,
            email,
            password
        } = req.body;

        //check if the email or username is being used
        const [[validateEmail]] = await req.db.query(`SELECT email FROM Users WHERE email = :email`, { email });
        const [[validateUser]] = await req.db.query(`SELECT username FROM Users WHERE username = :username`, { username });

        if (validateEmail) {
            res.json({success: false, err: "Email already in use"});
        } else if (validateUser) {
            res.json({success: false, err: "Username already taken"});
        } else {

            //hash their password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            //attempt to insert the data into the database
            await req.db.query(`INSERT INTO Users (username, email, password) 
                                                          VALUES (:username, :email, :hashedPassword);`, 
            { username, email, hashedPassword });

            //need to query into the db to get the newly created users id, username, and profilepic
            const [[userData]] = await req.db.query(`SELECT user_id, username, email FROM Users WHERE username = :username`, {
                username
            });

            const payload = {
                user_id: userData.user_id,
                username: userData.username,
                email: userData.email
            }
 
            const jwtEncodedUser = jwt.sign(payload, process.env.JWT_KEY);
                
            res.json({ jwt: jwtEncodedUser, success: true });
        }
    } catch(error) {
        res.json({success: false, err: "Internal server error"});
        console.log(`error creating user ${error}`);
    }
}) // end user post

//endpoint for signing in
app.post('/signin', async (req, res) => {
    try {
        //get credentials from req
        const { email, password: userEnteredPassword } = req.body;

        //get the users data
        const [[userData]] = await req.db.query(`SELECT email, username, password FROM Users WHERE email = :email`, { email });

        //if no user data, return false
        if (!userData) {
            res.json({success: false, err: "no user found"});
            return;
        }
        
        //hash the entered password and then compare them
        const hashedPassword = `${userData.password}`
        const passwordMatches = await bcrypt.compare(userEnteredPassword, hashedPassword);
        
        //check if the password is correct, if not then res with success of false
        if (!passwordMatches) {
            res.json({success: false, err: "Invalid Credentials"})
        } else {
            //create a payload for the jwt with user info
            const payload = {
                user_id: userData.user_id,
                username: userData.username,
                email: userData.email
            }; 

            const jwtToken = jwt.sign(payload, process.env.JWT_KEY);
            res.json({success: true, jwt: jwtToken});
        }
    } catch(err) {
        console.log(err);
        res.json({success: false, err: "internal server error"});
    }
})

app.get('/users', async(req,res) => {
    try {
        // get all rows from Users table
        const [rows] = await req.db.query(`SELECT * FROM Users`)
        res.json({success: true, data: rows})
    } catch(error) {
        console.error('error getting users', error)
        res.json({success: false, message: 'internal server error'})
    }
})

app.use(async function verifyJwt(req, res, next) {
    const { authorization: authHeader } = req.headers;
    
    if (!authHeader) res.json('Invalid authorization, no authorization headers');
  
    const [scheme, jwtToken] = authHeader.split(' ');
  
    if (scheme !== 'Bearer') res.json('Invalid authorization, invalid authorization scheme');
  
    try {
      const decodedJwtObject = jwt.verify(jwtToken, process.env.JWT_KEY);
  
      req.user = decodedJwtObject;
    } catch (err) {
      console.log(err);
      if (
        err.message && 
        (err.message.toUpperCase() === 'INVALID TOKEN' || 
        err.message.toUpperCase() === 'JWT EXPIRED')
      ) {
  
        req.status = err.status || 500;
        req.body = err.message;
        req.app.emit('jwt-error', err, req);
      } else {
  
        throw((err.status || 500), err.message);
      }
    }
  
    await next();
  });

//endpoint for changing a users password
app.put('/changepassword', async (req, res) => {
    try {
        //get password from the request and user id
        const { password } = req.body;
        const { user_id } = req.user;

        //if theres no password return false
        if (!password) {
            res.json({success: false, err: "missing password"})
            return;
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //query the database and update the users password
        const [query] = await req.db.query(`UPDATE Users SET password = :password WHERE user_id = :user_id`, {
            user_id, hashedPassword
        })
        
        res.json({ success: true })
        
    } catch (err) {
        res.json({success: false, err: "Internal server error"});
        console.log("error changing password: " + err);
    }
})

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });