import { getModelForClass, prop, defaultClasses, modelOptions } from '@typegoose/typegoose';
import { User } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({unique: true, required: true})
  public email: string;

  @prop({required: true, default: ''})
  public name: string;

  @prop({required: false, default: ''})
  public avatarUrl: string;

  @prop({required: true})
  public isPro: boolean;

  @prop({required: true, default: '' })
  private password?: string;

  @prop({required: false, default: [], _id: false})
  public favorites: [];

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.name = userData.name;
    this.avatarUrl = userData.avatarUrl;
    this.isPro = userData.isPro;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hash = createSHA256(password, salt);
    return hash === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
