// src/domain/repositories/user.repository.ts
import { User } from '../entities/user.entity';
export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepository {
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    firebaseUid: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }): Promise<User>;
  updateProfile(
    firebaseUid: string,
    data: { name?: string; avatarUrl?: string },
  ): Promise<User>;
}
