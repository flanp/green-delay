const dotenv = require('dotenv');
const os = require('os');

// Let's load all configured environment variables for the Running Environment
dotenv.config({path: __dirname + `/${process.env.NODE_ENV || 'dev'}.env`});

const printEnvVars = () => {
  console.log(process.env);
};

if(!process.env.NODE_ENV) {
  console.log('\n\nTo start this node app you must provide the NODE_ENV variable, as in:');
  console.log('    $ NODE_ENV=production node server.js');
  console.log('    $ NODE_ENV=staging nodes server.js');
  console.log('    $ NODE_ENV=dev node server.js');
  console.log('\n Or if using pm2:');
  console.log('    $ NODE_ENV=production pm2 start server.js  --name "server"');
  console.log('    $ NODE_ENV=production pm2 start server.js  --name "server" --update-env');
  console.log('    $ NODE_ENV=staging pm2 start server.js --name "server-staging"');
  console.log('    $ NODE_ENV=staging pm2 start server.js --name "server-staging" --update-env');
  console.log('\n');
  process.exit(1);
}

//console.log(`Loaded environment configuration for: ${process.env.NODE_ENV}`);

module.exports = {
  printEnvVars: printEnvVars,
  connectionString: process.env.MONGO_CONNECTION_STRING,
  secret: process.env.SECRET,
  port: parseInt(process.env.SERVER_APP_PORT),
  OPENVIDU_URL: process.env.OPENVIDU_URL,
  OPENVIDU_SECRET: process.env.OPENVIDU_SECRET,
  OPENVIDU_CERTTYPE: process.env.OPENVIDU_CERTTYPE,
};
