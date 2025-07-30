
// TypeScript: declare Deno for local dev to avoid errors. Safe for Supabase Edge Functions.
declare const Deno: {
  env: { get: (key: string) => string | undefined }
};

import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-ignore: This import works on Supabase Edge Functions (Deno), but not in Node.js/VSCode
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Add a unique request ID for easier tracking
    const requestId = Math.random().toString(36).substring(2, 10) + Date.now();
    let messages: any[] = [];
    try {
      const body = await req.json();
      if (!body || !Array.isArray(body.messages)) {
        throw new Error('Invalid request: messages array missing');
      }
      messages = body.messages;
    } catch (parseErr) {
      const errMsg = `[${requestId}] Invalid JSON or missing messages: ${parseErr}`;
      console.error(errMsg);
      return new Response(JSON.stringify({ error: errMsg, requestId }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    console.log(`[${requestId}] Received messages:`, messages);

    // Limit conversation history to last 10 (5 user + 5 assistant)
    const filteredMessages = messages.filter((m) => m.role === 'user' || m.role === 'assistant');
    const limitedMessages = filteredMessages.slice(-10);
    const userMessage = limitedMessages[limitedMessages.length - 1];
    const userQuery = userMessage?.content || '';
    console.log(`[${requestId}] Current user query:`, userQuery);

    // Build conversation context from previous messages
    let conversationContext = '';
    if (limitedMessages.length > 1) {
      const previousMessages = limitedMessages.slice(0, -1);
      conversationContext = '\n\nPrevious conversation context:\n';
      previousMessages.forEach((msg: any, index: number) => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversationContext += `${role}: ${msg.content}\n`;
      });
      conversationContext += '\nCurrent query:\n';
    }

    // Simplified system prompt for faster processing
    const systemPrompt = `You are QuickFix AI, a vehicle diagnostic assistant. 

Respond to vehicle issues with:
🔍 **POSSIBLE CAUSES:** 1-2 likely causes
🛠️ **BASIC CHECKS:** Safe user checks only  
⚠️ **SAFETY:** Important warnings when needed
💰 **COST:** Indian pricing (₹)
🚨 **URGENCY:** Low/Medium/High/Critical
📞 **ACTION:** "Book QuickFix service for professional help"

Keep under 100 words. For non-vehicle questions: "I help with vehicle issues only."

User: ${userQuery}`;

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      const errMsg = 'GEMINI_API_KEY not set.';
      console.error(errMsg);
      return new Response(JSON.stringify({ error: errMsg }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`[${requestId}] Making request to Gemini API...`);
    let data;
    let response;
    // Timeout Gemini API after 5 seconds to avoid edge function timeout
    const fetchWithTimeout = (url: string, options: any, timeout = 5000) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini API timeout')), timeout))
      ]);
    };
    try {
      response = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: systemPrompt
              }]
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 200,
              topP: 0.9,
              topK: 20
            }
          }),
        },
        5000
      );
      if (!(response && typeof response === 'object' && 'ok' in response)) {
        throw new Error('No response from Gemini API');
      }
      console.log(`[${requestId}] Gemini API response status:`, response.status);
      if (!response.ok) {
        const errorText = await response.text();
        let userFriendly = 'Unknown error.';
        if (errorText.includes('quota')) userFriendly = 'Gemini API quota exceeded.';
        if (errorText.includes('rate limit')) userFriendly = 'Gemini API rate limit reached.';
        if (errorText.includes('API key')) userFriendly = 'Gemini API key invalid or missing.';
        const errMsg = `[${requestId}] Gemini API error: ${userFriendly} (raw: ${errorText})`;
        console.error(errMsg);
        return new Response(JSON.stringify({ error: errMsg, requestId }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      data = await response.json();
      console.log(`[${requestId}] Gemini API response data:`, JSON.stringify(data, null, 2));
    } catch (apiError) {
      const errMsg = `[${requestId}] Gemini API fetch failed: ${apiError}`;
      console.error(errMsg);
      return new Response(JSON.stringify({ error: errMsg, requestId }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!data || !data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0 || !data.candidates[0].content?.parts?.[0]?.text) {
      const errMsg = `[${requestId}] No valid candidates in Gemini API response: ${JSON.stringify(data)}`;
      console.error(errMsg);
      return new Response(JSON.stringify({ error: errMsg, requestId }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const generatedText = data.candidates[0].content.parts[0].text;
    console.log(`[${requestId}] Generated text:`, generatedText);

    // Clean and format the response while preserving structure
    const cleanResponse = generatedText
      .replace(/\*\*(.*?)\*\*/g, '**$1**') // Keep bold formatting for headings
      .replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Remove most emojis except the ones we want
      .replace(/^\s*[\-\*]\s*/gm, '• ') // Convert bullet points to consistent format
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
      .trim();

    return new Response(JSON.stringify({ content: cleanResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    let errMsg = 'Error processing request: ';
    if (error instanceof Error) {
      errMsg += error.message;
    } else {
      errMsg += JSON.stringify(error);
    }
    console.error(errMsg);
    return new Response(JSON.stringify({ 
      error: errMsg
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
