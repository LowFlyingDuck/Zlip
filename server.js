const express = require('express');
const fs = require('fs');
const Database = require('nedb');
var accountsFile = './accounts/accounts.json';
var accounts = require(accountsFile);
const app = express();
const compressor = require('compression');
const protect = require('helmet');

app.listen(80, () => console.log('listening at port 80'));
app.use(express.static('public'));
app.use(express.json({
  limit: '1mb'
}));
app.use(compressor());
app.use(protect());

var accountsDatabase = new Database('database.db');
accountsDatabase.loadDatabase();

app.post('/login', (request, response) => {
  console.log('User issued login request:');
  console.log(request.body);
  for(account of accounts) {
    if (request.body.email == account.email && request.body.password == account.password) {
      response.json({
        'status': 'logged in',
        'email': request.body.email,
        'password': request.body.password
      });
      response.end();
      return 'done!';
    };
  };
  response.json({
    'status': 'wrong password'
  });
  response.end();
});

app.post('/accountData', (request, response) => {
  console.log('User tries to GET data:');
  console.log(request.body);
  var password = request.body.password;
  var email = request.body.email;
  for (account of accounts) {
    if (password == account.password && email == account.email) {
      var reqData = request.body.data;

      console.log("The User reveiced", reqData, "of", account.name, account[reqData]);

      response.json({
        'response': account[reqData],
        'status': 'granted'
      });
      response.end();
    }
  };
  response.json({
    'response': 'ACCESS DENIED',
    'status': 'ACCESS DENIED',
    'description': 'You were trying to access data, which you have not specified the authorisation data for or are not authorized with the data you specified. Your JSON request must look like this: {"email":"email@example.com", "password":"the correct password associated with the account", "data":"the data, you want to request"}'
  })
});