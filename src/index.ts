import { format, LoggingBindings, LoggingComponent } from '@loopback/logging';
import dotenv from 'dotenv';
import { ApplicationConfig, LoopbackDemoApplication } from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new LoopbackDemoApplication(options);
  dotenv.config();
  await app.boot();
  await app.start();

  app.configure(LoggingBindings.COMPONENT).to({
    enableFluent: false, // default to true
    enableHttpAccessLog: false, // default to true
  });

  app.configure(LoggingBindings.WINSTON_LOGGER).to({
    level: 'info',
    format: format.json(),
    defaultMeta: { framework: 'LoopBack' },
  });
  app.component(LoggingComponent);

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);
  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 4000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
      cors: {
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
