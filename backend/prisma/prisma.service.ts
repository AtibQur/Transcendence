import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PrismaService = {
  getClient() {
    return prisma;
  },
};
