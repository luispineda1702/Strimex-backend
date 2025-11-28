// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Body, Patch, Param, Delete, Req , UseGuards, HttpCode, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch('edit/:id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  //@Post('validate')
  //validateToken(@Req() req) {
  //  return this.authService.validateToken(req);
  //}

  // POST /api/strimex/auth/validate
  @UseGuards(FirebaseAuthGuard)
  @Post('validate')
  @HttpCode(200)
  async validateToken(@Req() req: any) {
    // req.firebaseUser viene del guard (decoded token)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const firebaseUser = req.firebaseUser;
    // buscar usuario local por firebaseUuid (uid)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.authService.findByFirebaseUid(firebaseUser.uid);
    if (!user) {
      // Opcional: si no existe, podrías auto-crear un registro aquí
      throw new UnauthorizedException('User not found in local DB');
    }
    return {
      id: user.id,
      email: user.email,
      fullname: user.fullName,
      firebaseUuid: user.firebaseUuid,
    };
  }
}
