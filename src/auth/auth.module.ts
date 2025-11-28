import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { FirebaseTokenMiddleware } from './middlewares/firebase-token.middlware';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FirebaseAuthGuard],
  imports: [TypeOrmModule.forFeature([User]), FirebaseModule],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseTokenMiddleware)
      .forRoutes({ path: 'auth/validate', method: RequestMethod.POST });
  }
}
