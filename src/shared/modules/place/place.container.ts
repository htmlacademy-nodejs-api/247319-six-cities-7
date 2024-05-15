import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { DefaultPlaceService, PlaceEntity, PlaceModel, PlaceService } from './index.js';
import { Component } from '../../types/index.js';

export function createPlaceContainer() {
  const placeContainer = new Container();

  placeContainer.bind<PlaceService>(Component.PlaceService).to(DefaultPlaceService);
  placeContainer.bind<types.ModelType<PlaceEntity>>(Component.PlaceModel).toConstantValue(PlaceModel);

  return placeContainer;
}
