const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//endpoint functions
const { signUp, 
        signIn, 
        getUserInfo, 
        changePassword, 
        sendResetPassword, 
        changeUsername, 
        changeEmail, 
        profileChangePassword, 
        deleteAccount } = require('./endpoints/UserRegistration');
const { getAllProjects, 
        getProjectInfo, 
        addNewProject, 
        deleteProject } = require('./endpoints/Projects');
const { getWorkspaceUsers, 
        changeLastWorkspace, 
        deleteWorkspace, 
        createWorkspace, 
        removeUserFromWorkspace, 
        leaveWorkspace,
        inviteUser, 
        updateRole,
        updateWorkspaceName } = require('./endpoints/Workspace');
const { getAllEntries, 
        deleteEntry, 
        updateEntry, 
        createEntry } = require('./endpoints/TimeTracker');
const { getAuditEntries } = require('./endpoints/Audit.js');

//middle ware
const { dbConnect, verifyJwt } = require('./endpoints/Middleware');


const app = express();
const port = 3000;

const corsOptions = {
        origin: "https://vite-vikings-quanta-web-app.vercel.app/",
        credentials: true,
        optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Parses JSON body
app.use(bodyParser.json());

// Adds database connection to req.db
app.use((req, res, next) => dbConnect(req, res, next)); 

/*
*
* User Registration - /endpoints/UserRegistration.js
*
*/
app.post('/signup', (req, res) => signUp(req, res));

app.post('/signin', (req, res) => signIn(req, res));

app.post('/resetpassword/send', (req, res) => sendResetPassword(req, res));

app.use((req, res, next) => verifyJwt(req, res, next)); // middleware after signing in

app.delete('/delete-account', (req, res) => deleteAccount(req, res));

app.post('/resetpassword/confirm', (req, res) => changePassword(req, res));

app.put('/user/change-username', (req, res) => changeUsername(req, res));

app.put('/user/change-email', (req, res) => changeEmail(req, res));

app.put('/user/change-password', (req, res) => profileChangePassword(req, res));

app.get('/user', (req, res) => getUserInfo(req, res));



/* 
*
*   Workspace endpoints - see /endpoints/Workspace.js
*
*/
app.get('/workspace/users/:workspace_id', (req, res) => getWorkspaceUsers(req, res));

app.post('/workspace/new', (req, res) => createWorkspace(req, res));

app.put('/workspace/remove-user', (req, res) => removeUserFromWorkspace(req, res));

app.put('/workspace/leave', (req, res) => leaveWorkspace(req, res));

app.post('/workspace/invite', (req, res) => inviteUser(req, res));

app.delete('/workspace/delete/:workspace_id', (req, res) => deleteWorkspace(req, res));

app.put('/workspace/update-last', (req, res) => changeLastWorkspace(req, res));

app.put('/workspace/update-role', (req, res) => updateRole(req, res));

app.put('/workspace/update-name', (req, res) => updateWorkspaceName(req, res));


/* 
*
* Endpoints for Projects - see /endpoints/Projects.js
*
*/
//app.get('/projects/recent/:workspace_id', (req, res) => getRecentProjects(req, res));

app.get('/projects/all/:workspace_id', (req, res) => getAllProjects(req, res));

app.get('/project/:project_id', (req, res) => getProjectInfo(req, res));

app.post('/projects/new', (req, res) => addNewProject(req, res));

app.delete('/projects/delete/:project_id', (req, res) => deleteProject(req, res));

/* 
*
* Endpoints for Timetracker 
*
*/
app.get('/entries/all/:workspace_id', (req, res) => getAllEntries(req, res));

app.post('/entries/new', (req, res) => createEntry(req, res));

app.put(`/entries/update`, (req, res) => updateEntry(req, res));

// uses put instead of delete since we're using req.body
app.put('/entries/delete/', (req, res) => deleteEntry(req, res));

/*
*
*
*Endpoint for Audit Page
*
*/
app.get('/audit-entries/:workspace_id', (req, res) => getAuditEntries(req, res));

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
