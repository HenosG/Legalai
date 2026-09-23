import express from 'express';
import { requireAuth } from '../middleware/clerk';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/ai-assistant (Internal agency queries)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.auth.userId;

    // Process internal query
    const result = await processInternalQuery(userId, query);

    res.json(result);
  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({ error: 'Failed to process internal query' });
  }
});

// Helper function to process internal queries
async function processInternalQuery(userId: string, query: string) {
  const lowerQuery = query.toLowerCase();

  // Example: "Show me active clients"
  if (lowerQuery.includes('active client') || lowerQuery.includes('clients')) {
    const clients = await prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return {
      type: 'client_list',
      data: clients,
      message: `Found ${clients.length} clients`,
    };
  }

  // Example: "What is total outstanding invoice amount"
  if (lowerQuery.includes('invoice') || lowerQuery.includes('revenue')) {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
    });
    
    const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
    const unpaid = invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0);
    
    return {
      type: 'invoice_summary',
      data: { total, paid, unpaid, count: invoices.length },
      message: `Total: $${total.toLocaleString()} (Paid: $${paid.toLocaleString()}, Unpaid: $${unpaid.toLocaleString()})`,
    };
  }

  // Example: "Show me my projects"
  if (lowerQuery.includes('project')) {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return {
      type: 'project_list',
      data: projects,
      message: `Found ${projects.length} projects`,
    };
  }

  // Default: Use AI to generate response
  return {
    type: 'ai_response',
    data: { 
      message: 'I can help with that. Try asking about clients, invoices, or projects.',
      suggestions: [
        'Show me active clients',
        'What is total revenue',
        'List my projects',
      ],
    },
  };
}

export default router;