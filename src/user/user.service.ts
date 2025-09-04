import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { generateID, IDType } from '../utils/generateID';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  find = async () => {
    return this.db.user.findMany();
  };

  findById = async (id: string, select?: Prisma.UserSelect) => {
    return this.db.user.findUnique({
      where: { id },
      select: select,
    });
  };

  create = async (data: Prisma.UserCreateInput) => {
    return this.db.user.create({
      data: {
        ...data,
        id: generateID(IDType.USER),
      },
    });
  };

  updateById = async (id: string, data: Prisma.UserUpdateInput) => {
    return this.db.user.update({
      where: { id },
      data,
    });
  };

  deleteById = async (id: string) => {
    return this.db.user.delete({
      where: { id },
    });
  };
}
