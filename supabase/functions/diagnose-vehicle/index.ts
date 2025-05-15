
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

    // Last message is the user's query about vehicle issues
    const userQuery = messages[messages.length - 1].content;

    // Create a system prompt to guide the AI response
    const systemPrompt = `You are an expert automotive mechanic specialized in diagnosing vehicle issues.
    Your name is QuickFix AI Assistant. Use your extensive knowledge to provide helpful diagnoses for common car problems.
    Always try to provide:
    1. Possible causes of the problem
    2. Severity level (Low, Medium, High, Critical)
    3. Whether this requires immediate professional attention
    4. Any self-checks the car owner can perform
    5. Estimated repair costs (provide a range in Indian Rupees)
    
    Be helpful, professional and concise. Don't provide overly technical information that would confuse the average car owner.`;

    // Construct the API request for Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt }
            ],
            role: "system"
          },
          {
            parts: [
              { text: userQuery }
            ],
            role: "user"
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated from AI");
    }
    
    const generatedText = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ 
      role: "assistant",
      content: generatedText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in diagnose-vehicle function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
