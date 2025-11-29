// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(FirebaseAuthGuard)
  register(@Req() req, @Body() body: RegisterAuthDto) {
    const { firebaseUid, email } = req.user;

    return this.authService.registerFromFirebase({
      firebaseUid,
      email,
      name: body.name,
      avatarUrl: body.avatarUrl,
    });
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  me(@Req() req) {
    const { firebaseUid } = req.user;
    return this.authService.getCurrentUser(firebaseUid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req, @Body() body: UpdateProfileDto) {
    const { firebaseUid } = req.user;
    return this.authService.updateProfile(firebaseUid, body);
  }

  @Post('login')
  async login(@Body('firebaseToken') firebaseToken: string) {
    return this.authService.loginWithFirebase(firebaseToken);
  }
}
