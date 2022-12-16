const app = require('./app.js');

const { PORT = 8008 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));