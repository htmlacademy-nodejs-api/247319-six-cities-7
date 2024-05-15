import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreatePlaceDto, PlaceEntity, PlaceService } from './index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultPlaceService implements PlaceService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.PlaceModel) private readonly placeModel: types.ModelType<PlaceEntity>
  ) {}


  public async create(dto: CreatePlaceDto): Promise<DocumentType<PlaceEntity>> {
    const result = await this.placeModel.create(dto);
    this.logger.info(`New place created: ${dto.title}`);

    return result;
  }

  public async findById(placeId: string): Promise<DocumentType<PlaceEntity> | null> {
    return this.placeModel.findById(placeId).exec();
  }
}
