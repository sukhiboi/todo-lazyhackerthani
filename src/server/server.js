const http = require('http');
const { app } = require('./library/handler');

const server = new http.Server(app.serve.bind(app));

server.listen(7000, () => console.log('listening to 4000'));
