import { DocumentType } from '@typegoose/typegoose';
import { CreateReviewDto, ReviewEntity } from './index.js';

export interface ReviewService {
  create(dto: CreateReviewDto): Promise<DocumentType<ReviewEntity>>;
  findByPlaceId(placeId: string): Promise<DocumentType<ReviewEntity>[]>;
  deleteByPlaceId(placeId: string): Promise<number>;
}
