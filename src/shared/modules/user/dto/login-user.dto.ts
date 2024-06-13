import { LoginUserValidationMessages } from './login-user.messages.js';
import { IsEmail, IsString, Length } from 'class-validator';
export class LoginUserDto {
  @IsEmail({}, { message: LoginUserValidationMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: LoginUserValidationMessages.password.invalidFormat })
  @Length(6, 12, { message: LoginUserValidationMessages.password.lengthField })
  public password: string;
}
