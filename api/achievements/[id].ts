import type { IncomingMessage, ServerResponse } from 'http';
import achievementsHandler from '../achievements';

export default async function handler(
  req: IncomingMessage & { query?: any; body?: any },
  res: ServerResponse
) {
  return achievementsHandler(req, res);
}
