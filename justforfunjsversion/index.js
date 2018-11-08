"use strict";
const FILENAME = 'db.json';

const fs = require('fs');


const args = process.argv;
args.shift();
args.shift();

const command = args.shift();

const commands = require('./commands.js');
const { Route, checkRoutes } = require('./routes.js');

let jsonDB = '';
try {
  jsonDB = fs.readFileSync(FILENAME);
} catch(e){
  console.log('WARNING: No database found, created new database');
  jsonDB = JSON.stringify({ routes: [], ticketCounter: 0 });
}

let db;
try {
  db = JSON.parse(jsonDB);
  db.routes = db.routes.map(route => Route.fromObj(route));
} catch(e){
  console.log('ERROR: Database was unreadable');
  process.exit();
}




if(commands[command]){
  db = checkRoutes(db);
  args.unshift(db);
  const newDB = commands[command].apply(null, args) || db;
  newDB.routes = newDB.routes.map(route => route.toObj());
  try {
    fs.writeFileSync(FILENAME, JSON.stringify(newDB));
  } catch(e){
    console.log('ERROR: Could not write to database');
  }
} else {
  console.log('ERROR: Command not found');
  process.exit();
}
