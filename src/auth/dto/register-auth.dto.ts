// src/auth/dto/register-auth.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
