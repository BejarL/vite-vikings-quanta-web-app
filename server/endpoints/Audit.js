const getAuditEntries = async (req, res) => {
  try {

    //get workspace id from params
    const { workspace_id } = req.params;
 
    //get limit and page number to limit the number of items returned per page
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
  
    //joins the change log with the users table to get username, and joins with projects table to get project name.
    const [query] = await req.db.query(`SELECT edit_id, edit_desc, edit_timestamp, Users.user_id, Users.username, Projects.project_name
                                        FROM Change_Log
                                        INNER JOIN Users ON Users.user_id = Change_Log.user_id 
                                        LEFT JOIN Projects ON Projects.project_id = Change_Log.project_id
                                        WHERE Change_Log.workspace_id = :workspace_id
                                        ORDER BY edit_timestamp DESC
                                        LIMIT :limit OFFSET :offset`, {
                                          workspace_id, limit, offset
                                        });

    // query to get total number of possible pages
    const [[{ pages }]] = await req.db.query(`SELECT COUNT(*) AS pages
                                        FROM Change_Log
                                        WHERE workspace_id = :workspace_id`, {
                                          workspace_id
                                        });
    const maxPages = Math.ceil(pages/limit);

    res.json({success: true, entries: query, maxPages});                    

  } catch (err) {
    console.log(err);
    res.json({success: false, err: "Internal Server Error"});
  }
}

exports.getAuditEntries = getAuditEntries;