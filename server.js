const express = require('express');
const app = express();
const port = 3000;

const {newToken} = require('./token')

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set view engine to ejs
app.set('view engine', 'ejs');


// Define home route
app.get('/', async (req, res) => {

    // Get the username, phoneNum and email from the query parameters
    const username = req.query.username;
    const phoneNum = req.query.phoneNum;
    const email = req.query.email;

    if (!username && !phoneNum && !email) {
        res.render('index', {token: '', errorDisplay: ''});
    } else {
        if (!username | !phoneNum | !email){
            res.render('index', {token: '', errorDisplay: 'You must enter a valid username, phone number and email.'});
        } else {
            try{
                const token = await newToken(username, phoneNum, email);
                if(token == undefined){
                    res.render('index', {token:``, errorDisplay: `Error - username "${username}" already exists.`});
                } else{
                    res.render('index', {token:`Your new token is: ${token}`, errorDisplay: ''});
                }
            } catch (error){
                console.log(error)
            }
        }
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});