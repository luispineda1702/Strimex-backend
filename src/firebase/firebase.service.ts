// src/firebase/firebase.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  async create(createAuthDto: CreateAuthDto): Promise<admin.auth.UserRecord> {
    try {
      const userRecord = await admin.auth().createUser({
        email: createAuthDto.email,
        password: createAuthDto.password,
      });
      return userRecord;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // --------- NUEVO MÉTODO ----------
  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      if (!idToken) throw new UnauthorizedException('No token provided');
      const decoded = await admin.auth().verifyIdToken(idToken);
      return decoded;
    } catch (error) {
      // opcional: log
      // console.error('verifyIdToken error', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
