import Fastify from 'fastify';
import { z } from 'zod';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import prisma from './db';
import { authenticate, validateToken, hashPassword } from './auth';
import { metricsMiddleware, getMetrics } from './metrics';

export const server = Fastify({
  logger: {
    transport: process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty' }
      : undefined,
    level: process.env.LOG_LEVEL || 'info'
  }
});

const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '127.0.0.1';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

server.register(jwt, { secret: JWT_SECRET });
server.register(cors, { origin: process.env.CORS_ORIGIN || '*' });

// Add metrics middleware to all routes
server.addHook('onRequest', metricsMiddleware);

const ChartCreate = z.object({
  meta: z.object({ type: z.string() }).optional(),
  data: z.any()
});

// Auth routes
server.post('/auth/register', async (req, reply) => {
  const { email, password } = req.body as any;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return reply.status(400).send({ error: 'Email already registered' });
  }
  
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword }
  });
  
  const token = server.jwt.sign({ id: user.id, email: user.email, role: user.role });
  return { token };
});

server.post('/auth/login', async (req, reply) => {
  const { email, password } = req.body as any;
  const user = await authenticate(email, password);
  if (!user) {
    return reply.status(401).send({ error: 'Invalid credentials' });
  }
  
  const token = server.jwt.sign(user);
  return { token };
});

// Protected routes
server.post('/charts', { onRequest: [validateToken] }, async (req: any, reply) => {
  const parsed = ChartCreate.safeParse(req.body);
  if (!parsed.success) return reply.status(400).send({ error: parsed.error.errors });
  const { meta, data } = parsed.data;
  const created = await prisma.chart.create({ 
    data: { 
      meta: meta ? JSON.stringify(meta) : null, 
      data: JSON.stringify(data),
      userId: req.user.id
    }
  });
  return { id: created.id };
});

server.get('/health', async () => ({ status: 'ok', ...getMetrics() }));

server.get('/charts/:id', { onRequest: [validateToken] }, async (req: any, reply) => {
  const { id } = req.params as any;
  const chart = await prisma.chart.findUnique({ 
    where: { id },
    include: { user: true }
  });
  
  if (!chart) return reply.status(404).send({ error: 'Not found' });
  if (chart.userId !== req.user.id && req.user.role !== 'admin') {
    return reply.status(403).send({ error: 'Forbidden' });
  }
  
  return {
    id: chart.id,
    meta: chart.meta ? JSON.parse(chart.meta) : null,
    data: JSON.parse(chart.data),
    createdAt: chart.createdAt,
    userId: chart.userId
  };
});

const start = async () => {
  try {
    await server.register(cors, { origin: process.env.CORS_ORIGIN || '*' });
    server.log.info('Starting server...');
    server.log.info(`Attempting to listen on ${HOST}:${PORT}`);
    await server.listen({ port: PORT, host: HOST as any });
    server.log.info(`Server is ready at http://${HOST}:${PORT}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    server.log.error(err as any);
    process.exit(1);
  }
};

start();
