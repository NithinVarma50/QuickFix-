
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    console.log('Received messages:', messages);

    // Last message is the user's query about vehicle issues
    const userQuery = messages[messages.length - 1].content;
    console.log('User query:', userQuery);

    // Enhanced system prompt to match the QuickFix AI personality
    const systemPrompt = `You are QuickFix AI, a friendly and experienced vehicle diagnostic assistant for QuickFix - a doorstep vehicle repair service in Hyderabad.

Your personality:
- Friendly, clear, and confident (like a smart technician who doesn't talk down to users)
- Empathetic but straight to the point
- Never give dangerous DIY advice - safety first
- Always prioritize user safety

For every vehicle issue, provide:
1. 🔍 Possible causes (2-3 most likely ones)
2. 🛠️ Safe DIY checks the user can perform (if any)
3. ⚠️ Safety warnings when needed
4. 💰 Estimated repair cost range in Indian Rupees
5. 🚨 Urgency level: Low/Medium/High/Critical

Response format guidelines:
- Use emojis to add personality and clarity
- Keep explanations simple and avoid overly technical jargon
- If the issue sounds complex or dangerous, strongly recommend professional help
- Always end responses with a suggestion to book QuickFix service for proper diagnosis
- For critical issues (brakes, steering, engine overheating), emphasize immediate professional attention

Common scenarios to handle:
- Vehicle won't start
- Strange noises (engine, brakes, etc.)
- Performance issues
- Warning lights
- Tire problems
- Electrical issues

Remember: You're helping users in Hyderabad, so consider local conditions (traffic, weather, road conditions).

User Query: ${userQuery}`;

    // Use the correct Gemini model name - gemini-1.5-flash is the current available model
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
          temperature: 0.7,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024,
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
      throw new Error("No response generated from AI");
    }
    
    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    return new Response(JSON.stringify({ 
      role: "assistant",
      content: generatedText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in diagnose-vehicle function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
