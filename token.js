const fs = require('fs');

const crc32 = require('crc/crc32');
const { format } = require('date-fns');

const myArgs = process.argv.slice(2);

function tokenList() {
    if (DEBUG) console.log('token.tokenList()');
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if (error) throw error; 
        let tokens = JSON.parse(data);
        console.log();
        console.log('** Username/Token List **')
        console.log('-------------------------')
        tokens.forEach(obj => {
            console.log(`* ${obj.username} / ${obj.token} / ${obj.phone} / ${obj.email}`);
        });
    });
};

function tokenCount() {
    if (DEBUG) console.log('token.tokenCount()');
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if (error) throw error;
        let tokens = JSON.parse(data);
        console.log(`Total Tokens Count: ${tokens.length - 1}`); // -1 to remove template entry
    });
};

function newToken(username) {
    if (DEBUG) console.log('token.newToken()');
        let newToken = JSON.parse(`{
                "created": "1969-01-31 12:30:00",
                "username": "username",
                "email": "user@example.com",
                "phone": "5556597890",
                "token": "token",
                "expires": "1969-02-03 12:30:00",
                "confirmed": "tbd"
            }`);
    
    let now = new Date();
    let expires = addDays(now, 3);
  
    newToken.created = `${format(now, 'yyyy-MM-dd HH:mm:ss')}`;
    newToken.username = username;
    newToken.token = crc32(username).toString(16);
    newToken.expires = `${format(expires, 'yyyy-MM-dd HH:mm:ss')}`;
  
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if (error) throw error; 
        let tokens = JSON.parse(data);
        tokens.push(newToken);
        userTokens = JSON.stringify(tokens);
    
        fs.writeFile(__dirname + '/json/tokens.json', userTokens, (error) => {
            if (error){ 
                console.log(error);
            }else { 
                console.log(`New token ${newToken.token} created for ${username} is set to expire on ${expires}.`);
            };
        });        
    });
    return newToken.token;
};

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

function updateEntry(type, username, newValue) {
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if (error) throw error;
        let tokens = JSON.parse(data);

        // Find the user based on username
        let user = tokens.find(obj => obj.username === username);

        if(user) {
            switch (type) {
                case 'p':
                    user.phone = newValue;
                    break;
                case 'e':
                    user.email = newValue;
                    break;
                default:
                    console.log('Invalid type for update. Use "p" for phone or "e" for email.');
                    return;
            };
          
            fs.writeFile(__dirname + '/json/tokens.json', JSON.stringify(tokens, null, 2), (error) => {
                if(error) {
                    console.error(error);
                }else {
                    console.log(`Entry for ${username} updated successfully.`);
                };
            });
        }else {
            console.log(`Token entry for ${username} not found.`);
        };
    });
};

const command = myArgs[1];
  
function tokenApp() {
    if (DEBUG) console.log('tokenApp()');
  
    switch (command) {
    case '--count':
        if (DEBUG) console.log('--count');
            tokenCount();
            break;
    case '--list':
        if (DEBUG) console.log('--list');
            tokenList();
            break; 
    case '--new':
        if (myArgs.length < 3) {
            console.log('invalid syntax. node myapp token --new [username]')
        }else {
            if(DEBUG) console.log('--new');
            newToken(myArgs[2]);
        }
        break;
    case '--upd':
        const type = myArgs[2];
        if(myArgs.length <5 || (type !== 'p' && type !== 'e')) {
            console.log ('invalid syntax. Usage: node myapp token --upd [p/e] [username] [new value]')
        }else {        
            if (DEBUG) console.log (`--upd ${type}`)
            updateEntry(type, myArgs[3], myArgs[4]);
        } 
        break;
    case '--help':
    case '--h':
    default:
        fs.readFile(__dirname + "/docs/token-help.txt", (error, data) => {
            if (error) throw error;              
                console.log(data.toString());
        });
    };
};
  
module.exports = {
tokenApp};


