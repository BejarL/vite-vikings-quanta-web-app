//gets all recent entries for a user
const getAllEntries = async (req, res) => {
    try {
        const { user_id } = req.user

        const [entries] = await req.db.query(`SELECT entry_id, start_time, end_time, entry_desc, tag, project_id,
                                              TIMEDIFF(end_time, start_time) AS total_time
                                              FROM Entries 
                                              WHERE user_id = :user_id AND deleted_flag = 0
                                              ORDER BY end_time DESC`, {
            user_id
        });

        res.json({ success: true, entries: entries });

    } catch (err) {
        console.log(err);
        res.json({ success: false, err: "Internal server error" })
    }
}

// create new entry
const createEntry = async (req, res) => {
    try {
        //get variables to be used
        const { user_id } = req.user;
        const { start_time,
            end_time,
            entry_desc,
            tag,
            project_id,
            workspace_id
        } = req.body;

        //check if all the data needed is entered
        if (!start_time || !end_time || !entry_desc || !project_id || !workspace_id) {
            res.json({success: false, err: "Missing information"});
            return;
        }

        //create date objects for mysql with dates from query
        let insertStartDate = new Date(start_time);
        let insertEndDate = new Date(end_time);

        //begin transaction to ensure both queries both pass or both fail
        await req.db.beginTransaction();

        //insert the entry
        await req.db.query(`INSERT INTO Entries (start_time, end_time, entry_desc, tag, project_id, user_id)
                            VALUES (:insertStartDate, :insertEndDate, :entry_desc, :tag, :project_id,:user_id)`, {
            insertStartDate, insertEndDate, entry_desc, tag, project_id, user_id,
        })

        //add to the change log
        await req.db.query(`INSERT INTO Change_Log (edit_desc, edit_timestamp, user_id, workspace_id, project_id)
                            VALUES ("Created an Entry", NOW(), :user_id, :workspace_id, :project_id)`, {
            user_id, workspace_id, project_id
        });

        //start transaction
        await req.db.commit();

        res.json({ success: true, message: 'Successfully created entry' })
    } catch (err) {
        res.json({ success: false, err: 'Internal server error' })
        console.log(err)
    }
}

const updateEntry = async (req, res) => {
    try {

        const { user_id } = req.user

        const { entry_id, start_time, end_time, entry_desc, project_id, workspace_id } = req.body

        //need to figure out what to change, so we build a string below.
        //we start with nothing, then check each value sent. if there is data, then we add onto the update variable to insert into the query
        //We always check the length of the string, to determine if we need to add a comma in front of the to be added string.
        let update = ``;

        if (start_time) {
            if (update.length != 0) {
                update += `,`
            }
            update += `start_time = :start_time `
        }
        if (end_time) {
            if (update.length != 0) {
                update += `,`
            }
            update += `end_time = :end_time `
        }
        if (entry_desc) {
            if (update.length != 0) {
                update += `,`
            }
            update += `entry_desc = :entry_desc `
        }
        if (project_id) {
            if (update.length != 0) {
                update += `,`
            }
            update += `project_id = :project_id `
        }

        //uses transaction, so both queries happen or both dont
        await req.db.beginTransaction();

        await req.db.query(`UPDATE Entries 
                            SET ${update}
                            WHERE entry_id = :entry_id`, {
            entry_id, start_time, end_time, entry_desc, project_id
        });

        await req.db.query(`INSERT INTO Change_Log (edit_desc, edit_timestamp, user_id, workspace_id, project_id)
                        VALUES ("Edited an Entry", NOW(), :user_id, :workspace_id, :project_id)`, {
            user_id, workspace_id, project_id
        });

        //start transaction
        await req.db.commit();

        res.json({ sucess: true });

    } catch (err) {
        console.log(err);
        res.json({ success: false, err: "Internal Server Error" });
    }
}

const deleteEntry = async (req, res) => {
    try {
        const { entry_id, workspace_id, project_id } = req.body;

        //begin transaction, so both queries happen or both dont
        await req.db.beginTransaction()

        const query = await req.db.query(`UPDATE Entries 
                            SET deleted_flag = 1
                            WHERE entry_id = :entry_id`, {
            entry_id
        })

        await req.db.query(`INSERT INTO Change_Log (edit_desc, edit_timestamp, user_id, workspace_id, project_id)
                            VALUES ("Deleted an Entry", NOW(), :user_id, :workspace_id, :project_id)`, {
            user_id, workspace_id, project_id
        });

        //start the transaction
        await req.db.commit();

        res.json({ success: true, query: query })

    } catch (err) {
        console.log(err);
        res.json({ success: false, err: "Internal Server Error" })
    }
}

exports.getAllEntries = getAllEntries;
exports.createEntry = createEntry;
exports.updateEntry = updateEntry;
exports.deleteEntry = deleteEntry;



