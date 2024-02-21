const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const folders = ['models', 'views', 'routes', 'logs', 'json', 'docs', 'public'];
const subfolders = ['css', 'js', 'img'];

const configjson = { 
  name: 'MyAppCLI',
  version: '1.0.0',
  description: 'The Command Line Interface (CLI) for the MyApp.',
  main: 'myapp.js',
  superuser: 'adm1n',
  database: 'exampledb'
};

// const tokenjson = [{
//   created: '1969-01-31 12:30:00',
//   username: 'username',
//   email: 'user@example.com',
//   phone: '5556597890',
//   token: 'token',
//   expires: '1969-02-03 12:30:00',
//   confirmed: 'tbd'
// }];

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

const initHelp = `myapp <command> <option>

Usage:

myapp init --help       displays help for the init command
myapp init --all        creates the folder structure and the config and help files
myapp init --mk         creates the folder structure 
myapp init --cat        creates the config file with default settings and the help files
`;

const configHelp = `myapp <command> <option>

Usage:

myapp config --help                     displays help for the config command
myapp config --show                     displays a list of the current config settings
myapp config --reset                    resets the config file with default settings
myapp config --set <option> <value>     sets a specific config setting
`;

const tokenHelp = `myapp <command> <option>

Usage:

myapp token --help                      displays help for the token command
myapp token --count                     displays a count of the tokens created
myapp token --new <username>            generates a token for a given username, saves tokens to the json file
myapp token --upd p <username> <phone>  updates the json entry with a new phone number
myapp token --upd e <username> <email>  updates the json entry with a new email
myapp token --search u <username>       fetches a token for a given username
myapp token --search e <email>          fetches a token for a given email
myapp token --search p <phone>          fetches a token for a given phone number
`;

const files = ['config.json', 'allHelp.txt', 'initHelp.txt', 'configHelp.txt', 'tokenHelp.txt']


const myArgs = process.argv.slice(2);
// console.log(myArgs);

function initializeApp() {
    if(DEBUG) console.log('initializeApp()');


    switch (myArgs[1]) {
    case '--all':
        if(DEBUG) console.log('--all createFolders() & createFiles()');
        createFolders();
        createFiles();
        setTimeout(()=>{displayInitConfigStatus();}, 3)
        break;
    case '--cat':
        if(DEBUG) console.log('--cat createFiles()');
        createFiles();
        setTimeout(()=>{displayInitConfigStatus();}, 3)
        break;
    case '--mk':
        if(DEBUG) console.log('--mk createFolders()');
        createFolders();
        setTimeout(()=>{displayInitConfigStatus();}, 3)
        break;
    case '--help':
    case '--h':
    default:
        console.log(initHelp);
        setTimeout(()=>{displayInitConfigStatus();}, 3)
    }
}

function createFolders() {
    if(DEBUG) console.log('init.createFolders()');
    let mkcount = 0;
    folders.forEach(element => {
        if(DEBUG) console.log(element);
        try {
            if(!fs.existsSync(path.join(__dirname, element))) {
                fsPromises.mkdir(path.join(__dirname, element));
                mkcount++;
            }
        } catch (err) {
            console.log(err);
        }
    });
    let subfolderCount = 0
    subfolders.forEach(element => {
        if(DEBUG) console.log(element);
        try {
            if(!fs.existsSync(path.join(__dirname, "public", element))) {
                fsPromises.mkdir(path.join(__dirname, "public", element));
                subfolderCount++;
            }
        } catch (err) {
            console.log(err);
        }
    });

    if(mkcount === 0) {
        console.log('All base folders already exist.');
    }
    if (mkcount <= folders.length) {
        console.log(mkcount + ' of ' + folders.length + ' base folders were created.');
    }
    if (subfolderCount === 0){
        console.log('All subfolders already exist.')
    }
    if (subfolderCount <= subfolders.length){
        console.log(subfolderCount + ' of ' + subfolders.length + ' subfolders were created.')
    }
    console.log("Create folders complete.")
    
};


function createFiles() {
    if(DEBUG) console.log('init.createFiles()');
    try {
        let configdata = JSON.stringify(configjson, null, 2);
        if(!fs.existsSync(path.join(__dirname, './json/config.json'))) {
            fs.writeFile('./json/config.json', configdata, (err) => {
                if(err) {
                    console.log(err)
                }
                else {
                    console.log('Data written to config file.');
                }
            })
        } else {
        console.log('config file already exists.');
        }

        if(!fs.existsSync(path.join(__dirname, './docs/all-help.txt'))) {
            fs.writeFile('./docs/all-help.txt', allHelp, (err) => {
                if(err) {
                    console.log(err)
                }
                else {
                    console.log('Data written to all-help file.');
                }
            })
        } else {
        console.log('all-help file already exists.');
        }

        if(!fs.existsSync(path.join(__dirname, './docs/init-help.txt'))) {
            fs.writeFile('./docs/init-help.txt', initHelp, (err) => {
                if(err) {
                    console.log(err)
                }
                else {
                    console.log('Data written to init-help file.');
                }
            })
        } else {
        console.log('init-help file already exists.');
        }

        if(!fs.existsSync(path.join(__dirname, './docs/config-help.txt'))) {
            fs.writeFile('./docs/config-help.txt', configHelp, (err) => {
                if(err) {
                    console.log(err)
                }
                else {
                    console.log('Data written to config-help file.');
                }
            })
        } else {
        console.log('config-help file already exists.');
        }

        if(!fs.existsSync(path.join(__dirname, './docs/token-help.txt'))) {
            fs.writeFile('./docs/token-help.txt', tokenHelp, (err) => {
                if(err) {
                    console.log(err)
                }
                else {
                    console.log('Data written to token-help file.');
                }
            })
        } else {
        console.log('token-help file already exists.');
        }
    
    //   let tokendata = JSON.stringify(tokenjson, null, 2);
    //   if(!fs.existsSync(path.join(__dirname, './json/token.json'))) {
    //     fs.writeFile('./json/token.json', tokendata, (err) => {
    //       if(err) {
    //         console.log(err)
    //       } else {
    //         console.log('Data written to token file.');
    //       }
    //     }
    //     );
    // } else {
    //   console.log('token file already exists.');
    // }
        setTimeout(()=>{
            console.log("Create files complete.")
        }, 3)
        
    } catch(err) {
        console.log(err);
    }

};


// Function to check status
function displayInitConfigStatus(){
    // check to see if base folders are in place...
    folderCnt = 0
    folders.forEach(element => {
        if (fs.existsSync(path.join(__dirname, element))){
            // console.log(`${element} has been created.`)
            folderCnt++;
        } else {
            // console.log(`The folder called "${element}" has yet to be created.`)
        }
    });
    
    // check to see if subfolders are in place...
    subfolderCnt = 0
    subfolders.forEach(element=>{
        if (fs.existsSync(path.join(__dirname, "public", element))){
            // console.log(`${element} has been created.`)
            subfolderCnt++
        } else{
            // console.log(`The subfolder called "${element}" has yet to be created.`)
        }
    })

    // check to see if files are created...
    let fileCount = 0
    if(fs.existsSync(path.join(__dirname, "docs", "all-help.txt"))){
        // console.log(`The file called "allHelp.txt" already exists.`)
        fileCount++;
    } else{
        // console.log(`The file called "allHelp.txt" has yet to be created.`)
    }

    if(fs.existsSync(path.join(__dirname, "docs", "init-help.txt"))){
        // console.log(`The file called "initHelp.txt" already exists.`)
        fileCount++;
    } else{
        // console.log(`The file called "initHelp.txt" has yet to be created.`)
    }

    if(fs.existsSync(path.join(__dirname, "docs", "config-help.txt"))){
        // console.log(`The file called "configHelp.txt" already exists.`)
        fileCount++;
    } else{
        // console.log(`The file called "configHelp.txt" has yet to be created.`)
    }

    if(fs.existsSync(path.join(__dirname, "docs", "token-help.txt"))){
        // console.log(`The file called "tokenHelp.txt" already exists.`)
        fileCount++;
    } else{
        // console.log(`The file called "tokenHelp.txt" has yet to be created.`)
    }

    if(fs.existsSync(path.join(__dirname, "json", "config.json"))){
        // console.log(`The file called "config.json" already exists.`)
        fileCount++;
    } else{
        // console.log(`The file called "config.json" has yet to be created.`)
    }

    if (fileCount == files.length && subfolderCnt == subfolders.length && folderCnt == folders.length){
        console.log("All folders and files have been created. Initilization and configuration is complete!")
    } else if (fileCount == 0 && subfolderCnt == 0 && folderCnt == 0){
        console.log("Initilization has not been started - No folders or files have been created - Please continue with setup of app by running `node myapp init --all`.")
    } else {
        console.log("Initilization has been started but not finished... ")
        console.log(`${folderCnt} of ${folders.length} base folders have been created.`)
        console.log(`${subfolderCnt} of ${subfolders.length} subfolders have been created.`)
        console.log(`${fileCount} of ${files.length} files have been created.`)
    }
  }

module.exports = {
    initializeApp,
    configjson,
    displayInitConfigStatus
};