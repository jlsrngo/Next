import type { IncomingMessage, ServerResponse } from 'http';
import { handleRequest } from './_router';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  return handleRequest(req as any, res as any);
}
