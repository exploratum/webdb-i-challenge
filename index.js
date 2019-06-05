const server = require('./server.js');

const PORT = process.env.PORT || 4000;

server.listen(4000, () => {
  console.log(`Listening on port ${4000}...`);
});

