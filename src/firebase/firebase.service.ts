import { Injectable } from '@nestjs/common';
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
}
