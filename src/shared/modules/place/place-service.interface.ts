import { DocumentType } from '@typegoose/typegoose';
import { CreatePlaceDto, PlaceEntity } from './index.js';

export interface PlaceService {
  create(dto: CreatePlaceDto): Promise<DocumentType<PlaceEntity>>;
  findById(placeId: string): Promise<DocumentType<PlaceEntity> | null>;
}
