'use strict';
const fs = require('fs');

// Let's create the .env file with all variables needed from the .env.sample file template
fs.createReadStream('sample.env').pipe(fs.createWriteStream('.env'));

console.log('\nNow edit the file .env and fill in the values for the environment variables needed for this app.\n');
console.log('You may also need to rename the .env file to either: production.env, staging.env, dev.env, local.env\n');
console.log('This file will be used when you run the server app with:  NODE_ENV=production pm2 start server.js\n');