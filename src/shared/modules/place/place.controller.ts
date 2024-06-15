import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, PrivateRouteMiddleware, RequestBody, RequestParams, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { PlaceService } from './place-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreatePlaceDto, PlaceDetailedRdo, PlaceFavoritesRdo, PlacePremiumRdo, UpdatePlaceDto } from './index.js';
import { StatusCodes } from 'http-status-codes';
import { CITIES } from '../../types/city.types.js';
import { ReviewRdo, ReviewService } from '../review/index.js';
import { DEFAULT_PLACE_LIMIT } from './const/index.js';

@injectable()
export class PlaceController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.PlaceService) private readonly placeService: PlaceService,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService,
  ) {
    super(logger);

    this.logger.info('Register routes for PlaceController');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middleware: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/:placeId/favorites/:status',
      method: HttpMethod.Patch,
      handler: this.toggleFavorites,
      middleware: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('placeId'),
        new DocumentExistsMiddleware(this.placeService, 'Place', 'placeId'),
      ]
    });
    this.addRoute({
      path: '/:placeId',
      method: HttpMethod.Get,
      handler: this.get,
      middleware: [
        new ValidateObjectIdMiddleware('placeId'),
        new DocumentExistsMiddleware(this.placeService, 'Place', 'placeId')
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middleware: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreatePlaceDto)]
    });
    this.addRoute({
      path: '/:placeId',
      method: HttpMethod.Patch,
      handler: this.update,
      middleware: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('placeId'),
        new DocumentExistsMiddleware(this.placeService, 'Place', 'placeId'),
        new ValidateDtoMiddleware(UpdatePlaceDto)
      ]
    });
    this.addRoute({
      path: '/:placeId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middleware: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('placeId'),
        new DocumentExistsMiddleware(this.placeService, 'Place', 'placeId')
      ]
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({
      path: '/:placeId/reviews',
      method: HttpMethod.Get,
      handler: this.getReviews,
      middleware: [
        new ValidateObjectIdMiddleware('placeId'),
        new DocumentExistsMiddleware(this.placeService, 'Place', 'placeId')
      ]
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit ? Number(req.query.limit) : DEFAULT_PLACE_LIMIT;
    const places = await this.placeService.findAll(limit);
    const responseData = fillDTO(PlacePremiumRdo, places);
    this.ok(res, responseData);
  }

  public async get(req: Request, res: Response): Promise<void> {
    const placeId = req.params.placeId;
    const place = await this.placeService.findById(placeId);
    const responseData = fillDTO(PlaceDetailedRdo, place);
    this.ok(res, responseData);
  }

  public async create(
    { body, tokenPayload }: Request<RequestParams, RequestBody, CreatePlaceDto>,
    res: Response
  ): Promise<void> {
    const result = await this.placeService.create({ ...body, userId: tokenPayload.id });
    this.created(res, fillDTO(PlaceDetailedRdo, result));
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
    const result = await this.placeService.delete(placeId);
    await this.reviewService.deleteByPlaceId(placeId);
    this.noContent(res, result);
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const city = req.params.city;
    const cityWithCapitalFirstSymbol = (city.charAt(0).toUpperCase() + city.slice(1)) as typeof CITIES[number];
    const place = await this.placeService.findPremiumByCity(cityWithCapitalFirstSymbol);
    const responseData = fillDTO(PlacePremiumRdo, place);
    this.ok(res, responseData);
  }

  public async getReviews(req: Request, res: Response): Promise<void> {
    const placeId = req.params.placeId;
    const reviews = await this.reviewService.findByPlaceId(placeId);

    if (!reviews) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Place with id: ${placeId} didn't have reviews`,
        'PlaceController'
      );
    }
    this.ok(res, fillDTO(ReviewRdo, reviews));
  }

  public async getFavorites(
    req: Request,
    res: Response
  ): Promise<void> {
    const tokenPayload = req.tokenPayload;
    const limit = req.query.limit ? Number(req.query.limit) : DEFAULT_PLACE_LIMIT;
    const places = await this.placeService.findFavoritesByUser(tokenPayload.id, limit);
    const responseData = fillDTO(PlaceFavoritesRdo, places);
    this.ok(res, responseData);
  }

  public async toggleFavorites(
    req: Request,
    res: Response
  ): Promise<void> {
    const { placeId, status } = req.params;
    const parsedStatus = parseInt(status, 10);
    if (isNaN(parsedStatus) || (parsedStatus !== 0 && parsedStatus !== 1)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid status value. Must be 0 or 1.',
        'PlaceController'
      );
    }

    const targetPlace = await this.placeService.findById(placeId);
    if (!targetPlace) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Place with id ${placeId} not found`,
        'PlaceController'
      );
    }

    let message = '';
    if (parsedStatus === 1) {
      message = targetPlace.isFavorite ? 'Place is already marked as favorite.' : 'Place added to favorites.';
    } else if (parsedStatus === 0) {
      message = targetPlace.isFavorite ? 'Place removed from favorites.' : 'Place is not marked as favorite.';
    }

    const updatedPlace = await this.placeService.updateFavoriteField(placeId, parsedStatus);
    if (!updatedPlace) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Place with id ${placeId} not found`,
        'PlaceController'
      );
    }

    this.ok(res, { message });
  }
}
