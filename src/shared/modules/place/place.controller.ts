import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod, RequestBody, RequestParams, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { PlaceService } from './place-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreatePlaceDto, PlaceDetailedRdo, PlacePremiumRdo, UpdatePlaceDto } from './index.js';
import { StatusCodes } from 'http-status-codes';
import { CITIES } from '../../types/city.types.js';
import { ReviewRdo, ReviewService } from '../review/index.js';

@injectable()
export class PlaceController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.PlaceService) private readonly placeService: PlaceService,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService
  ) {
    super(logger);

    this.logger.info('Register routes for PlaceController');
    this.addRoute({path: '/:placeId', method: HttpMethod.Get, handler: this.get, middleware: [new ValidateObjectIdMiddleware('placeId')]});
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create, middleware: [new ValidateDtoMiddleware(CreatePlaceDto)]});
    this.addRoute({path: '/:placeId', method: HttpMethod.Patch, handler: this.update, middleware: [new ValidateObjectIdMiddleware('placeId'), new ValidateDtoMiddleware(UpdatePlaceDto)]});
    this.addRoute({path: '/:placeId', method: HttpMethod.Delete, handler: this.delete, middleware: [new ValidateObjectIdMiddleware('placeId')]});
    this.addRoute({path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium});
    this.addRoute({path: '/:placeId/reviews', method: HttpMethod.Get, handler: this.getReviews, middleware: [new ValidateObjectIdMiddleware('placeId')]});
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
    await this.reviewService.deleteByPlaceId(placeId);
    this.noContent(res, result);
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const city = req.params.city as typeof CITIES[number];
    const place = await this.placeService.findPremiumByCity(city);
    const responseData = fillDTO(PlacePremiumRdo, place);
    this.ok(res, responseData);
  }

  public async getReviews(req: Request, res: Response): Promise<void> {
    const placeId = req.params.placeId;
    const existPlace = await this.placeService.findById(placeId);

    if (! existPlace) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Place with id: ${placeId} not found`,
        'PlaceController'
      );
    }

    const reviews = await this.reviewService.findByPlaceId(placeId);

    if (! reviews) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Place with id: ${placeId} didnt have reviews`,
        'PlaceController'
      );
    }
    this.ok(res, fillDTO(ReviewRdo, reviews));
  }
}
