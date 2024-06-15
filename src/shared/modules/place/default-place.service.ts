import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreatePlaceDto, UpdatePlaceDto, PlaceEntity, PlaceService } from './index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CITIES } from '../../types/city.types.js';

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

  public async findAll(limit: number): Promise<DocumentType<PlaceEntity>[] | null> {
    return this.placeModel.find().populate(['userId']).limit(limit).exec();
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

  public async findFavoritesByUser(userId: string, limit: number): Promise<DocumentType<PlaceEntity>[] | null> {
    return this.placeModel.find({ userId, isFavorite: true }).populate(['userId']).limit(limit).exec();
  }

  public async updateFavoriteField(placeId: string, status: number): Promise<DocumentType<PlaceEntity> | null> {
    return this.placeModel.findByIdAndUpdate(placeId, {isFavorite: status === 1}, {new: true}).exec();
  }

  public async updatePlaceStatistics(place: PlaceEntity, rating: number): Promise<DocumentType<PlaceEntity> | null> {
    return this.placeModel
      .findByIdAndUpdate(place.id,
        {
          '$inc': {
            reviewsCount: 1,
            rating: rating,
          },
          averageRating: (place.rating + rating) / (place.reviewsCount + 1)
        }).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.placeModel
      .exists({_id: documentId})) !== null;
  }
}
