import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreatePlaceDto, UpdatePlaceDto, PlaceEntity, PlaceService } from './index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CITIES } from '../../types/city.types.js';
import { MAX_PLACE_COUNT } from './const/place-const.js';

@injectable()
export class DefaultPlaceService implements PlaceService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.PlaceModel) private readonly placeModel: types.ModelType<PlaceEntity>
  ) {}


  public async create(dto: CreatePlaceDto): Promise<DocumentType<PlaceEntity>> {
    const place = await this.placeModel.create(dto);
    if (place) {
      this.logger.info(`New place created: ${dto.title}`);
    } else {
      this.logger.warn('New place has not been created');
    }
    return place;
  }

  public async update(placeId: string, dto: UpdatePlaceDto): Promise<DocumentType<PlaceEntity> | null> {
    const updatedPlace = await this.placeModel.findByIdAndUpdate(placeId, dto, { new: true }).exec();
    if (updatedPlace) {
      this.logger.info(`Place updated: ${placeId}`);
    } else {
      this.logger.warn(`Place not found: ${placeId}`);
    }
    return updatedPlace;
  }

  public async delete(placeId: string): Promise<DocumentType<PlaceEntity> | null> {
    const deletedPlace = await this.placeModel.findByIdAndDelete(placeId).exec();
    if (deletedPlace) {
      this.logger.info(`Place deleted: ${placeId}`);
    } else {
      this.logger.warn(`Place not found: ${placeId}`);
    }
    return deletedPlace;
  }

  public async findAll(): Promise<DocumentType<PlaceEntity>[] | null> {
    return this.placeModel
      .aggregate([
        {
          $lookup: {
            from: 'reviews',
            let: {placeId: '$_id'},
            pipeline: [
              {$match: {$expr: {$eq: ['$placeId', '$$placeId']}}},
              {$group: {_id: null, averageRating: {$avg: '$rating'}, reviewsCount: {$sum: 1}}},
            ],
            as: 'reviews'
          }
        },
        {
          $addFields: {
            reviewsCount: {$arrayElemAt: ['$reviews.reviewsCount', 0]},
            averageRating: {$arrayElemAt: ['$reviews.averageRating', 0]}
          }
        },
        {
          $unset: 'reviews'
        },
        {
          $limit: MAX_PLACE_COUNT
        },
      ]).exec();
  }

  public async findById(placeId: string): Promise<DocumentType<PlaceEntity> | null> {
    return this.placeModel.findById(placeId).populate(['userId']).exec();
  }

  public async findByCity(city: typeof CITIES[number]): Promise<DocumentType<PlaceEntity>[] | null> {
    return this.placeModel.find({city}).populate(['userId']).exec();
  }

  public async findPremiumByCity(city: typeof CITIES[number]): Promise<DocumentType<PlaceEntity>[] | null> {
    return this.placeModel.find({ city, isPremium: true }).populate(['userId']).exec();
  }

  public async incReviewCount(placeId: string): Promise<DocumentType<PlaceEntity> | null> {
    return this.placeModel
      .findByIdAndUpdate(placeId, {'$inc': {
        reviewCount: 1,
      }}).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.placeModel
      .exists({_id: documentId})) !== null;
  }
}
