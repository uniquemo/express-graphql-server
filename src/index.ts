import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from 'graphql/schema/music';

const PORT = process.env.PORT || 4000;

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      console.log('headers => ', req.headers);
      console.log('body => ', req.body);
      return {
        req,
      };
    },
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.use(cors());
  app.use((req, res) => {
    res.status(200);
    res.send('Hello');
    res.end();
  });

  await new Promise((resolve: any) => {
    app.listen({ port: PORT }, resolve);
  });

  console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  return { apolloServer, app };
}

startServer();
