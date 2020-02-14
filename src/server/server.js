const app = require('./library/routes');

const PORT = 7000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
