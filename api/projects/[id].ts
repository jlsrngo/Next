import type { IncomingMessage, ServerResponse } from 'http';
import projectsHandler from '../projects';

export default async function handler(
  req: IncomingMessage & { query?: any; body?: any },
  res: ServerResponse
) {
  return projectsHandler(req, res);
}
