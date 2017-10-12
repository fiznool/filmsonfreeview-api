const path = require('path');
const express = require('express');
const postgraphql = require('postgraphql').postgraphql;

const isProd = process.env.NODE_ENV === 'production';

const server = express();

const opts = {
  graphiql: !isProd,
  watchPg: !isProd,
  showErrorStack: !isProd,
  disableQueryLog: isProd,
  disableDefaultMutations: true
};

server.use(postgraphql(process.env.DATABASE_URL, 'filmsonfreeview', opts));

if(!isProd) {
  const filmsPath = path.resolve(__dirname, '../data/films.html');
  server.get('/films.html', (req, res) => res.sendFile(filmsPath));
}

server.listen(process.env.PORT, () => console.log(`PostGraphQL Server is now running on http://localhost:${process.env.PORT}`));