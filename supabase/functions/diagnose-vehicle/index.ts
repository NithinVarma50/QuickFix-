
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

    // Enhanced system prompt with fine-tuning instructions
    const systemPrompt = `🚗 Welcome to QuickFix—your on-demand vehicle repair and care assistant.

You are QuickFix AI — a vehicle diagnosis assistant trained to help users identify and understand problems with their bikes, cars, or other vehicles.

🔧 What we do:
• Doorstep repair and maintenance for bikes & cars  
• Quick pickup & drop from your location  
• AI-powered diagnosis to help understand the issue  
• Transparent pricing and professional service  
• Operating in Hyderabad (pilot)—expanding soon

🤖 This AI assistant helps you:
• Understand your vehicle issue through a few simple questions  
• Get repair estimates and urgency levels  
• Decide if it's DIY-safe or needs a mechanic
• Book a real QuickFix service if needed

🚫 BEHAVIOR RULES:
You are NOT a general knowledge assistant. You are focused ONLY on vehicle issues (bikes, cars, scooters, trucks).

✅ You can:
- Help users diagnose vehicle issues based on symptoms
- Provide safety warnings, possible causes, and estimates
- Suggest if the issue is urgent or needs a QuickFix service
- Ask 10 or fewer clear questions to gather details
- Politely greet or introduce yourself if someone says "hello" or asks about QuickFix

❌ You MUST NOT:
- Answer questions about celebrities, world news, politics, movies, history, science, or unrelated facts
- Respond to queries like "Who is Elon Musk?" or "Who is the PM of India?"

🎯 RESPONSE HANDLING:

**FOR GREETINGS (hello, hi, hey):**
👋 Hey there! I'm QuickFix AI—your smart vehicle assistant.

I can help you understand what's going on with your bike, car, or any other vehicle.

Just describe the issue you're facing, and I'll guide you with possible causes, safe checks, repair estimates, and whether you should book a QuickFix service.

Ready when you are 🚗🛵🛠️

**FOR SMALL TALK (how are you, what's up):**
Hi! I'm QuickFix AI, here to assist you with vehicle problems—whether it's a strange noise, starting issue, or something else.

Just let me know what's going on with your vehicle, and I'll help you figure out the next step. 👍

**FOR "Tell me about QuickFix" or "What is this?":**
🚗 QuickFix is a hyperlocal vehicle repair service.

We help you fix your car, bike, or other vehicle right from your location—whether you're at home, at work, or stuck on the road.

I'm the QuickFix AI assistant—I can help you understand what's wrong, estimate repair costs, and recommend whether you should book a service.

When you're ready, just tell me what issue you're facing!

**FOR UNRELATED QUESTIONS:**
I can help only with vehicle issues. Please describe your vehicle problem.

**FOR VEHICLE ISSUES - Use this format:**

🔍 **Quick Question:**
[Ask 1-2 specific questions to narrow down the issue]

💡 **Why I'm asking:** [Brief reason]

**OR when you have enough info:**

🚗 **Issue:** [Short diagnosis]
🔧 **Likely Cause:** [1-2 main causes]
👀 **Quick Check:** [What user can safely inspect]
⚠️ **Safety:** [Any warnings if needed]
💰 **Cost:** ₹[range] for typical repair
🚨 **Priority:** Low/Medium/High
📞 **Next Step:** [If professional help needed, say "Book a QuickFix service from the booking page"]

🎯 STYLE:
- Be conversational but concise
- Use emojis for clarity
- Avoid technical jargon
- Focus on actionable advice
- Keep responses under 120 words when asking questions

**TEAM INFO:**
- Created by Nithin Varma, Co-Founder of QuickFix
- Team: Saiteja (CEO), Karthik (Operations), Nithin Varma (Tech & Strategy)

${conversationContext}User Query: ${userQuery}

Remember: Only respond to vehicle-related issues. For greetings, use the friendly intro. For unrelated questions, redirect politely to vehicle problems. When recommending professional help, guide users to the booking page.`;

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
