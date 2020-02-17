const app = require('./lib/routes');

const PORT = 7000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
