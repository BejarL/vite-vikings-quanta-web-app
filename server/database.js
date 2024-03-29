// CREATE SCHEMA Quanta;

// USE Quanta; 

// CREATE TABLE Users ( user_id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL, 
// 					 username VARCHAR(20) NOT NULL,
//                      email VARCHAR(50) NOT NULL,
//                      password BLOB NOT NULL,
//                      profile_pic BLOB);
                     
// CREATE TABLE Workspace ( workspace_id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
// 						 workspace_name VARCHAR(50) NOT NULL);
                         
// CREATE TABLE Projects ( project_id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
// 						project_name VARCHAR(50) NOT NULL,
//                         workspace_id INTEGER,
//                         FOREIGN KEY (workspace_id) REFERENCES Workspace (workspace_id)
// 					);

// CREATE TABLE Entries (entry_id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
// 					  start_time DATETIME NOT NULL,
//                       end_time DATETIME NOT NULL,
//                       total_time INTEGER NOT NULL,
//                       entry_desc VARCHAR(255) NOT NULL,
//                       tag VARCHAR(50), 
//                       project_id INTEGER NOT NULL, 
//                       user_id INTEGER NOT NULL,
//                       FOREIGN KEY (project_id) REFERENCES Projects (project_id),
//                       FOREIGN KEY (user_id) REFERENCES Users (user_id)
//                       );
                      
// CREATE TABLE Workspace_Users (workspace_user_id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
// 							  user_id INTEGER NOT NULL,
//                               workspace_id INTEGER NOT NULL,
//                               workspace_role VARCHAR(20),
//                               FOREIGN KEY (user_id) REFERENCES Users (user_id),
//                               FOREIGN KEY (workspace_id) REFERENCES Workspace (workspace_id)
//                               );
                      
