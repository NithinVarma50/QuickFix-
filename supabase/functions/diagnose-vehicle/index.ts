
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Node.js version for Supabase Edge Functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export default async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    console.log('Received messages:', messages);

    // Last message is the user's query about vehicle issues
    const userQuery = messages[messages.length - 1].content;
    console.log('User query:', userQuery);

    // Updated system prompt for concise, formal responses
    const systemPrompt = `You are QuickFix AI, a professional vehicle diagnostic assistant.

Response requirements:
- Generate responses that are concise, clear, and helpful
- Avoid unnecessary location references unless explicitly asked
- Do not use informal symbols such as markdown, asterisks, or emojis
- Exclude region-specific examples unless prompted
- Use formal language
- Keep responses short, direct, and focused strictly on the user's query

For every vehicle issue, provide:
1. Possible causes (2-3 most likely ones)
2. Safe DIY checks the user can perform (if any)
3. Safety warnings when needed
4. Estimated repair cost range
5. Urgency level: Low/Medium/High/Critical

Always prioritize user safety. For critical issues involving brakes, steering, or engine overheating, emphasize immediate professional attention.

User Query: ${userQuery}`;

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 512,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data);
      return new Response(JSON.stringify({ error: "No response generated from AI" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    let generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    // Clean and format the response
    const cleanResponse = generatedText
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
      .replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Remove emojis
      .replace(/^\s*[\-\*]\s*/gm, '') // Remove bullet points
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
      .trim();

    return new Response(JSON.stringify({ content: cleanResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
