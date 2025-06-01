
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LoginNotificationRequest {
  email: string;
  name?: string;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, timestamp }: LoginNotificationRequest = await req.json();

    console.log(`Sending login notification for user: ${email}`);

    // Send webhook to your n8n backend
    const webhookResponse = await fetch("https://pixelprophett.app.n8n.cloud/webhook-test/03504e89-d39a-47ad-9506-3027405b6a9c", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "user_login",
        user: {
          email: email,
          name: name || "User",
        },
        timestamp: timestamp,
        source: "QuickFix",
      }),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook failed with status: ${webhookResponse.status}`);
    }

    const webhookResult = await webhookResponse.text();
    console.log("Webhook sent successfully:", webhookResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Login notification sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-login-notification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
