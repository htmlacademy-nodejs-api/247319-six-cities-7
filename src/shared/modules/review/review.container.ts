import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { ReviewEntity, ReviewModel, DefaultReviewService, ReviewService } from './index.js';
import { ReviewController } from './review.controller.js';
import { Controller } from '../../libs/rest/index.js';

export function createReviewContainer() {
  const reviewContainer = new Container();

  reviewContainer.bind<ReviewService>(Component.ReviewService).to(DefaultReviewService).inSingletonScope();
  reviewContainer.bind<types.ModelType<ReviewEntity>>(Component.ReviewModel).toConstantValue(ReviewModel);
  reviewContainer.bind<Controller>(Component.ReviewController).to(ReviewController).inSingletonScope();

  return reviewContainer;
}
