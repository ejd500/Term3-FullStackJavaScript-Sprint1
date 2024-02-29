const fs = require('fs').promises; 

const crc32 = require('crc/crc32');
const { format } = require('date-fns');

const myArgs = process.argv.slice(2);

async function tokenList() {
    if (DEBUG) console.log('token.tokenList()');
    try{
       let data = await fs.readFile(__dirname + '/json/tokens.json', 'utf-8');
            let tokens = JSON.parse(data);
            console.log();
            console.log('** Username/Token List **');
            console.log('-------------------------');
            tokens.forEach(token => {
                console.log(`* ${token.username} / ${token.token} / ${token.phone} / ${token.email}`);
            });
    }catch(error){
        console.log('Error retreiving token list', error);
    };
};

async function tokenCount() {
    if (DEBUG) console.log('token.tokenCount()');
    try{
        let data = await fs.readFile(__dirname + '/json/tokens.json', 'utf-8');
            let tokens = JSON.parse(data);
            console.log(`Total Tokens Count: ${tokens.length - 1}`); // -1 to remove template entry
    }catch(error){
        console.log('Error retreiving token count', error);
    };
};

async function newToken(username, phoneNum, email) {
//     if (DEBUG) console.log('token.newToken()');
    try{
        let newToken = JSON.parse(`{
                "created": "XXXX-XX-XX 00:00:00",
                "username": "${username}",
                "email": "${email}",
                "phone": "${phoneNum}",
                "token": "token",
                "expires": "XXXX-XX-XX 00:00:00",
                "confirmed": "tbd"
            }`);
            
            let now = new Date();
            let expires = addDays(now, 3);
        
            newToken.created = `${format(now, 'yyyy-MM-dd HH:mm:ss')}`;
            newToken.username = username;
            newToken.email = email;
            newToken.phone = phoneNum;
            newToken.token = crc32(username).toString(16);
            newToken.expires = `${format(expires, 'yyyy-MM-dd HH:mm:ss')}`;
            
            let data = await fs.readFile(__dirname + '/json/tokens.json', 'utf-8');
            let tokens = JSON.parse(data);

            let existingUser = tokens.find(token => token.username === username);
            if (existingUser) {
                throw new Error(`Username "${username}" already exists`);
            }

            tokens.push(newToken);
            let userTokens = JSON.stringify(tokens);
        
            await fs.writeFile(__dirname + '/json/tokens.json', userTokens);
            console.log(`New token ${newToken.token} created for ${username} is set to expire on ${expires}.`);
            return newToken.token;

    }catch(error){
        console.log('Error creating new token... ', error);
    };
};

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

async function updateTokens(type, username, newValue) {
    if(DEBUG)console.log('token - token.uodateEntry()')
    try{
        let data = await fs.readFile(__dirname + '/json/tokens.json', 'utf-8');
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
          
                await fs.writeFile(__dirname + '/json/tokens.json', JSON.stringify(tokens, null, 2));
                console.log(`Entry for ${username} updated successfully.`);
        
        }else{
            console.log(`Token entry for ${username} not found.`);
        };
    }catch(error){
        console.log('Error updating user', error);
    };
};

async function searchTokens(searchType, userEntry) {
    try{
        let data = await fs.readFile(__dirname + '/json/tokens.json', 'utf-8');
        let tokens = JSON.parse(data);

        // Filter users based on the search type

        let filteredUsers = tokens.filter(token => {
            switch (searchType) {
                case 'u': 
                    return token.username === userEntry;
                case 'e': 
                    return token.email === userEntry;
                case 'p': 
                    return token.phone === userEntry;
                default:
                    console.log('Invalid search type.[u/e/p]');
                    return false;
            };
        });

        switch (searchType) {
            case 'u':
                console.log(`Search results for username: ${userEntry}`);
                console.log('----------------------------')
                break;
            case 'e':
                console.log(`Search results for email: ${userEntry}`);
                console.log('-------------------------')
                break;
            case 'p':
                console.log(`Search results for phone number: ${userEntry}`);
                console.log('--------------------------------')
                break;
            default:
                console.log('Invalid search type.');
                return;
        };

        if (filteredUsers.length === 0) {
            console.log('No matching users found.');
        }else {
            filteredUsers.forEach(token => {
                console.log(`Username: ${token.username} / Token: ${token.token} / Phone: ${token.phone} / Email: ${token.email}`);
            });
        };
    }catch(error){
        console.log('Error searching tokens', error);
    };
};

const command = myArgs[1];
  
async function tokenApp() {
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
            console.log('invalid syntax. Usage: node myapp token --new [username] [phone number] [email]');
        }else {
            if(DEBUG) console.log('--new');
            newToken(myArgs[2], myArgs[3], myArgs[4]);
        };
        break;
    case '--upd':
        const type = myArgs[2];
        if(myArgs.length <5 || (type !== 'p' && type !== 'e')) {
            console.log ('invalid syntax. Usage: node myapp token --upd [p/e] [username] [new value]')
        }else {        
            if (DEBUG) console.log (`--upd ${type}`)
            updateTokens(type, myArgs[3], myArgs[4]);
        }; 
        break;
    case '--search':
        const searchType = myArgs[2];
        if(myArgs.length <4 || (searchType !== 'u' && searchType !== 'p' && searchType !== 'e')) {
            console.log ('invalid syntax. Usage: node myapp token --search [u/p/e] [value]')
        }else {        
            if (DEBUG) console.log (`--upd ${searchType}`)
            searchTokens(searchType, myArgs[3]);
        }; 
        break;
    case '--help':
    case '--h':
    default:
        try{
            let data = await fs.readFile(__dirname + "/docs/token-help.txt");             
            console.log(data.toString());
        }catch(error){
            console.log('Error displaying help', error);
        };
    };
};
  
module.exports = {
tokenApp,
newToken,
};


