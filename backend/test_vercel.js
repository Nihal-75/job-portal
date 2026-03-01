const app = require('./server');

console.log("App required successfully.");

// Simulate a request
const http = require('http');

const server = http.createServer((req, res) => {
  app(req, res);
});

server.listen(5077, () => {
  console.log("Test server listening on 5077");

  http.get('http://localhost:5077/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Response status:', res.statusCode);
      console.log('Response body:', data);
      process.exit(0);
    });
  }).on('error', err => {
    console.error('Request error:', err);
    process.exit(1);
  });
});
