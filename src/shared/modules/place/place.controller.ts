import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod, RequestBody, RequestParams } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { PlaceService } from './place-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreatePlaceDto, PlaceDetailedRdo, PlacePremiumRdo, UpdatePlaceDto } from './index.js';
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
    this.addRoute({path: '/:placeId', method: HttpMethod.Get, handler: this.get});
    this.addRoute({path: '/:placeId', method: HttpMethod.Patch, handler: this.update});
    this.addRoute({path: '/:placeId', method: HttpMethod.Delete, handler: this.delete});
    this.addRoute({path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const places = await this.placeService.findAll();
    const responseData = fillDTO(PlacePremiumRdo, places);
    this.ok(res, responseData);
  }

  public async create(
    {body}: Request<RequestParams, RequestBody, CreatePlaceDto>,
    res: Response
  ): Promise<void> {
    const result = await this.placeService.create(body);
    this.created(res, fillDTO(PlaceDetailedRdo, result));
  }

  public async get(req: Request, res: Response): Promise<void> {
    const placeId = req.params.placeId;
    const place = await this.placeService.findById(placeId);

    if (! place) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Place with id: ${placeId} not found`,
        'PlaceController'
      );
    }

    const responseData = fillDTO(PlaceDetailedRdo, place);
    this.ok(res, responseData);
  }

  public async update(
    req: Request<RequestParams, RequestBody, UpdatePlaceDto>,
    res: Response
  ): Promise<void> {
    const placeId = req.params.placeId as string;
    const body = req.body;
    const responseData = await this.placeService.update(placeId, body);
    this.ok(res, fillDTO(PlaceDetailedRdo, responseData));
  }

  public async delete(req: Request, res: Response): Promise<void> {
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
    const responseData = fillDTO(PlacePremiumRdo, place);
    this.ok(res, responseData);
  }
}