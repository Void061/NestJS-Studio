import { Prisma } from '@prisma/client';

export class Users implements Prisma.UsersCreateInput {
  id: number;
  email: string;
  password: string;
}
