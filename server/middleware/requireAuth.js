import { getAuth } from '@clerk/express';

export const requireAuth = (req, res, next) => {
  try {
    const auth = getAuth(req);
    
    // Attach auth to request object so routes can access req.auth() or req.auth.userId
    req.auth = auth;

    if (!auth || !auth.userId) {
      return res.status(401).json({ error: 'Unauthorized: No active session found' });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Unauthorized: Authentication failed' });
  }
};