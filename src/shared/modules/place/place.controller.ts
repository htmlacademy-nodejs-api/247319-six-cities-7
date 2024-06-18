import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, PrivateRouteMiddleware, RequestBody, RequestParams, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { PlaceService } from './place-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreatePlaceDto, PlaceDetailedRdo, PlaceFavoritesRdo, PlacePremiumRdo, UpdatePlaceDto } from './index.js';
import { StatusCodes } from 'http-status-codes';
import { CITIES } from '../../types/city.types.js';
import { ReviewRdo, ReviewService } from '../review/index.js';
import { DEFAULT_PLACE_LIMIT, FavoritesStatus } from './const/index.js';
import { UserService } from '../user/user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { UploadPreviewImageRdo } from './rdo/upload-preview-image.rdo.js';
@injectable()
export class PlaceController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.PlaceService) private readonly placeService: PlaceService,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for PlaceController');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getUserFavorites,
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
    this.addRoute({
      path: '/:placeId/previewimage',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middleware: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('placeId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'previewImage')
      ]
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit ? Number(req.query.limit) : DEFAULT_PLACE_LIMIT;
    const places = await this.placeService.findAll(limit);
    let placeIds: string[] = [];
    if (req.tokenPayload) {
      const userEmail = req.tokenPayload.email;
      const user = await this.userService.findByEmail(userEmail);
      if (!user) {
        throw new HttpError(
          StatusCodes.NOT_FOUND,
          `User with email ${userEmail} not found`,
          'PlaceController'
        );
      }
      placeIds = user.favorites;
    }

    const placesWithFavorites = places?.map((place) => ({
      ...place.toObject(),
      isFavorite: placeIds.includes(place.id)
    }));

    const responseData = fillDTO(PlaceFavoritesRdo, placesWithFavorites);
    this.ok(res, responseData);
  }

  public async get(req: Request, res: Response): Promise<void> {
    const placeId = req.params.placeId;
    const place = await this.placeService.findById(placeId)!;
    if (!place) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Place with id ${placeId} not found`,
        'PlaceController'
      );
    }
    let isFavorite = false;
    if (req.tokenPayload) {
      const userEmail = req.tokenPayload.email;
      const user = await this.userService.findByEmail(userEmail);
      if (!user) {
        throw new HttpError(
          StatusCodes.NOT_FOUND,
          `User with email ${userEmail} not found`,
          'PlaceController'
        );
      }
      isFavorite = (user.favorites as string[]).includes(placeId);
    }

    const placesWithFavorites = {
      ...place.toObject(),
      isFavorite
    };

    const responseData = fillDTO(PlaceDetailedRdo, placesWithFavorites);
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
    { params, tokenPayload, body }: Request<RequestParams, RequestBody, UpdatePlaceDto>,
    res: Response
  ): Promise<void> {
    const placeId = params.placeId as string;
    const place = await this.placeService.findById(placeId);
    if (place?.userId?.id !== tokenPayload.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Access denied',
        'PlaceController'
      );
    }

    const responseData = await this.placeService.update(placeId, body);
    this.ok(res, fillDTO(PlaceDetailedRdo, responseData));
  }

  public async delete({ params, tokenPayload }: Request, res: Response): Promise<void> {
    const placeId = params.placeId;
    const place = await this.placeService.findById(placeId);
    if (place?.userId?.id !== tokenPayload.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Access denied',
        'PlaceController'
      );
    }

    const result = await this.placeService.delete(placeId);
    await this.reviewService.deleteByPlaceId(placeId);
    this.noContent(res, result);
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const city = req.params.city;
    if (!CITIES.includes(city as typeof CITIES[number])) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Invalid city: ${city}`,
        'PlaceController'
      );
    }
    const cityWithCapitalFirstSymbol = (city.charAt(0).toUpperCase() + city.slice(1));
    const place = await this.placeService.findPremiumByCity(cityWithCapitalFirstSymbol as typeof CITIES[number]);
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

  public async getUserFavorites(
    req: Request,
    res: Response
  ): Promise<void> {
    const userEmail = req.tokenPayload.email;
    const user = await this.userService.findByEmail(userEmail);
    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email ${userEmail} not found`,
        'PlaceController'
      );
    }
    const placeIds = user.favorites;
    const favoritePlaces = await this.placeService.getFavoritesPlaces(placeIds);
    const responseData = fillDTO(PlaceFavoritesRdo, favoritePlaces);
    this.ok(res, responseData);
  }

  public async toggleFavorites(
    req: Request,
    res: Response
  ): Promise<void> {
    const { placeId, status } = req.params;
    const userId = req.tokenPayload.id;

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} not found`,
        'PlaceController'
      );
    }
    const favorites: string[] = user.favorites || [];

    switch (status) {
      case FavoritesStatus.on:
        if (favorites.includes(placeId)) {
          throw new HttpError(
            StatusCodes.CONFLICT,
            'Place is already marked as favorite',
            'PlaceController'
          );
        } else {
          await this.userService.addFavoritesId(userId, placeId);
          this.ok(res, { message: 'Place added to favorites' });
        }
        break;
      case FavoritesStatus.off:
        if (favorites.includes(placeId)) {
          await this.userService.deleteFavoritesId(userId, placeId);
          this.ok(res, { message: 'Place deleted from favorites' });
        } else {
          throw new HttpError(
            StatusCodes.CONFLICT,
            'Place is not marked as favorite',
            'PlaceController'
          );
        }
        break;
      default:
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          'Invalid status value. Must be 0 or 1.',
          'PlaceController'
        );
    }
  }

  public async uploadPreviewImage({params, tokenPayload, file}: Request, res: Response) {
    const {placeId} = params;
    const place = await this.placeService.findById(placeId);
    if (place?.userId?.id !== tokenPayload.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Access denied',
        'PlaceController'
      );
    }
    const updateDto = {previewImage: file?.filename};
    await this.placeService.update(placeId, updateDto);
    this.created(res, fillDTO(UploadPreviewImageRdo, updateDto));
  }
}
