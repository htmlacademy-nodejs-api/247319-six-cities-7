import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { PlaceService } from './place-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { PlaceRdo } from './index.js';

@injectable()
export class PlaceController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.PlaceService) private readonly placeService: PlaceService,
  ) {
    super(logger);

    this.logger.info('Register routes for PlaceController');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const places = await this.placeService.findAll();
    const responseData = fillDTO(PlaceRdo, places);
    this.ok(res, responseData);
  }

  public create(_req: Request, _res: Response): void {

  }
}
