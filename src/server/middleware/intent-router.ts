// src/server/middleware/intent-router.ts

import { Request, Response, NextFunction } from 'express';

export interface IntentRouterRequest extends Request {
  intent?: {
    type: 'internal' | 'external';
    confidence: number;
  };
}

// Same classification logic as frontend (for validation)
function classifyIntent(query: string): 'internal' | 'external' {
  const lowerQuery = query.toLowerCase().trim();

  const INTERNAL_KEYWORDS = ['show', 'display', 'list', 'what is', 'how many', 'total', 'revenue', 'invoice'];
  const EXTERNAL_KEYWORDS = ['i need', 'i want', 'looking for', 'hire', 'services', 'quote', 'budget'];

  const hasInternalKeywords = INTERNAL_KEYWORDS.some(k => lowerQuery.includes(k));
  const hasExternalKeywords = EXTERNAL_KEYWORDS.some(k => lowerQuery.includes(k));

  if (hasExternalKeywords && !hasInternalKeywords) return 'external';
  if (hasInternalKeywords && !hasExternalKeywords) return 'internal';

  // Default to internal (safer)
  return 'internal';
}

export const intentRouter = (
  req: IntentRouterRequest,
  res: Response,
  next: NextFunction
) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Classify intent
  const intentType = classifyIntent(query);

  // Attach intent to request
  req.intent = {
    type: intentType,
    confidence: 0.8, // Simplified for backend
  };

  next();
};