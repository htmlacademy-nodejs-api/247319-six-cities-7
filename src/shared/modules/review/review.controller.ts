import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { BaseController, HttpError, HttpMethod, ValidateDtoMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { ReviewService } from './review-service.interface.js';
import { PlaceService } from '../place/place-service.interface.js';
import { CreateReviewDto, CreateReviewRequest, ReviewRdo } from './index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/common.js';

@injectable()
export class ReviewController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService,
    @inject(Component.PlaceService) private readonly placeService: PlaceService,
  ) {
    super(logger);

    this.logger.info('Register routes for ReviewController');
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create, middleware: [new ValidateDtoMiddleware(CreateReviewDto)]});
  }

  public async create(
    {body}: CreateReviewRequest,
    res: Response
  ): Promise<void> {
    if (! await this.placeService.exists(body.placeId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Place with id: ${body.placeId} not found`,
        'ReviewController'
      );
    }

    const review = await this.reviewService.create(body);
    await this.placeService.incReviewCount(body.placeId);
    this.created(res, fillDTO(ReviewRdo, review));
  }
}
