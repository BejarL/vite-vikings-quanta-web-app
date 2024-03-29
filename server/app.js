const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const dbConnect = require('./database');

// Allows us to access the .env
require('dotenv').config();

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
 
app.post('/test', async (req, res) => {
    console.log("hit")
 
    if (req.db) {
        console.log("connected")
    }

    res.send("working");
})

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });