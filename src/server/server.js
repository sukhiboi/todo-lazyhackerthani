const http = require('http');
const { router } = require('./library/handler');

const server = new http.Server(router.serve.bind(router));

server.listen(7000, () => console.log('listening to 4000'));
