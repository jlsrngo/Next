import type { IncomingMessage, ServerResponse } from 'http';
import educationHandler from '../education';

export default async function handler(
  req: IncomingMessage & { query?: any; body?: any },
  res: ServerResponse
) {
  return educationHandler(req, res);
}
