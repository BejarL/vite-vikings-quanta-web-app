const { sendEmail } = require('./Mailer');

//gets all users from a workspace
const getWorkspaceUsers = async (req, res) => {
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
  }

// deletes a workspace
const deleteWorkspace = async (req, res) => {
  try {
    const { workspace_id } = req.body

    //create transaction
    await req.db.beginTransaction();

    //'deletes' the workspace 
    await req.db.query(`UPDATE Workspace
                        SET deleted_flag = 1
                        WHERE workspace_id = :workspace_id`, {
                          workspace_id
                        });

    //'deletes' users access to the workspace
    await req.db.query(`UPDATE Workspace_Users
                        SET deleted_flag = 1
                        WHERE workspace_id = :workspace_id`, {
                          workspace_id
                        });

    //'deletes' the projects associated with the workspace
    await req.db.query(`UPDATE Projects
                        SET deleted_flag = 1
                        WHERE workspace_id = :workspace_id`, {
                          workspace_id
                        });

    //'deletes' the entries associated with projects in that workspace
    await req.db.query(`UPDATE Entries 
                        SET deleted_flag = 1
                        WHERE project_id IN (SELECT project_id FROM Projects WHERE workspace_id = :workspace_id)`, {
                          workspace_id
                        });

    //start transaction
    await req.db.commit();


    res.json({success: true, message: 'Successfully deleted a workspace'})

    } catch (error) {
      console.log('Error deleting workspace')
      res.json({success: false, error: error})
    }
  }

  // create a workspace
const createWorkspace = async (req, res) => {
  try {
    const { user_id } = req.user
    const { workspace_name  } = req.body

    await req.db.beginTransaction();

    const [query] = await req.db.query(`INSERT INTO Workspace (workspace_name)
                        VALUES (:workspace_name)`, {
                          workspace_name
                        });

    const { insertId: workspace_id } = query;

    await req.db.query(`INSERT INTO Workspace_Users (user_id, workspace_role, workspace_id)
                            VALUES (:user_id, "Creator", :workspace_id)`, {
                              user_id, workspace_id
                            });

    await req.db.query(`INSERT INTO Change_Log (edit_desc, edit_timestamp, user_id, workspace_id)
                            VALUES ("Created Workspace", NOW(), :user_id, :workspace_id)`, {
                                user_id, workspace_id
                            });
                            
    //start transaction
    await req.db.commit();

    res.json({success: true, message: 'Successfully created workspace'});   

  } catch (err) {
    console.log(err)
    res.json({success: false, err: err})
  }
}

//join a user to a workspace
const joinWorkspace = async (req, res) => {
  try {

    const { user_id } = req.user;
    const { workspace_id } = req.body

    await req.body.beginTransaction();

    await req.db.query(`INSERT INTO Workspace_Users (user_id, workspace_role, workspace_id)
                        VALUES (:user_id, "member", :workspace_id)`, {
                          user_id, workspace_id
                        });

    const [[query]] = await req.db.query(`SELECT username 
                                          FROM Users
                                          WHERE user_id = :user_id`, {
                                            user_id
                                          });
    
    const updateString = `${query.username} joined.`

    await req.db.query(`INSERT INTO Change_Log (edit_desc, edit_timestamp, user_id, workspace_id)
                        VALUES (:updateString, NOW(), :user_id, :workspace_id)`, {
                            updateString ,user_id, workspace_id
                        });

    await req.db.commit();

    res.json({ success: true, message: "Successfully Added to workspace"});
    
  } catch (err) {
    console.log(err);
    res.json({success: false, err: "Internal server error"})
  }
}

const leaveWorkspace = async (req, res) => {
  try {
    const { user_id, workspace_id } = req.body

    //declares transaction
    await req.db.beginTransaction();

    await req.db.query(`UPDATE Workspace_Users
                        SET deleted_flag = 1
                        WHERE user_id = :user_id AND workspace_id = :workspace_id`, {
                          user_id, workspace_id
                        });

    const [[query]] = await req.db.query(`SELECT username 
                                          FROM Users
                                          WHERE user_id = :user_id`, {
                                            user_id
                                          });
    
    const updateString = `${query.username} left`;
    
    await req.db.query(`INSERT INTO Change_Log (edit_desc, user_id, workspace_id)
                        VALUES (:updateString, :user_id, :workspace_id)`, {
                            updateString, user_id, workspace_id
                        });

    //starts transaction
    await req.db.commit();

    res.json({success: true, message: "Successfully removed from workspace"});
    
  } catch (err) {
    console.log(err);
    res.json({success: false, err: "Internal Server Error"});
  }
}

//is used to invite users to a workspace
const inviteUser = async (req, res) => {
  try {
      const { user_email, workspace_id } = req.body;

      const subject = `Invitation To Workspace`;

      const html = `
        <div>
            <h4>You have been added to a workspace by ${user_name}</h4>
            <h6>Check it out <a href="http://localhost:5173/Quanta">here</a></h6>
        </div>`

      //need to make sure the email is associated with a user
      const [[query]] = await req.db.query(`SELECT user_id, username 
                                            FROM Users
                                            WHERE email = :user_email`, {
                                              user_email
                                            });
      
      //if the user is found, add them to the workspace
      if (query) {

        const { user_id, username } = query;

        //start transaction to ensure 
        await req.db.beginTransaction();

        await req.db.query(`INSERT INTO Workspace_Users (user_id, workspace_id, workspace_role)
                            VALUES (:user_id, :workspace_id, "member")`, {
                              user_id, workspace_id
                            });

        const log_desc = `Added user ${username}`;

        await req.db.query(`INSERT INTO Change_Log (edit_desc, edit_timestamp, user_id, workspace_id)
                            VALUES (:log_desc, NOW(), :user_id, :workspace_id)`, {
                                log_desc, user_id, workspace_id
                            });

        //start transaction
        await req.db.commit();

        //send email to the user to let them know they have been invited
        sendEmail(user_email, html, subject)
        res.json({success: true, msg: "Email sent"});
      } else {
        res.json({success: false, err: `User with Email: ${user_email} not Found`});
      }

 
  } catch (err) {
      console.log(err);
      res.json({success: false, err: "Internal Server Error"})
  }
}

//changes last workspace
const changeLastWorkspace = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { workspace_id } = req.body;

    await req.db.query(`UPDATE Users
                        SET last_workspace_id = :workspace_id
                        WHERE user_id = :user_id`, {
                          user_id, workspace_id
                        });

    res.json({success: true, message: 'Successfully saved last workspace'})
  } catch (err) {
    console.log(err);
    res.json({success: false, err: "Internal Server Error"});
  }
}

exports.leaveWorkspace = leaveWorkspace;
exports.changeLastWorkspace = changeLastWorkspace;
exports.deleteWorkspace = deleteWorkspace;
exports.inviteUser = inviteUser;
exports.getWorkspaceUsers = getWorkspaceUsers;
exports.createWorkspace = createWorkspace;
exports.joinWorkspace = joinWorkspace;
