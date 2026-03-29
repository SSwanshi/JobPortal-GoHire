const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

async function setupGraphQL(app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // You can add authentication context here if needed
      return { req };
    },
    introspection: true, // Enable introspection for development
    plugins: [
      {
        requestDidStart() {
          return {
            didResolveOperation({ request }) {
              // Optional: Log GraphQL operations
              console.log('GraphQL Operation:', request.operationName);
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql',
    bodyParserConfig: false,
  });
  
  return server;
}

module.exports = setupGraphQL;
