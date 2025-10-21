import { PrismaClient } from '@prisma/client';
import { hashPassword } from './src/auth';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Create test user
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: await hashPassword('password123'),
      role: 'user'
    }
  });
});

afterAll(async () => {
  await prisma.chart.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});