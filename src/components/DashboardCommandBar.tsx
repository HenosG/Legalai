// src/components/DashboardCommandBar.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import { classifyIntent, IntentClassification } from '../lib/intent-classifier';

export default function DashboardCommandBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [intent, setIntent] = useState<IntentClassification | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);

    // 1. Classify intent
    const intentClassification = classifyIntent(query);
    setIntent(intentClassification);

    try {
      // 2. Route based on intent
      if (intentClassification.type === 'external') {
        // Route to AI Intake (lead parsing)
        await handleExternalLead(query);
      } else {
        // Route to AI Assistant (internal query)
        await handleInternalQuery(query);
      }
    } catch (error) {
      console.error('Command processing error:', error);
      // Show error UI
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExternalLead = async (query: string) => {
    // Redirect to AI Intake with query
    router.push(`/ai-intake?query=${encodeURIComponent(query)}&channel=command`);
  };

  const handleInternalQuery = async (query: string) => {
    // Call AI Assistant API
    const response = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error('AI Assistant failed');

    const data = await response.json();

    // Show AI Assistant response (modal, sidebar, or inline)
    showAssistantResponse(data);
  };

  const showAssistantResponse = (data: any) => {
    // Open AI Assistant UI (modal, sidebar, or inline card)
    // This is where you show the response from the AI Assistant
    console.log('Assistant Response:', data);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask Reluno anything about your agency..."
        className="w-full px-4 py-3 pl-12 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      {/* Intent Indicator (Optional, for debugging) */}
      {intent && (
        <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
          <span
            className={`text-xs px-2 py-1 rounded ${
              intent.type === 'external'
                ? 'bg-green-100 text-green-800'
                : intent.type === 'internal'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {intent.type === 'external' ? 'Lead' : intent.type === 'internal' ? 'Internal' : 'Uncertain'}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !query.trim()}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
      >
        {isProcessing ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
      </button>
    </form>
  );
}