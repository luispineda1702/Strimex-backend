/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2, {
    message: 'El nombre completo es muy corto',
  })
  @MaxLength(100, {
    message: 'El nombre completo es muy largo',
  })
  fullName: string;

  //@IsString()
  //firebaseUuid: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'La contraseña debe cumplir con una longitud mínima de 8 caracteres e incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial de los siguientes: # ? ! @ $ % ^ & * -.',
  })
  password: string;
}
