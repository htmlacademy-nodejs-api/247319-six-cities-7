import { DocumentType } from '@typegoose/typegoose';
import { CreatePlaceDto, UpdatePlaceDto, PlaceEntity } from './index.js';
import { CITIES } from '../../types/city.types.js';

export interface PlaceService {
  create(dto: CreatePlaceDto): Promise<DocumentType<PlaceEntity>>;
  findById(placeId: string): Promise<DocumentType<PlaceEntity> | null>;
  update(placeId: string, dto: UpdatePlaceDto): Promise<DocumentType<PlaceEntity> | null>;
  delete(placeId: string): Promise<DocumentType<PlaceEntity> | null>;
  findAll(): Promise<DocumentType<PlaceEntity>[] | null>;
  findPremiumByCity(city: typeof CITIES[number]): Promise<DocumentType<PlaceEntity>[] | null>;
  findByCity(city: typeof CITIES[number]): Promise<DocumentType<PlaceEntity>[] | null>;
}
