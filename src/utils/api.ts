
const SUPABASE_URL = "https://ckkrogkfdstroqgudqgp.supabase.co";

export const callEdgeFunction = async (functionName: string, payload: any) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNra3JvZ2tmZHN0cm9xZ3VkcWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzcyMTIsImV4cCI6MjA2MjgxMzIxMn0.7NLpftlEnZ2QtEC4bvwtebTbd-0hr5Ey8uo29HfO1ac'}`,
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (error) {
    console.error(`Error calling edge function ${functionName}:`, error);
    throw error;
  }
};
