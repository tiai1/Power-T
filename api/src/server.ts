import Fastify from 'fastify';
import { z } from 'zod';

const server = Fastify({ logger: true });

const ChartCreate = z.object({
  meta: z.object({ type: z.string() }).optional(),
  data: z.any()
});

server.post('/charts', async (req, reply) => {
  const parsed = ChartCreate.safeParse(req.body);
  if (!parsed.success) return reply.status(400).send({ error: parsed.error.errors });
  const id = 'chart_' + Date.now();
  // TODO: persist with Prisma
  return { id };
});

server.get('/charts/:id', async (req, reply) => {
  const { id } = req.params as any;
  // stub
  return { id, meta: { type: 'waterfall' }, data: {} };
});

const start = async () => {
  try {
    console.log('Starting server...');
    const port = 8080;
    server.log.info(`Attempting to listen on port ${port}`);
    await server.listen({ port, host: '127.0.0.1' });
    console.log(`Server is ready at http://127.0.0.1:${port}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    server.log.error(err);
    process.exit(1);
  }
};

start();
