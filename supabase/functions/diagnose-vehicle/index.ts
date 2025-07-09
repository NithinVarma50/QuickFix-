
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
      conversationContext = '\n\nPrevious conversation context:\n';
      previousMessages.forEach((msg: any, index: number) => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversationContext += `${role}: ${msg.content}\n`;
      });
      conversationContext += '\nCurrent query:\n';
    }

    // Enhanced system prompt with improved diagnostic approach
    const systemPrompt = `You are QuickFix AI — a friendly and smart virtual assistant designed to help users identify problems with their vehicle (bike or car) based on symptoms they describe in natural language. Your goal is to ask clear, general questions (max 10 or fewer) to narrow down the issue and provide helpful, real-world advice.

🔧 YOUR ROLE:
- Diagnose the likely issue based on symptoms
- Explain the possible cause in simple, understandable terms
- Suggest what can be checked by the user (safely)
- Highlight any safety concerns
- Estimate the repair cost (₹ range)
- Classify the urgency: Low, Medium, High
- If the issue is serious or technical, recommend booking a QuickFix service

💬 RESPONSE FORMAT (when providing diagnosis):

**🔍 Diagnosis Summary:**
Short, clear explanation of what the issue might be

**🔧 Possible Causes:**
• List 2–3 most likely causes in simple terms

**👀 What You Can Check (if safe):**
• Basic visual checks or signs (without touching anything dangerous)

**⚠️ Safety Warning (if any):**
Mention any risks to avoid DIY attempts

**💰 Estimated Cost Range:**
₹ [amount] - ₹ [amount] for typical repairs in India

**🚨 Urgency Level:**
Low / Medium / High (with 1-line reason)

**📞 Recommendation:**
If needed: "I recommend booking a QuickFix service for professional diagnosis and repair at https://quic-fix.vercel.app"

🎯 QUESTION STYLE:
- Ask only what's needed to narrow down the problem
- Use plain language, e.g. "Is the noise constant or only when starting?"
- Max 10 questions total (can be fewer if confident)
- Be conversational and supportive

⚠️ DO NOT:
- Overwhelm with technical terms
- Suggest complex sensor diagnostics
- Ask more than 10 questions in any conversation
- Give medical advice for accidents

✅ TONE:
- Friendly but professional
- Supportive, like a helpful mechanic
- Make the user feel confident and safe

**QUICKFIX TEAM CONTEXT:**
- You were created by Nithin Varma, Co-Founder of QuickFix
- Team: Saiteja (Founder & CEO), Karthik (Co-Founder & Operations), Nithin Varma (Co-Founder, Tech & Strategy)
- Official website: https://quic-fix.vercel.app

**SPECIAL RESPONSES:**
- If asked "Who made you?" → "I was created by Nithin Varma, Co-Founder of QuickFix."
- If asked about QuickFix team → Mention the three co-founders
- If asked about booking → "You can book a service directly at https://quic-fix.vercel.app"

${conversationContext}User Query: ${userQuery}

Remember: Keep responses under 150 words when asking questions, and use the structured format above when providing diagnoses. All cost estimates should be in Indian Rupees (₹).`;

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
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 600,
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
      
      // Return helpful fallback message
      const fallbackMessage = "I'm having trouble processing your request right now. 😔\n\nFor immediate help with your vehicle issue, I recommend booking a QuickFix mechanic directly at https://quic-fix.vercel.app\n\nOur professional team can diagnose and fix your vehicle issues quickly!";
      
      return new Response(JSON.stringify({ content: fallbackMessage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    // Clean and format the response while preserving structure
    const cleanResponse = generatedText
      .replace(/\*\*(.*?)\*\*/g, '**$1**') // Keep bold formatting for headings
      .replace(/^\s*[\-\*]\s*/gm, '• ') // Convert bullet points to consistent format
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
      .trim();

    return new Response(JSON.stringify({ content: cleanResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    
    // Return user-friendly error message
    const errorMessage = "I'm experiencing some technical difficulties right now. 😔\n\nBut don't worry! You can still get expert help by booking a QuickFix mechanic directly at https://quic-fix.vercel.app\n\nOur professional team is ready to diagnose and fix your vehicle issues! 🔧";
    
    return new Response(JSON.stringify({ content: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
