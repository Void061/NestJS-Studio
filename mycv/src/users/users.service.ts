import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(): Promise<Users> {
    return await this.prisma.users.create({
      data: {
        email: 'testUser@gmail.com',
        password: 'qwerty123@',
      },
    });
  }
}
