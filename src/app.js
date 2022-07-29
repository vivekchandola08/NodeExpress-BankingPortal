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

const accountData = fs.readFileSync(
    path.join(__dirname, 'json', 'accounts.json'), 'utf8'
)
const accounts = JSON.parse(accountData)

const userData = fs.readFileSync(
    path.join(__dirname, 'json', 'users.json'), 'utf8'
)
const users = JSON.parse(userData)

// create a get route that points at the root URL path '/' and render the index view and an object key value pair, title: 'Index'
app.get('/',(req,res)=>{
    res.render(
        'index',
        {title:'Account Summary', accounts:accounts}
    )
})

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
app.get('/profile',(req,res)=>{
    res.render(
        'profile',
        {user:users[0]}
    )
})

// use the listen function to create a server that listens on port 3000
app.listen(3000,()=>{
    console.log('PS Project Running on port 3000!');
})
