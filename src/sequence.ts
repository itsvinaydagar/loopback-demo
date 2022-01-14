import {inject} from '@loopback/core';
import {LoggingBindings, logInvocation, WinstonLogger} from '@loopback/logging';
import {MiddlewareSequence, RequestContext} from '@loopback/rest';

export class MySequence extends MiddlewareSequence {
  @inject(LoggingBindings.WINSTON_LOGGER) public logger: WinstonLogger;

  @logInvocation()
  async handle(context: RequestContext) {
    const requestTime = Date.now();
    try {
      const {request} = context;
      this.logger.info(
        `Request ${request.method} ${request.url} started at ${requestTime.toString()}.
        Request Details
        Referer = ${request.headers.referer}
        User-Agent = ${request.headers['user-agent']}
        Remote Address = ${request.connection.remoteAddress}
        Remote Address (Proxy) = ${request.headers['x-forwarded-for']}`
      );

    } catch (err) {
      this.logger.error(
        `Request ${context.request.method} ${context.request.url
        } errored out. Error :: ${JSON.stringify(err)} ${err}`,
      );

    } finally {
      this.logger.info(
        `Request ${context.request.method} ${context.request.url
        } Completed in ${Date.now() - requestTime}ms`,
      );
    }
  }
}
