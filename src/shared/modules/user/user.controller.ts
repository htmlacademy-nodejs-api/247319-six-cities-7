import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { UserService } from './user-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './index.js';
// import { StatusCodes } from 'http-status-codes';
// import * as dotenv from 'dotenv';

// dotenv.config();
@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const users = await this.userService.find();
    const responseData = fillDTO(UserRdo, users);
    this.ok(res, responseData);
  }

  public async create()
  // {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
  // res: Response
  : Promise<void> {

    // const existUser = await this.userService.findByEmail(body.email);

    // if (existUser) {
    //   const existUserError = new Error(`User with email: ${body.email} exist.`);
    //   this.send(res,
    //     StatusCodes.UNPROCESSABLE_ENTITY,
    //     {error: existUserError.message}
    //   );

    //   return this.logger.error(existUserError.message, existUserError);
    // }

    // const salt: string = 'jduJSSHNWPdk23l';
    // const result = await this.userService.create(body, salt);
    // this.created(res, fillDTO(UserRdo, result));
  }
}
