import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod, RequestBody, RequestParams } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { PlaceService } from './place-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreatePlaceDto, PlaceRdo, PremiumPlaceRdo, UpdatePlaceDto } from './index.js';
import { StatusCodes } from 'http-status-codes';
import { CITIES } from '../../types/city.types.js';

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
    this.addRoute({path: '/:placeId', method: HttpMethod.Get, handler: this.getSpecificPlace});
    this.addRoute({path: '/:placeId', method: HttpMethod.Patch, handler: this.updateSpecificPlace});
    this.addRoute({path: '/:placeId', method: HttpMethod.Delete, handler: this.deleteSpecificPlace});
    this.addRoute({path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const places = await this.placeService.findAll();
    const responseData = fillDTO(PlaceRdo, places);
    this.ok(res, responseData);
  }

  public async create(
    {body}: Request<RequestParams, RequestBody, CreatePlaceDto>,
    res: Response
  ): Promise<void> {
    //Тут нет проверки на повтор перед созданием. По какому полю делать проверку? title или по координатам?
    //логично сделать по id но его в теле запроса нет
    const result = await this.placeService.create(body);
    this.created(res, fillDTO(PlaceRdo, result));
  }

  public async getSpecificPlace(req: Request, res: Response): Promise<void> {
    const placeId = req.params.placeId;
    const place = await this.placeService.findById(placeId);

    if (! place) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Place with id: ${placeId} not found`,
        'PlaceController'
      );
    }

    const responseData = fillDTO(PlaceRdo, place);
    this.ok(res, responseData);
  }

  public async updateSpecificPlace(
    req: Request<RequestParams, RequestBody, UpdatePlaceDto>,
    res: Response
  ): Promise<void> {
    const placeId = req.params.placeId as string;
    const body = req.body;
    const responseData = await this.placeService.update(placeId, body);
    this.ok(res, fillDTO(PlaceRdo, responseData));
  }

  public async deleteSpecificPlace(req: Request, res: Response): Promise<void> {
    const placeId = req.params.placeId;

    const existPlace = await this.placeService.findById(placeId);

    if (! existPlace) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Place with id: ${placeId} not found`,
        'PlaceController'
      );
    }

    const result = await this.placeService.delete(placeId);
    this.noContent(res, result);
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const city = req.params.city as typeof CITIES[number];
    const place = await this.placeService.findPremiumByCity(city);
    const responseData = fillDTO(PremiumPlaceRdo, place);
    this.ok(res, responseData);
  }
}
