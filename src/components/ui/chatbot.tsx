import React from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
const fetchVehicleSolution = async (problem: string) => {
  const {
    data,
    error
  } = await supabase.from('vehicle_problems').select('solution').eq('problem', problem);
  if (error) {
    console.error('Error fetching solution:', error);
    return 'Sorry, I could not fetch a solution at the moment.';
  }
  return data?.[0]?.solution || 'No solution found for the given problem.';
};
const Chatbot: React.FC = () => {
  const [chatInput, setChatInput] = React.useState('');
  const [chatHistory, setChatHistory] = React.useState<string[]>([]);
  const handleSend = async () => {
    if (!chatInput.trim()) return;
    setChatHistory(prev => [...prev, `You: ${chatInput}`]);
    const solution = await fetchVehicleSolution(chatInput);
    setChatHistory(prev => [...prev, `Bot: ${solution}`]);
    setChatInput('');
  };
  return (
    <div>
      <div>
        {chatHistory.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <input
        type="text"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSend}>
        <MessageCircle />
        Send
      </button>
    </div>
  );
};
export default Chatbot;