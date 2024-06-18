import { CreateUserValidationMessages } from './create-user.messages.js';
import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';
export class CreateUserDto {
  @IsEmail({}, { message: CreateUserValidationMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateUserValidationMessages.name.invalidFormat })
  @Length(1, 15, { message: CreateUserValidationMessages.name.lengthField })
  public name: string;

  @IsBoolean({message: CreateUserValidationMessages.isPro.invalidFormat})
  public isPro: boolean;

  @IsString({ message: CreateUserValidationMessages.password.invalidFormat })
  @Length(6, 12, { message: CreateUserValidationMessages.password.lengthField })
  public password: string;
}
