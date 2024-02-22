global.DEBUG = true;

const fs = require("fs");

const { initializeApp, displayInitConfigStatus } = require('./init.js');
const { configApp } = require('./config.js');
const { tokenApp } = require('./token.js');

const allHelp = `myapp <command> <option>

Usage:

myapp --help                            displays all help

myapp init --help                       displays help for the init command
myapp init --all                        creates the folder structure and the config and help files
myapp init --mk                         creates the folder structure 
myapp init --cat                        creates the config file with default settings and the help files

myapp config --help                     displays help for the config command
myapp config --show                     displays a list of the current config settings
myapp config --reset                    resets the config file with default settings
myapp config --set <option> <value>     sets a specific config setting

myapp token --help                      displays help for the token command
myapp token --count                     displays a count of the tokens created
myapp token --new <username>            generates a token for a given username, saves tokens to the json file
myapp token --upd p <username> <phone>  updates the json entry with a new phone number
myapp token --upd e <username> <email>  updates the json entry with a new email
myapp token --search u <username>       fetches a token for a given username
myapp token --search e <email>          fetches a token for a given email
myapp token --search p <phone>          fetches a token for a given phone number
`;

const myArgs = process.argv.slice(2);
// console.log(myArgs);

console.log("\nWelcome to myApp!\n")


if(DEBUG) if(myArgs.length >= 1) console.log('the index args = ', myArgs);

switch (myArgs[0]) {
  case 'init':
  case 'i':
      if(DEBUG) console.log(myArgs[0], ' - initialize the app');
      initializeApp();
      break;
  case 'config':
  case 'c':
      if(DEBUG) console.log(myArgs[0], ' - display the configuration file');
      configApp();
      break;
  case 'token':
  case 't':
      if(DEBUG) console.log(myArgs[0], ' - generate, update, or search user tokens');
      tokenApp();  
      break;  
  case '--help':
  case '--h':
  default:
      console.log(allHelp);
      displayInitConfigStatus();      
};

