import {
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import { inject } from '@loopback/core';
import {
  LoggingBindings,
  logInvocation,
  WinstonLogger,
} from '@loopback/logging';
import {
  FindRoute,
  HttpErrors,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  Send,
  SequenceActions,
  SequenceHandler,
} from '@loopback/rest';
import {
  AuthenticateFn,
  AuthenticationBindings,
} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
} from 'loopback4-authorization';
import { AuthUser } from './providers/auth.provider';

export class MySequence implements SequenceHandler {
  @inject(SequenceActions.INVOKE_MIDDLEWARE, { optional: true })
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(LoggingBindings.WINSTON_LOGGER) public logger: WinstonLogger,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    // JWT authentication
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<AuthUser>,
    // Authorization
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorisation: AuthorizeFn, // @inject(AuthorizationBindings.USER_PERMISSIONS) // private readonly getUserPermissions: UserPermissionsFn<string>,
  ) {}

  @logInvocation()
  async handle(context: RequestContext) {
    // const requestTime = Date.now();
    try {
      const { request, response } = context;
      // this.logger.info(
      //   `Request ${request.method} ${
      //     request.url
      //   } started at ${requestTime.toString()}.
      //   Request Details
      //   Referer = ${request.headers.referer}
      //   User-Agent = ${request.headers['user-agent']}
      //   Remote Address = ${request.connection.remoteAddress}
      //   Remote Address (Proxy) = ${request.headers['x-forwarded-for']}`,
      // );
      const finished = await this.invokeMiddleware(context);
      if (finished) return;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      const authUser: AuthUser = await this.authenticateRequest(request);

      const isAccessAllowed = await this.checkAuthorisation(
        authUser.permissions ?? [],
        request,
      );

      if (!isAccessAllowed) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }

      const result = await this.invoke(route, args);

      this.send(response, result);
    } catch (err) {
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, { statusCode: 401 /* Unauthorized */ });
      }

      this.reject(context, err);
      // this.logger.error(
      //   `Request ${context.request.method} ${
      //     context.request.url
      //   } errored out. Error :: ${JSON.stringify(err)} ${err}`,
      // );
    } finally {
      // this.logger.info(
      //   `Request ${context.request.method} ${
      //     context.request.url
      //   } Completed in ${Date.now() - requestTime}ms`,
      // );
    }
  }
}
