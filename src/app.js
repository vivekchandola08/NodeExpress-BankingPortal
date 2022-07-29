const fs = require('fs');
const path = require('path');

// require the express framework
const express = require('express');
// call the express function
const app = express();

// Configure the View Directory and Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// Configure the Static(CSS/JS) Directory
app.use(express.static(path.join(__dirname, 'public')))

// add express(urlencoded) middleware to handle POST data.
app.use(express.urlencoded({extended:true}))
// app.use()

// use the readFileSync function to read the contents of the file located at src/json/accounts.json with the UTF8 encoding.
const accountData = fs.readFileSync(
    path.join(__dirname, 'json', 'accounts.json'), 'utf8'
)
// accountData now contains JSON, use JSON.parse to convert it to a javascript object.
const accounts = JSON.parse(accountData)

const userData = fs.readFileSync(
    path.join(__dirname, 'json', 'users.json'), 'utf8'
)
const users = JSON.parse(userData)

// create a get route that points at the root URL path '/' and render the index view and an objects key-value pairs.
app.get('/',(req,res)=>{
    res.render(
        'index',
        {title:'Account Summary', accounts:accounts}
    )
})

// create a get routes that points at the /savings, /checking, /credit URL path and render the account view and pass an object.
app.get('/savings',(req,res)=>{
    res.render(
        'account',
        {account:accounts.savings}
    )
})
app.get('/checking',(req,res)=>{
    res.render(
        'account',
        {account:accounts.checking}
    )
})
app.get('/credit',(req,res)=>{
    res.render(
        'account',
        {account:accounts.credit}
    )
})

// /profile URL path and render the profile view and pass an object.
app.get('/profile',(req,res)=>{
    res.render(
        'profile',
        {user:users[0]}
    )
})

// create a get route that points to the /transfer URL path. It should render the transfer view.
app.get('/transfer',(req,res)=>{
    res.render(
        'transfer'
    )
})

// Calculate and Set the From Balance
// post route we are going to calculate the new balances for the account we are transferring from.
// values that have been entered into the HTML form in transfer.ejs. Upon form submission the request body will contain from, to, and amount
// current balance for the savings account use accounts["savings"].balance

// Calculate and Set the To Balance
// same like above and o access the current balance for the savings account use accounts["savings"].balance. Using these values, calculate the new balance of the account we are transferring to.

// Convert Account Data to JSON
// post route, convert the accounts javascript object to a string using the JSON.stringify
// post route, convert the accounts javascript object to a string using the JSON.stringify
// use the writeFileSync function of the built-in fs library to write the variable accountsJSON to the file located at json/accounts.json.
// Notes: If at any point accounts.json gets overwritten and you would like the original back copy the JSON from account_backup.json to account.json. Specify the absolute file path using path.join & __dirname
app.post('/transfer',(req,res)=>{
    accounts[req.body.from].balance = accounts[req.body.from].balance - req.body.amount;
    accounts[req.body.to].balance = parseInt(accounts[req.body.to].balance) + parseInt(req.body.amount,10);
    const accountsJSON = JSON.stringify(accounts, null, 4);
    fs.writeFileSync(path.join(__dirname, 'json/accounts.json'), accountsJSON, 'utf8');
    res.render(
        'transfer',
        {message:'Transfer Completed'}
    )
})

// Add Payment Feature :- The payment feature of the application is similar to the transfer feature. 
app.get('/payment',(req,res)=>{
    res.render(
        'payment',
        { account: accounts.credit}
    )
})

app.post('/payment',(req,res)=>{
    accounts.credit.balance -= req.body.amount;
    accounts.credit.available += parseInt(req.body.amount,10);
    const accountsJSON = JSON.stringify(accounts, null, 4);
    fs.writeFileSync(path.join(__dirname, 'json', 'accounts.json'), accountsJSON, 'utf8');
    res.render(
        'payment',
        {message:'Payment Successful', account:accounts.credit}
    )
})

// use the listen function to create a server that listens on port 3000
app.listen(3000,()=>{
    console.log('PS Project Running on port 3000!');
})
