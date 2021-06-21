import express from 'express';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from 'graphql/schema/music';
import sentryPlugin from 'graphql/plugins/sentry';
import { isLocalhost, getEnv } from 'helpers/env';
import logger from 'helpers/logger';

const PORT = process.env.PORT || 4000;

async function startServer() {
  const app = express();

  Sentry.init({
    environment: getEnv(),
    dsn: 'https://3903b6f29fac420f97c39b323bfe95a5@o876334.ingest.sentry.io/5825718',
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }), // enable HTTP calls tracing
      new Tracing.Integrations.Express({ app }), // enable Express.js middleware tracing
    ],

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring. We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context using domains, so that every transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler()); // TracingHandler creates a trace for every incoming request

  app.use(cors());

  // All controllers should live here
  app.get('/', (req, res) => {
    res.end('Hello world!');
  });

  app.get('/debug-sentry', (req, res) => {
    throw new Error('Sentry error for testing!');
  });

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    debug: isLocalhost,
    context: ({ req }) => {
      console.log('headers => ', req.headers);
      console.log('body => ', req.body);
      return {
        req,
      };
    },
    logger,
    plugins: [sentryPlugin],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  await new Promise((resolve: any) => {
    app.listen({ port: PORT }, resolve);
  });

  console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  return { apolloServer, app };
}

startServer();
