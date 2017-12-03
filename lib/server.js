const express = require('express');
const postgraphql = require('postgraphql').postgraphql;
const rest = require('./rest');

const isProd = process.env.NODE_ENV === 'production';

const server = express();

const opts = {
  graphiql: !isProd,
  watchPg: !isProd,
  showErrorStack: !isProd,
  disableQueryLog: isProd,
  disableDefaultMutations: true,
  graphqlRoute: '/graphql'
};

server.use(postgraphql(process.env.DATABASE_URL, 'filmsonfreeview', opts));

server.use(rest(process.env.DATABASE_URL, '/api'));

if(!isProd) {
  server.use(express.static('data'));
}

server.listen(process.env.PORT, () => console.log(`Films on Freeview API Server is now running on port ${process.env.PORT}`));