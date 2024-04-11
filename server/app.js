const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const dbConnect = require('./database');

const app = express();
const port = 3000;

const corsOptions = {
  origin: "*",
  credentials: true,
  "access-control-allow-credentials": true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Makes Express parse the JSON body of any requests and adds the body to the req object
app.use(bodyParser.json());

//adds database connection to req.db
app.use((req, res, next) => dbConnect(req, res, next));

app.put("/signup", async (req, res) => {
  try {
    //get the data from the request to create a new user
    const { username, email, password } = req.body;

    //check if the email or username is being used
    const [[validateEmail]] = await req.db.query(
      `SELECT email FROM Users WHERE email = :email AND deleted_flag=0`,
      { email }
    );
    const [[validateUser]] = await req.db.query(
      `SELECT username FROM Users WHERE username = :username AND deleted_flag=0`,
      { username }
    );

        if (validateEmail) {
            res.json({success: false, err: "Email already in use"});
        } else if (validateUser) {
            res.json({success: false, err: "Username already taken"});
        } else {

            //hash their password
            const hashedPassword = await bcrypt.hash(password, 10);

            //get default profile picture
            const defaultProfilePic = await fs.readFile('./imgs/DefaultProfilePic.jpg');
            
            //attempt to insert the data into the database
            await req.db.query(`INSERT INTO Users (username, email, password, profile_pic) 
                                                          VALUES (:username, :email, :hashedPassword, :defaultProfilePic);`, 
            { username, email, hashedPassword, defaultProfilePic });

      //need to query into the db to get the newly created users id, username, and profilepic
      const [[userData]] = await req.db.query(
        `SELECT user_id, username, email FROM Users WHERE username = :username`,
        {
          username,
        }
      );

            //create a payload for the jwt
            const payload = {
                user_id: userData.user_id,
                username: userData.username,
                email: userData.email,
            }
 
            //creates the jwt
            const jwtEncodedUser = jwt.sign(payload, process.env.JWT_KEY);
                
            //respond with the jwt and userData
            res.json({ jwt: jwtEncodedUser, success: true, userData: payload });
        }
    } catch(error) {
        res.json({success: false, err: "Internal server error"});
        console.log(`error creating user ${error}`);
    }
}) // end user post

//endpoint for signing in
app.post("/signin", async (req, res) => {
  try {
    //get credentials from req
    const { username: login, password: userEnteredPassword } = req.body;

    //check if the login is an email or username, then do the corresponding query for it
    let data = {};
    const emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailCheck.test(login)) {
      const [[userData]] = await req.db.query(
        `SELECT user_id, email, username, password FROM Users WHERE email = :login AND deleted_flag=0`,
        { login }
      );
      data = userData;
    } else {
      const [[userData]] = await req.db.query(
        `SELECT user_id, email, username, password FROM Users WHERE username = :login AND deleted_flag=0`,
        { login }
      );
      data = userData;
    }

    //get the users data
    //if no user data, return false
    if (!data) {
      res.json({ success: false, err: "no user found" });
      return;
    }

    //hash the entered password and then compare them
    const hashedPassword = `${data.password}`;
    const passwordMatches = await bcrypt.compare(
      userEnteredPassword,
      hashedPassword
    );

    //check if the password is correct, if not then res with success of false
    if (!passwordMatches) {
      res.json({ success: false, err: "Invalid Credentials" });
    } else {
      //create a payload for the jwt with user info
      const payload = {
        user_id: data.user_id,
        username: data.username,
        email: data.email,
      };

      const jwtToken = jwt.sign(payload, process.env.JWT_KEY);
      res.json({ success: true, jwt: jwtToken, data: payload });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, err: "internal server error" });
  }
});

app.use(async function verifyJwt(req, res, next) {
   
    //get the jwt token from req header
  const { authorization: authHeader } = req.headers;

  //check if there is a jwt token
  if (!authHeader) {
    res.json({success: false, err: "Invalid authorization, no authorization headers"});
    return;
  }

  //split the authorization, then verify it starts with bearer
  const [scheme, jwtToken] = authHeader.split(" ");

  if (scheme !== "Bearer") {
    res.json({sucess: false, err: "Invalid authorization, invalid authorization scheme"});
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
});

app.post("/workspace/users", async (req, res) => {
  try {

    const { workspace_id } = req.body

    // get all rows from Users table
    const [rows] = await req.db.query(`SELECT Users.user_id, username, email, Workspace_Users.workspace_role
                                       FROM Workspace_Users
                                       INNER JOIN Users ON Workspace_Users.user_id = Users.user_id
                                       WHERE workspace_id = :workspace_id
                                       ORDER BY username`, {
                                        workspace_id
                                       }
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("error getting users", error);
    res.json({ success: false, err: "internal server error" });
  }
});

//endpoint for geting a specific users information after signing in
app.get("/user", async (req, res) => {
    try {

        //get the users id from their jwt token
        const { user_id } = req.user

        //get the users info, then query again for workspace id and name
        const [[userData]] = await req.db.query(`SELECT username, email, profile_pic, last_workspace_id FROM Users WHERE user_id = :user_id`, { 
                                            user_id 
                                         })
        
        //table join to get the information for which workspace a user has access too 
        const [workspaceData] = await req.db.query(`SELECT Workspace_Users.workspace_id, workspace_name
                                                    FROM Workspace_Users
                                                    INNER JOIN Workspace ON Workspace_Users.workspace_id = Workspace.workspace_id
                                                    WHERE user_id = :user_id AND Workspace.deleted_flag = 0`, {
                                             user_id
                                         })

        //respond with success of true and the data that was just queried
        res.json({success: true, data: {user: userData, workspaces: workspaceData}})

    } catch (err) {
        console.log(err);
        res.json({success: false, err: "Internal server error"});
    }
})

//endpoint for changing a users password
app.put("/changepassword", async (req, res) => {
  try {
    //get password from the request and user id
    const { password } = req.body;
    const { user_id } = req.user;

    //if theres no password return false
    if (!password) {
      res.json({ success: false, err: "missing password" });
      return;
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //query the database and update the users password
    const [query] = await req.db.query(
      `UPDATE Users SET password = :hashedPassword WHERE user_id = :user_id`,
      {
        user_id,
        hashedPassword,
      }
    );

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, err: "Internal server error" });
    console.log("error changing password: " + err);
  }
});

/* 
*
* Endpoints for Projects
*
*
*/
//gets the recent project data to display on home page
app.post('/projects/recent', async (req, res) => {
    try {

        const { workspace_id } = req.body;

        if (!workspace_id) {
            res.json({ success: false, err: "missing workspace id" });
            return;
        }

        const [recent] = await req.db.query(`SELECT Projects.project_id, project_name 
                                       FROM Projects 
                                       INNER JOIN Entries ON Projects.project_id = Entries.project_id
                                       WHERE workspace_id = :workspace_id AND Projects.deleted_flag = 0
                                       ORDER BY Entries.end_time LIMIT 5`, {
            workspace_id
        })

        res.json({success: true, data: recent});

    } catch (err) {
        res.json({success: false, err: "Internal Server Error"});
        console.log(err);
    }
})

//gets all projects data for a workspace
app.post('/projects/all', async (req, res) => {
  try {
    const { workspace_id } = req.body;

    const [projects] = await req.db.query(` SELECT Projects.project_id, project_name, SUM(total_time) AS total_time
                                            FROM Projects
                                            LEFT JOIN Entries ON Projects.project_id = Entries.project_id 
                                            WHERE workspace_id = :workspace_id AND Projects.deleted_flag=0 AND Entries.deleted_flag=0
                                            GROUP BY Projects.project_id;`, {
                                              workspace_id
                                            })
    
    res.json({success: true, data: projects})

  } catch (err) {
    console.log(err);
    res.json({success: false, err: "Internal server error"});
  }
})

//gets information for a specific project
app.post('/project/:project_id', async (req, res) => {

  try {
    const { project_id } = req.params

    const [data] = await req.db.query(`SELECT username, total_time, entry_desc, entry_id
                                       FROM Entries 
                                       INNER JOIN Users ON Entries.user_id = Users.user_id
                                       WHERE project_id=:project_id AND Entries.deleted_flag = 0
                                       ORDER BY Entries.end_time DESC`, { 
                                        project_id
                                      })

    res.json({success: true, data: data})

  } catch (err) {
    console.log(err);
    res.json({success: false, err: "Internal Server Error"})
  }
})




app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
