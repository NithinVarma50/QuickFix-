
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { messages } = await req.json();
    console.log('Received messages:', messages);

    // Last message is the user's current query
    const userQuery = messages[messages.length - 1].content;
    console.log('Current user query:', userQuery);

    // Build conversation context from previous messages
    let conversationContext = '';
    if (messages.length > 1) {
      const previousMessages = messages.slice(0, -1);
      conversationContext = '\n\nPrevious conversation:\n';
      previousMessages.forEach((msg: any, index: number) => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversationContext += `${role}: ${msg.content}\n`;
      });
      conversationContext += '\nCurrent query:\n';
    }

    // Streamlined system prompt for organized responses
    const systemPrompt = `You are QuickFix AI — a friendly vehicle diagnostic assistant. Your responses should be CONCISE and WELL-ORGANIZED.

🎯 RESPONSE RULES:
- Keep responses under 120 words when asking questions
- Use clear headings and bullet points
- Ask max 2-3 focused questions at a time
- Provide diagnosis only when you have enough info

📝 RESPONSE FORMATS:

**FOR QUESTIONS (when you need more info):**
🔍 **Quick Question:**
[Ask 1-2 specific questions to narrow down the issue]

💡 **Why I'm asking:** [Brief reason]

**FOR DIAGNOSIS (when you have enough info):**
🚗 **Issue:** [Short diagnosis]
🔧 **Likely Cause:** [1-2 main causes]
👀 **Quick Check:** [What user can safely inspect]
⚠️ **Safety:** [Any warnings if needed]
💰 **Cost:** ₹[range] for typical repair
🚨 **Priority:** Low/Medium/High
📞 **Next Step:** [If professional help needed, say "Book a QuickFix service from the booking page" instead of providing links]

🎯 STYLE:
- Be conversational but concise
- Use emojis for clarity
- Avoid technical jargon
- Focus on actionable advice

**TEAM INFO:**
- Created by Nithin Varma, Co-Founder of QuickFix
- Team: Saiteja (CEO), Karthik (Operations), Nithin Varma (Tech & Strategy)

${conversationContext}User Query: ${userQuery}

Remember: Keep it SHORT and ORGANIZED. Use the format above based on whether you're asking questions or providing diagnosis. When recommending professional help, guide users to the booking page rather than external links.`;

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found');
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Making request to Gemini API...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
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
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 400,
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

    console.log('Gemini API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    console.log('Gemini API response data:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
      console.error('No valid response from Gemini:', data);
      
      const fallbackMessage = "I'm having trouble right now. 😔\n\nFor immediate help, visit our booking page to schedule a QuickFix mechanic.";
      
      return new Response(JSON.stringify({ content: fallbackMessage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    // Clean and format the response
    const cleanResponse = generatedText
      .replace(/\*\*(.*?)\*\*/g, '**$1**')
      .replace(/^\s*[\-\*]\s*/gm, '• ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return new Response(JSON.stringify({ content: cleanResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    
    const errorMessage = "Technical issue occurred. 😔\n\nVisit our booking page to schedule a QuickFix mechanic for immediate help! 🔧";
    
    return new Response(JSON.stringify({ content: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
