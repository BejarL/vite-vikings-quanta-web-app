const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./Mailer');
require('dotenv').config();


const signUp = async (req, res) => {
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
                
                //attempt to insert the data into the database
                const [query] = await req.db.query(`INSERT INTO Users (username, email, password) 
                                                              VALUES (:username, :email, :hashedPassword);`, 
                { username, email, hashedPassword });
    
                const { insertId: user_id } = query
    
                //create a payload for the jwt
                const payload = {
                    user_id: user_id,
                    username: username,
                    email: email,
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
}

const signIn = async (req, res) => {
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
}

const getUserInfo = async (req, res) => {
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
}

//is used to reset a users password
const changePassword = async (req, res) => {

    try {
      //get password from the request and user id
      const { password } = req.body;
      const { email } = req.user;
  
      //if theres no password return false
      if (!password) {
        res.json({ success: false, err: "missing password" });
        return;
      }
  
      //hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      //query the database and update the users password
      const [query] = await req.db.query(
        `UPDATE Users SET password = :hashedPassword WHERE email = :email`,
        {
          email,
          hashedPassword,
        }
      );
  
      res.json({ success: true });
    } catch (err) {
      res.json({ success: false, err: "Internal server error" });
      console.log("error changing password: " + err);
    }
}

//is used to send the email to reset a users password
const sendResetPassword = async (req, res) => {
    try {

      const { email } = req.body;

      //create jwt token
      const payload = {
        email
      };
      const jwtToken = jwt.sign(payload, process.env.JWT_KEY);

      //create subjec and body to send
      const subject = "Quanta | Reset your password";

      const body = `
        <div>
          <h2>Reset Your password <a href="http://localhost:5173/reset-password/${jwtToken}">here</a></h2>
        </div>
      `;

      sendEmail(email, body, subject);

      res.json({success: true, msg: "Email sent"});

    } catch (err) {
      console.log(err);
      res.json({success: false, err: "Internal Server Error"});
    }
}

exports.signUp = signUp
exports.signIn = signIn;
exports.getUserInfo = getUserInfo;
exports.sendResetPassword = sendResetPassword;
exports.changePassword = changePassword;
