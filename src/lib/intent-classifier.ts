// src/lib/intent-classifier.ts

export type IntentType = 'internal' | 'external' | 'uncertain';

export interface IntentClassification {
  type: IntentType;
  confidence: number; // 0-1
  reason: string;
}

// Keywords that indicate internal agency commands
const INTERNAL_KEYWORDS = [
  'show',
  'display',
  'list',
  'what is',
  'how many',
  'total',
  'revenue',
  'invoice',
  'client',
  'project',
  'task',
  'dashboard',
  'analytics',
  'report',
  'stats',
  'active',
  'pending',
  'overdue',
  'my',
  'our',
  'we',
  'us',
];

// Keywords that indicate external lead messages
const EXTERNAL_KEYWORDS = [
  'i need',
  'i want',
  'i am looking',
  'i require',
  'we need',
  'we want',
  'looking for',
  'hire',
  'services',
  'help',
  'quote',
  'price',
  'cost',
  'budget',
  'timeline',
  'deadline',
  'launch',
];

// Patterns that indicate budget/timeline (external lead)
const BUDGET_PATTERNS = [
  /\$\d+/, // $1000, $5K, etc.
  /\d+\s*k/i, // 10K, 5K, etc.
  /budget/i,
  /around\s*\$/i,
  /approximately\s*\$/i,
];

const TIMELINE_PATTERNS = [
  /deadline/i,
  /launch/i,
  /by\s+\w+\s+\d{4}/i, // by December 2026
  /within\s+\d+\s+weeks/i,
  /within\s+\d+\s+months/i,
  /q[1-4]\s*\d{4}/i, // Q4 2026
];

export function classifyIntent(query: string): IntentClassification {
  const lowerQuery = query.toLowerCase().trim();

  // Check for external lead indicators
  const hasExternalKeywords = EXTERNAL_KEYWORDS.some(keyword =>
    lowerQuery.includes(keyword)
  );
  const hasBudgetPattern = BUDGET_PATTERNS.some(pattern =>
    pattern.test(lowerQuery)
  );
  const hasTimelinePattern = TIMELINE_PATTERNS.some(pattern =>
    pattern.test(lowerQuery)
  );

  // Check for internal command indicators
  const hasInternalKeywords = INTERNAL_KEYWORDS.some(keyword =>
    lowerQuery.includes(keyword)
  );

  // Calculate scores
  let externalScore = 0;
  let internalScore = 0;

  if (hasExternalKeywords) externalScore += 0.4;
  if (hasBudgetPattern) externalScore += 0.3;
  if (hasTimelinePattern) externalScore += 0.3;

  if (hasInternalKeywords) internalScore += 0.5;

  // Check if query starts with internal command patterns
  if (
    lowerQuery.startsWith('show') ||
    lowerQuery.startsWith('display') ||
    lowerQuery.startsWith('list') ||
    lowerQuery.startsWith('what is') ||
    lowerQuery.startsWith('how many')
  ) {
    internalScore += 0.5;
  }

  // Determine intent
  if (externalScore > internalScore && externalScore >= 0.4) {
    return {
      type: 'external',
      confidence: externalScore,
      reason: 'Detected lead inquiry (budget, timeline, or service request)',
    };
  }

  if (internalScore > externalScore && internalScore >= 0.3) {
    return {
      type: 'internal',
      confidence: internalScore,
      reason: 'Detected internal agency command',
    };
  }

  // Uncertain - default to internal (safer)
  return {
    type: 'uncertain',
    confidence: 0.5,
    reason: 'Could not determine intent, defaulting to internal',
  };
}