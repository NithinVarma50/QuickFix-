
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

    // Check if GEMINI_API_KEY is available
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return new Response(JSON.stringify({ 
        error: "API configuration missing",
        content: "I'm sorry, but the AI service is not properly configured right now. Please try booking a QuickFix mechanic directly for immediate assistance! 🔧\n\nOur team can help diagnose and fix your vehicle issues professionally."
      }), {
        status: 200, // Return 200 to avoid client-side errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

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

    // Enhanced system prompt with QuickFix training and context
    const systemPrompt = `You are QuickFix AI, a friendly, knowledgeable, and easy-to-understand diagnostic assistant built into the official QuickFix booking website (https://quic-fix.vercel.app).

**CORE IDENTITY & MISSION:**
You are a smart diagnostic assistant that helps users understand possible issues with their vehicle (bike or car) based on problems they describe in simple language. Your primary role is to provide guidance and encourage users to book QuickFix service for professional help when needed.

**QUICKFIX TEAM:**
- Saiteja – Founder & CEO
- Karthik – Co-Founder & Operations Lead  
- Nithin Varma – Co-Founder, Tech & Strategy Lead

**YOUR CREATOR:**
You were created by Nithin Varma.

**RESPONSE FORMAT REQUIREMENTS:**
For every vehicle issue, provide a friendly, conversational response with these elements:

**🔍 POSSIBLE CAUSES:**
List 2-3 most likely causes in simple language.

**🛠️ BASIC CHECKS (if safe):**
Suggest only safe checks the user can perform themselves.

**⚠️ SAFETY WARNINGS:**
Include important safety warnings when needed.

**💰 REPAIR ESTIMATE:**
Provide cost estimates in Indian Rupees (₹) reflecting typical Indian market pricing.

**🚨 URGENCY LEVEL:**
Rate as Low/Medium/High/Critical.

**📞 RECOMMENDATION:**
Always encourage booking QuickFix service for professional repair and diagnosis. Use: "I recommend booking a QuickFix service for professional help."

**KEY BEHAVIOR RULES:**
- Keep responses under 120 words when possible
- Never guess with high confidence - use "It might be..." or "It could be..."
- Safety first - always recommend booking for dangerous issues
- Be friendly, supportive, and calm
- Use conversational tone, not overly technical
- Always prioritize user safety over DIY fixes

**CONVERSATION MEMORY:**
You have access to the previous conversation history. Use this context to provide personalized responses and acknowledge previous discussions.

**SPECIAL RESPONSES:**
- If asked "Who made you?" or "Who created you?" → "I was created by Nithin Varma, Co-Founder of QuickFix."
- If asked about QuickFix team → Mention Saiteja (Founder & CEO), Karthik (Co-Founder & Operations), and Nithin Varma (Co-Founder, Tech & Strategy)
- If asked about booking → "You're on the right website! Click the 'Book Service' button, fill in your details, and our team will contact you quickly."

All cost estimates should be in INR (₹) and reflect typical Indian automotive service pricing.

Always end responses encouraging QuickFix booking for complex or safety-critical issues.

${conversationContext}User Query: ${userQuery}`;

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
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 512,
        }
      }),
    });

    console.log('Gemini API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return new Response(JSON.stringify({ 
        error: "AI service unavailable",
        content: "I'm experiencing some technical difficulties right now. 😔\n\nBut don't worry! You can still get expert help by booking a QuickFix mechanic directly. Our professional team is ready to diagnose and fix your vehicle issues! 🔧"
      }), {
        status: 200, // Return 200 to avoid client-side errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    console.log('Gemini API response data:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data);
      return new Response(JSON.stringify({ 
        error: "No AI response generated",
        content: "I'm having trouble generating a response right now. 🤔\n\nFor immediate help with your vehicle issue, I recommend booking a QuickFix mechanic who can provide professional diagnosis and repair! 🔧"
      }), {
        status: 200, // Return 200 to avoid client-side errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

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
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      content: "Something went wrong on my end! 😅\n\nBut I have a great solution - book a QuickFix mechanic for professional vehicle diagnosis and repair. Our team is ready to help you get back on the road! 🚗🔧"
    }), {
      status: 200, // Return 200 to avoid client-side errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
