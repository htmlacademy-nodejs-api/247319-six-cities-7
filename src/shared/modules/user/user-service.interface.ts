import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto, UpdateUserDto } from './index.js';
import { UserEntity } from './user.entity.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  find(): Promise<DocumentType<UserEntity>[]>;
  // login()
  // logout();
  // checkUserState(userId: string): Promise<boolean>;
}
