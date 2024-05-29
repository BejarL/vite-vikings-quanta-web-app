require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

// Endpoint functions
const {
        signUp, signIn, getUserInfo, changePassword, sendResetPassword,
        changeUsername, changeEmail, profileChangePassword, deleteAccount
} = require('./endpoints/UserRegistration');
const {
        getAllProjects, getProjectInfo, addNewProject, deleteProject
} = require('./endpoints/Projects');
const {
        getWorkspaceUsers, changeLastWorkspace, deleteWorkspace, createWorkspace,
        removeUserFromWorkspace, leaveWorkspace, inviteUser, updateRole, updateWorkspaceName
} = require('./endpoints/Workspace');
const {
        getAllEntries, deleteEntry, updateEntry, createEntry
} = require('./endpoints/TimeTracker');
const { getAuditEntries } = require('./endpoints/Audit.js');

// Middleware
const { verifyJwt } = require('./endpoints/Middleware');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));
// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Parses JSON body
app.use(bodyParser.json());

// Adds database connection to req.db
app.use(async (req, res, next) => {
        try {
                const connection = await mysql.createConnection({
                        host: process.env.DB_HOST,
                        user: process.env.DB_USER,
                        password: process.env.DB_PASSWORD,
                        database: process.env.DB_NAME,
                });
                req.db = connection;
                next();
        } catch (error) {
                console.error('Database connection failed:', error); // Add this line
                next(error);
        }
});

/*
* User Registration - /endpoints/UserRegistration.js
*/
app.post('/signup', signUp);
app.post('/signin', signIn);
app.post('/resetpassword/send', sendResetPassword);

app.use(verifyJwt); // JWT verification middleware

app.delete('/delete-account', deleteAccount);
app.post('/resetpassword/confirm', changePassword);
app.put('/user/change-username', changeUsername);
app.put('/user/change-email', changeEmail);
app.put('/user/change-password', profileChangePassword);
app.get('/user', getUserInfo);

/* 
* Workspace endpoints - see /endpoints/Workspace.js
*/
app.get('/workspace/users/:workspace_id', getWorkspaceUsers);
app.post('/workspace/new', createWorkspace);
app.put('/workspace/remove-user', removeUserFromWorkspace);
app.put('/workspace/leave', leaveWorkspace);
app.post('/workspace/invite', inviteUser);
app.delete('/workspace/delete/:workspace_id', deleteWorkspace);
app.put('/workspace/update-last', changeLastWorkspace);
app.put('/workspace/update-role', updateRole);
app.put('/workspace/update-name', updateWorkspaceName);

/* 
* Project endpoints - see /endpoints/Projects.js
*/
app.get('/projects/all/:workspace_id', getAllProjects);
app.get('/project/:project_id', getProjectInfo);
app.post('/projects/new', addNewProject);
app.delete('/projects/delete/:project_id', deleteProject);

/* 
* TimeTracker endpoints
*/
app.get('/entries/all/:workspace_id', getAllEntries);
app.post('/entries/new', createEntry);
app.put('/entries/update', updateEntry);
app.put('/entries/delete', deleteEntry);

/*
* Endpoint for Audit Page
*/
app.get('/audit-entries/:workspace_id', getAuditEntries);

app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
});
