const empty = 0;
class Router {
  constructor() {
    this.routes = [];
  }
  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }
  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }
  use(middleware) {
    this.routes.push({ handler: middleware });
  }
  serve(req, res) {
    process.stdout.write(`Request: ${req.url} ${req.method}\n`);
    const matchingHandlers = this.routes.filter(route =>
      matchRoute(route, req)
    );
    const next = function() {
      if (matchingHandlers.length === empty) {
        return;
      }
      const router = matchingHandlers.shift();
      router.handler(req, res, next);
    };
    next();
  }
}

const matchRoute = function(route, req) {
  if (route.method) {
    return req.method === route.method && req.url.match(route.path);
  }
  return true;
};

module.exports = { Router };