import { inject, injectable } from 'inversify';
import { ReviewEntity, ReviewService, CreateReviewDto } from './index.js';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';

@injectable()
export class DefaultReviewService implements ReviewService {
  constructor(
    @inject(Component.ReviewModel) private readonly reviewModel: types.ModelType<ReviewEntity>
  ) {}

  public async create(dto: CreateReviewDto): Promise<types.DocumentType<ReviewEntity>> {
    const review = await this.reviewModel.create(dto);
    return review.populate('userId');
  }

  public async findByPlaceId(placeId: string): Promise<types.DocumentType<ReviewEntity>[]> {
    return this.reviewModel.find({placeId}).populate('userId');
  }
}
