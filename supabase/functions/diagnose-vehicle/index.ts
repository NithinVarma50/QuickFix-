import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Node.js version for Supabase Edge Functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export default async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).set(corsHeaders).send('');
  }

  try {
    const { messages } = req.body;
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

    const geminiApiKey = process.env.GEMINI_API_KEY;
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
      return res.status(500).set(corsHeaders).json({ error: "No response generated from AI" });
    }
    
    let generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    // Post-process the AI answer: remove star marks, markdown, and organize results
    function cleanAndOrganizeAIAnswer(answer) {
      // Remove markdown bold/italic and leading * or - or numbers
      const stripMarkdown = (text) => text
        .replace(/\*\*(.*?)\*\*/g, '$1') // bold
        .replace(/\*(.*?)\*/g, '$1') // italic
        .replace(/__([^_]+)__/g, '$1') // underline
        .replace(/`([^`]+)`/g, '$1') // inline code
        .replace(/^\s*([*-]|\d+\.)\s*/, '') // leading * or - or number
        .replace(/^[\s*-]+/, '') // leading * or -
        .replace(/^\d+\.\s*/, '') // leading numbers
        .replace(/^\s+/, '') // leading whitespace
        .replace(/\*/g, '') // remove all remaining *
        .replace(/^-\s*/, ''); // leading -

      const lines = answer.split('\n').map(stripMarkdown).map(line => line.trim());
      // Group lines by section headers
      const sections = {
        'Possible causes': [],
        'Safe DIY checks': [],
        'Safety warnings': [],
        'Estimated repair cost': [],
        'Urgency level': [],
        'Other': []
      };
      let currentSection = 'Other';
      for (const line of lines) {
        if (/possible causes/i.test(line)) currentSection = 'Possible causes';
        else if (/safe diy checks/i.test(line)) currentSection = 'Safe DIY checks';
        else if (/safety warnings?/i.test(line)) currentSection = 'Safety warnings';
        else if (/estimated repair cost/i.test(line)) currentSection = 'Estimated repair cost';
        else if (/urgency level/i.test(line)) currentSection = 'Urgency level';
        else if (/^\s*$/i.test(line)) continue;
        else sections[currentSection].push(line);
      }
      // Build organized result as a string
      let organized = '';
      for (const [section, content] of Object.entries(sections)) {
        if (content.length > 0) {
          organized += `\n${section}:\n` + content.map(l => `• ${l}`).join('\n');
        }
      }
      return organized.trim();
    }

    const organizedText = cleanAndOrganizeAIAnswer(generatedText);

    return res.status(200).set(corsHeaders).json({
      role: "assistant",
      content: organizedText
    });
  } catch (error) {
    console.error('Error in diagnose-vehicle function:', error);
    return res.status(500).set(corsHeaders).json({ error: error.message });
  }
};
