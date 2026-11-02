import type { IncomingMessage, ServerResponse } from 'http';
import experiencesHandler from '../experiences';

export default async function handler(
  req: IncomingMessage & { query?: any; body?: any },
  res: ServerResponse
) {
  return experiencesHandler(req, res);
}
