import { FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import prisma from './db';

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  
  return { id: user.id, email: user.email, role: user.role };
}

export async function validateToken(request: FastifyRequest) {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw { statusCode: 401, message: 'Unauthorized' };
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}