//gets all recent entries for a user
const getAllEntries = async (req, res) => {
    try {

        const { user_id } = req.user

        const [entries] = await req.db.query(`SELECT entry_id, start_time, end_time, total_time, entry_desc, tag, project_id
                                          FROM Entries 
                                          WHERE user_id = :user_id AND deleted_flag = 0
                                          ORDER BY end_time DESC`, {
                                            user_id
                                          })

        res.json({success: true, data: entries});
        
    } catch (err) {
        console.log(err);
        res.json({success: false, err: "Internal server error"})
    }
}
 
const createEntry = async (req, res) => {
    try {

        const { user_id } = req.user;

        const { start_time, 
                end_time, 
                total_time, 
                entry_desc, 
                tag,
                project_id,
            } = req.body

        await req.db.query(`INSERT INTO Entries (start_time, end_time, total_time, entry_desc, tag, project_id, user_id)
                            VALUES (:start_time, :end_time, :total_time, :entry_desc, :tag, :project_id,:user_id)`, {
                            start_time, end_time, total_time, entry_desc, tag, project_id, user_id,
                            })
        res.json({success: true, message: 'Successfully created entry'})
    } catch (err) {
        res.json({success: false, err: 'Internal server error'})
        console.log(err)
    }
}

const deleteEntry = async (req, res) => {
    try {
        const { entry_id } = req.params

        const query = await req.db.query(`UPDATE Entries 
                            SET deleted_flag = 1
                            WHERE entry_id = :entry_id`, {
                            entry_id
                            })

        res.json({ success: true, query: query })
        
    } catch (err) {
        console.log(err);
        res.json({success: false, err: "Internal Server Error"})
    }
}

exports.getAllEntries = getAllEntries;
exports.createEntry = createEntry;
exports.deleteEntry = deleteEntry;
 


