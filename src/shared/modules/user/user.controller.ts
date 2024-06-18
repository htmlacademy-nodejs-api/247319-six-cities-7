import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod, PrivateRouteMiddleware, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { UserService } from './user-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateUserDto, CreateUserRequest, LoggedUserRdo, LoginUserDto, UploadAvatarRdo, UserRdo } from './index.js';
import { StatusCodes } from 'http-status-codes';
import { Config, RestSchema } from '../../libs/config/index.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { AuthService } from '../auth/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middleware: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middleware: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuth,
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middleware: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar')
      ]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const users = await this.userService.find();
    const responseData = fillDTO(UserRdo, users);
    this.ok(res, responseData);
  }

  public async create(
    {body, tokenPayload}: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    if (tokenPayload?.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Access Denied',
        'UserController',
      );
    }

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
    res: Response,
  ) : Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, user);
    this.ok(res, Object.assign(responseData, {token}));
  }

  public async checkAuth(
    {tokenPayload: {email}}: Request,
    res: Response
  ) {
    const foundedUser = await this.userService.findByEmail(email);

    if (! foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async uploadAvatar({params, tokenPayload, file}: Request, res: Response) {
    const {userId} = params;
    if (userId !== tokenPayload.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Access denied',
        'PlaceController'
      );
    }
    const updateDto = {avatarUrl: file?.filename};
    await this.userService.updateById(userId, updateDto);
    this.created(res, fillDTO(UploadAvatarRdo, updateDto));
  }
}
