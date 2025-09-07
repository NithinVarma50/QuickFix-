
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
      console.log(`[${requestId}] Raw request body:`, JSON.stringify(body));
      
      if (!body) {
        throw new Error('Empty request body');
      }
      
      // Check if messages array exists and is valid
      if (!body.messages) {
        console.error(`[${requestId}] No messages field in body:`, body);
        throw new Error('Invalid request: messages field missing');
      }
      
      if (!Array.isArray(body.messages)) {
        console.error(`[${requestId}] Messages is not an array:`, typeof body.messages);
        throw new Error('Invalid request: messages must be an array');
      }
      
      if (body.messages.length === 0) {
        console.error(`[${requestId}] Empty messages array`);
        throw new Error('Invalid request: messages array is empty');
      }
      
      messages = body.messages;
    } catch (parseErr) {
      const errMsg = `[${requestId}] JSON parse or validation error: ${parseErr}`;
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

    // Enhanced system prompt based on training data
    const systemPrompt = `You are QuickFix AI, created by Nithin Varma (Co-Founder, COO & Tech Architect of QuickFix). You only answer about vehicles, QuickFix, and the QuickFix team. 

QUICKFIX TEAM:
- Saiteja (Founder & CEO): Vision, innovation, partnerships, pricing, expansion
- Karthik (Co-Founder & Operations Lead): On-ground logistics, pickups, drops, customer relations
- Nithin Varma (Co-Founder, COO & Tech Architect): Created QuickFix AI, platform development, scaling strategy
- Philip (R&D Associate): Tests ideas, finds flaws, ensures features are practical

QUICKFIX CURRENT MODEL:
1. Book online at https://quic-fix.vercel.app
2. We pick up your vehicle from your location
3. Trusted partner mechanics repair it
4. We deliver it back once complete

FUTURE PLAN:
🚐 Mobile Repair Vans (10-minute doorstep service)
🛠️ Franchise Model (mechanics own vans with QuickFix branding)
🏪 Dark Stores (supply hubs for vans)

For vehicle issues, respond with:
🔍 **POSSIBLE CAUSES:** 1-2 likely causes
🛠️ **BASIC CHECKS:** Safe user checks only
⚠️ **SAFETY:** Important warnings when needed  
💰 **COST:** Indian pricing (₹)
✅ **RECOMMENDATION:** Book QuickFix service for professional repair

For non-vehicle questions: "I am QuickFix AI — I only answer questions about vehicles, QuickFix, and our startup. 🚗🔧"

Keep responses under 150 words. Always end with suggesting QuickFix booking.

${conversationContext}User: ${userQuery}`;

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
