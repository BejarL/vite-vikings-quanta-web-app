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

            console.log(hashedPassword);
            
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
                
            res.json({ jwt: jwtEncodedUser, success: true, data: payload });
        }
    } catch(error) {
        res.json({success: false, err: error});
        console.log(`error creating user ${error}`);
    }
}) // end user post


app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });