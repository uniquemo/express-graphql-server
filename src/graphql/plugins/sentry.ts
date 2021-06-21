import * as Sentry from '@sentry/node';

const sentryPlugin = {
  requestDidStart() {
    return {
      didEncounterErrors(rc) {
        const { source, errors, logger } = rc;
        logger.error(source);
        logger.error(errors);

        Sentry.withScope((scope: Sentry.Scope) => {
          scope.addEventProcessor((event: Sentry.Event) => Sentry.Handlers.parseRequest(event, rc.context.req));

          scope.setTags({
            graphql: rc.operation?.operation || 'parse_err',
            graphqlName: source,
          });

          rc.errors.forEach((error) => {
            if (error.path || error.name !== 'GraphQLError') {
              scope.setExtras({
                path: error.path,
              });
              Sentry.captureException(error);
            } else {
              scope.setExtras({});
              Sentry.captureMessage(`GraphQLWrongQuery: ${error.message}`);
            }
          });
        });
      },
    };
  },
};

export default sentryPlugin;
