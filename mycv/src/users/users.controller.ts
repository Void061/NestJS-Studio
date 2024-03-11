import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(): Promise<Users> {
    return await this.usersService.create();
  }
}
