const { sendInvite } = require('./Mailer');

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

  // delete a workspace

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

    await req.db.query(`INSERT INTO Workspace_Users (user_id, workspace_role, workspace_id)
                        VALUES (:user_id, "member", :workspace_id)`, {
                          user_id, workspace_id
                        });

    res.json({ success: true, message: "Successfully Added to workspace"});
    
  } catch (err) {
    console.log(err);
    res.json({success: false, err: "Internal server error"})
  }
}

//is used to invite users to a workspace
const inviteUser = async (req, res) => {
  try {
      const { email } = req.body;

      //need to make sure the email is associated with a user
      const [[query]] = await req.db.query(`SELECT user_id 
                                            FROM Users
                                            WHERE email = :email`, {
                                              email
                                            })

      if (query) {
        sendInvite(email)
        res.json({success: true, msg: "User Exists"});
      } else {
        res.json({success: false, err: `User with Email: ${email} not Found`});
      }
 
  } catch (err) {
      console.log(err);
      res.json({success: false, err: "Internal Server Error"})
  }
}
 
exports.inviteUser = inviteUser;
exports.getWorkspaceUsers = getWorkspaceUsers;
exports.createWorkspace = createWorkspace;
exports.joinWorkspace = joinWorkspace;
