const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//endpoints
const { signUp, signIn, getUserInfo, changePassword, sendResetPassword, changeUsername, changeEmail, profileChangePassword, deleteAccount } = require('./endpoints/UserRegistration');
const { getRecentProjects,
  getAllProjects,
  getProjectInfo,
  addNewProject,
  deleteProject } = require('./endpoints/Projects');
const { getWorkspaceUsers, changeLastWorkspace, deleteWorkspace, createWorkspace, joinWorkspace, leaveWorkspace, inviteUser } = require('./endpoints/Workspace');
const { getAllEntries, deleteEntry, updateEntry, createEntry } = require('./endpoints/TimeTracker');

//middle ware
const { dbConnect, verifyJwt } = require('./endpoints/Middleware')

const app = express();
const port = 3000;

const corsOptions = {
  origin: "*",
  credentials: true,
  "access-control-allow-credentials": true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Makes Express parse the JSON body of any requests and adds the body to the req object
app.use(bodyParser.json());

//adds database connection to req.db
app.use((req, res, next) => dbConnect(req, res, next));

/*
*
* User Registration - /endpoints/UserRegistration.js
*
*/
app.put('/signup', (req, res) => signUp(req, res));

app.post('/signin', (req, res) => signIn(req, res));

app.post('/resetpassword/send', (req, res) => sendResetPassword(req, res));

app.use((req, res, next) => verifyJwt(req, res, next)); // middleware after signing in

app.post('/delete-account', (req, res) => deleteAccount(req, res))

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
app.post('/workspace/users', (req, res) => getWorkspaceUsers(req, res));

app.post('/workspace/new', (req, res) => createWorkspace(req, res));

app.post(`/workspace/join`, (req, res) => joinWorkspace(req, res));

app.post('/workspace/leave', (req, res) => leaveWorkspace(req, res));

app.post('/workspace/invite', (req, res) => inviteUser(req, res));

app.post('/workspace/delete', (req, res) => deleteWorkspace(req, res));

app.post('/workspace/update-last', (req, res) => changeLastWorkspace(req, res));


/* 
*
* Endpoints for Projects - see /endpoints/Projects.js
*
*/
app.post('/projects/recent', (req, res) => getRecentProjects(req, res));

app.post('/projects/all', (req, res) => getAllProjects(req, res));

app.post('/project/:project_id', (req, res) => getProjectInfo(req, res));

app.put('/projects/new', (req, res) => addNewProject(req, res));

app.delete('/projects/delete/:project_id', (req, res) => deleteProject(req, res));

/* 
*
* Endpoints for Timetracker 
*
*/
app.get('/entries/all', (req, res) => getAllEntries(req, res));

app.put('/entries/new', (req, res) => createEntry(req, res));

app.post(`/entries/update`, (req, res) => updateEntry(req, res));

app.post('/entries/delete', (req, res) => deleteEntry(req, res));

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
