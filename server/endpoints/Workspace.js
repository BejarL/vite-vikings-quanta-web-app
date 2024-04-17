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

  exports.getWorkspaceUsers = getWorkspaceUsers;