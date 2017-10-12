const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Channel {
    id: ID!
    name: String
  }

  type Query {
    channels: [Channel]
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;