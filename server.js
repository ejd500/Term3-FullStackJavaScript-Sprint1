const express = require('express');
const app = express();
const port = 3000;

const {newToken} = require('./token')

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.set('view engine', 'ejs');


// Define routes
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
        }
        const token = await newToken(username, phoneNum, email);
        res.render('index', {token:`Your new token is: ${token}`, errorDisplay: ''});
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});