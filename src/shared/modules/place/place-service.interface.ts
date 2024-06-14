import { DocumentType } from '@typegoose/typegoose';
import { CreatePlaceDto, UpdatePlaceDto, PlaceEntity } from './index.js';
import { CITIES } from '../../types/city.types.js';
import { DocumentExists } from '../../types/index.js';

export interface PlaceService extends DocumentExists {
  create(dto: CreatePlaceDto): Promise<DocumentType<PlaceEntity>>;
  findById(placeId: string): Promise<DocumentType<PlaceEntity> | null>;
  update(placeId: string, dto: UpdatePlaceDto): Promise<DocumentType<PlaceEntity> | null>;
  delete(placeId: string): Promise<DocumentType<PlaceEntity> | null>;
  findAll(limit: number): Promise<DocumentType<PlaceEntity>[] | null>;
  findPremiumByCity(city: typeof CITIES[number]): Promise<DocumentType<PlaceEntity>[] | null>;
  findByCity(city: typeof CITIES[number]): Promise<DocumentType<PlaceEntity>[] | null>;
  updatePlaceStatistics(place: PlaceEntity, rating: number): Promise<DocumentType<PlaceEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
