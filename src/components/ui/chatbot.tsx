import React from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const fetchVehicleSolution = async (problem: string) => {
  const { data, error } = await supabase
    .from('vehicle_problems')
    .select('solution')
    .eq('problem', problem);

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

    setChatHistory((prev) => [...prev, `You: ${chatInput}`]);

    const solution = await fetchVehicleSolution(chatInput);
    setChatHistory((prev) => [...prev, `Bot: ${solution}`]);

    setChatInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg w-80">
      <div className="h-64 overflow-y-auto border-b mb-2">
        {chatHistory.map((message, index) => (
          <div key={index} className="mb-1 text-sm">
            {message}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Describe your vehicle problem..."
          className="flex-grow border p-2 rounded-l-lg"
        />
        <button
          onClick={handleSend}
          className="bg-quickfix-blue text-white px-4 py-2 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
