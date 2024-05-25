import { inject, injectable } from 'inversify';
import { ReviewEntity, ReviewService, CreateReviewDto } from './index.js';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultReviewService implements ReviewService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.ReviewModel) private readonly reviewModel: types.ModelType<ReviewEntity>
  ) {}

  public async create(dto: CreateReviewDto): Promise<types.DocumentType<ReviewEntity>> {
    const review = await this.reviewModel.create(dto);
    if (review) {
      this.logger.info(`New review created: ${dto.placeId}`);
    } else {
      this.logger.warn('New review has not been created');
    }
    return review.populate('userId');
  }

  public async findByPlaceId(placeId: string): Promise<types.DocumentType<ReviewEntity>[]> {
    return this.reviewModel.find({placeId}).populate('userId');
  }

  public async deleteByPlaceId(placeId: string): Promise<number> {
    const result = await this.reviewModel.deleteMany({placeId}).exec();

    return result.deletedCount;
  }
}
