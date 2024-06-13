import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { BaseController, HttpError, HttpMethod, ValidateDtoMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { UserService } from './user-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateUserDto, CreateUserRequest, LoginUserDto, UserRdo } from './index.js';
import { StatusCodes } from 'http-status-codes';
import { Config, RestSchema } from '../../libs/config/index.js';
import { LoginUserRequest } from './login-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController');

    // this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/register', method: HttpMethod.Post, handler: this.create, middleware: [new ValidateDtoMiddleware(CreateUserDto)]});
    this.addRoute({path: '/login', method: HttpMethod.Post, handler: this.login, middleware: [new ValidateDtoMiddleware(LoginUserDto)]});
  }

  // public async index(_req: Request, res: Response): Promise<void> {
  //   const users = await this.userService.find();
  //   const responseData = fillDTO(UserRdo, users);
  //   this.ok(res, responseData);
  // }

  public async create(
    {body}: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existUser = await this.userService.findByEmail(body.email);

    if (existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email: ${body.email} exist`,
        'UserController'
      );
    }
    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    {body}: LoginUserRequest,
    _res: Response,
  ) : Promise<void> {
    const existUser = await this.userService.findByEmail(body.email);

    if (! existUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }
}
