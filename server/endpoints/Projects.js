const getRecentProjects = async (req, res) => {
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
}

const getAllProjects = async (req, res) => {
    try {
      const { workspace_id } = req.body;
  
      const [projects] = await req.db.query(` SELECT Projects.project_id, project_name, SUM(total_time) AS total_time
                                              FROM Projects
                                              LEFT JOIN Entries ON Projects.project_id = Entries.project_id 
                                              WHERE workspace_id = :workspace_id AND Projects.deleted_flag = 0 OR Entries.deleted_flag = 0
                                              GROUP BY Projects.project_id;`, {
                                                workspace_id
                                              })
      
      res.json({success: true, data: projects})
  
    } catch (err) {
      console.log(err);
      res.json({success: false, err: "Internal server error"});
    }
}

const getProjectInfo = async (req, res) => {

    try {
        const { project_id } = req.params

        const [data] = await req.db.query(`SELECT username, total_time, entry_desc, entry_id
                                            FROM Entries 
                                            INNER JOIN Users ON Entries.user_id = Users.user_id
                                            WHERE project_id = :project_id AND Entries.deleted_flag = 0
                                            ORDER BY Entries.end_time DESC`, { 
                                            project_id
                                        })

        res.json({success: true, data: data})

    } catch (err) {
        console.log(err);
        res.json({success: false, err: "Internal Server Error"})
    }
}

const addNewProject = async (req, res) => {
    try {
  
      //gets the workspace id and project name
      const { workspace_id, project_name } = req.body;
  
      //inserts a new row in the db for the new project
      await req.db.query(`INSERT INTO Projects (project_name, workspace_id)
                                          VALUES (:project_name, :workspace_id)`, {
                                              project_name,  workspace_id
                                            });
  
      res.json({ success: true });
     
    } catch(err) {
      res.json({ success: false, err: "Internal Server Error" })
      console.log(err)
    }
}

const deleteProject = async (req, res) => {
    try {
      //get project id to delete from the url
      const { project_id } = req.params
  
  
      //begin transaction
      await req.db.beginTransaction();
  
      // checks projects table and entries table
      // updates deleted_flag of project to 1
       await req.db.query(`UPDATE Projects 
                           SET deleted_flag = 1 
                           WHERE project_id = :project_id `, {
                           project_id 
                         })
                         
       await req.db.query(`UPDATE Entries 
                           SET deleted_flag = 1 
                           WHERE project_id = :project_id `, {
                           project_id 
                         })
  
      //commit the transaction
      await req.db.commit();
  
      res.json({success: true })
  
    } catch (err) {
      console.log(err);
      res.json({success: false, err: "internal server error"})
    }
}

exports.getRecentProjects = getRecentProjects;
exports.getAllProjects = getAllProjects;
exports.getProjectInfo = getProjectInfo;
exports.addNewProject = addNewProject;
exports.deleteProject = deleteProject;
  