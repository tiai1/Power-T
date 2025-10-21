import { FastifyRequest, FastifyReply } from 'fastify';

let requestCount = 0;
const startTime = Date.now();

export function getMetrics() {
  return {
    uptime: process.uptime(),
    requestCount,
    memoryUsage: process.memoryUsage(),
    startTime: new Date(startTime).toISOString()
  };
}

export async function metricsMiddleware(request: FastifyRequest, reply: FastifyReply) {
  requestCount++;
  
  // Add timing
  const start = process.hrtime();
  reply.raw.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;
    request.log.info({ 
      msg: 'Request completed',
      method: request.method,
      url: request.url,
      statusCode: reply.raw.statusCode,
      duration: `${duration.toFixed(2)}ms`
    });
  });
}