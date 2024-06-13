import { UpdateUserValidationMessages } from './update-user.messages.js';
import { IsBoolean, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: UpdateUserValidationMessages.email.invalidFormat })
  public email?: string;

  @IsOptional()
  @IsString({ message: UpdateUserValidationMessages.name.invalidFormat })
  @Length(1, 15, { message: UpdateUserValidationMessages.name.lengthField })
  public name?: string;

  @IsOptional()
  @IsString({ message: UpdateUserValidationMessages.avatarUrl.invalidFormat })
  public avatarUrl?: string;

  @IsOptional()
  @IsBoolean({message: UpdateUserValidationMessages.isPro.invalidFormat})
  public isPro?: boolean;

  @IsOptional()
  @IsString({ message: UpdateUserValidationMessages.password.invalidFormat })
  @Length(6, 12, { message: UpdateUserValidationMessages.password.lengthField })
  public password?: string;
}
