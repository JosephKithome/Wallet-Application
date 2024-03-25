import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Response {
      send: (body?: any) => Response;
    }
  }
}
