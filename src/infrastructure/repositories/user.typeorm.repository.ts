import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findByFirebaseUid(firebaseUid: string) {
    return this.repo.findOne({ where: { firebaseUid } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async create(data: {
    firebaseUid: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }) {
    const user = this.repo.create({
      firebaseUid: data.firebaseUid,
      email: data.email,
      name: data.name,
      avatar: data.avatarUrl ?? null,
    } as Partial<User>);

    return this.repo.save(user);
  }

  async updateProfile(
    firebaseUid: string,
    data: { name?: string; avatarUrl?: string },
  ) {
    const user = await this.repo.findOne({ where: { firebaseUid } });
    if (!user) throw new NotFoundException('User not found');

    user.name = data.name ?? user.name;
    user.avatar = data.avatarUrl ?? user.avatar;

    return this.repo.save(user);
  }
}
