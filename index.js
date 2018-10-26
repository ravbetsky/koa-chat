const app = require('./app');

const port = require('config').get('app.port') || 3000;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
