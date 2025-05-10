Hello Everyone....! Please read before you run this project.
For your references please see the files folder and read each document carefully

This is the Project Structure:- 
Blog post manager/
├── client/    # React frontend
├── server/    # Express backend
└── README.md

Before you start you need this in local system
Requirements:-
-  Node.js (v14 or higher recommended)
-  MySQL Server
-  npm

Installation & Setup
Clone the repository:
git clone  https://github.com/bnr1432/Blog-Post-Manager.git
cd "Blog Post Manager"

There will be one file Blog post.sql
open that file in mysql workbench inside execute all tables and insert some data if you needed.

create one .env file inside server folder
Write this commands inside that file
<
DB_HOST=localhost
DB_USER=<Your_user_root>
DB_PASSWORD=<Your_db_password>
DB_NAME=<Your_database_name>
PORT=<your_port>
>

Now open any code editor 
Open vscode :-
open terminal follow the commands:-
cd client
npm install

open another terminal follow the commands:-
cd server
npm install

Start frontend React app:
npm start

Start backend server:
node server.js





