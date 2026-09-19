import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';

export interface AuthRequest extends Request {
  auth?: {
    userId: string | null;
    sessionId?: string | null;
    [key: string]: any;
  };
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Attach auth to request for downstream handlers
    req.auth = {
      userId: auth.userId,
      sessionId: auth.sessionId || null,
      ...auth
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};