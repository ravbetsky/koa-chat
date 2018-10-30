const app = require('./app');
const socket = require('./libs/socket');
const port = require('config').get('app.port') || 3000;

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

socket(server);
