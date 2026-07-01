import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, X, RefreshCw, User, HelpCircle } from 'lucide-react';
import { FitProfile, Product } from '../types';

interface AIStylistProps {
  fitProfile?: FitProfile;
  currentProduct?: Product | null;
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIStylist({ fitProfile, currentProduct, onClose }: AIStylistProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `Greetings. I am your VIVIDHRA Atelier Styling Advisor. 
How may I assist you with your wardrobe selections, custom sizes, or fabric structures today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    ...(currentProduct ? [`How should I style the ${currentProduct.name}?`] : []),
    "What silhouette fits an hourglass body shape?",
    "Tell me about the story of 'Dress with purpose'",
    "How sustainable are VIVIDHRA fabrics?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content
      }));

      const res = await fetch('/api/gemini/styling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          fitProfile,
          currentProduct,
          chatHistory
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'assistant',
          content: data.response || 'Apologies, I am having trouble weaving styling advice at this moment.'
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'assistant',
          content: 'Apologies, my creative thread got caught. Please try again soon.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fafaf9] rounded-2xl overflow-hidden border border-[#e7e5e4] shadow-2xl">
      
      {/* Editorial AI Header */}
      <div className="bg-[#1c1917] text-white p-4 flex items-center justify-between border-b border-[#2e2a28]">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#c2a46c]/20 text-[#c2a46c] rounded-full">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="serif-header text-sm font-bold tracking-wider">
              VIVIDHRA AI ATELIER
            </h3>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#a8a29e]">
              Personalized Styling Advisor
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-[#a8a29e] hover:text-[#fafaf9] rounded-full hover:bg-white/5 transition-all cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {/* Context Banner */}
      {(currentProduct || fitProfile) && (
        <div className="bg-[#f5f5f4] border-b border-[#e7e5e4] px-4 py-2 flex items-center justify-between text-[10px] text-[#57534e]">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-[#0f766e] rounded-full animate-ping" />
            <p className="font-outfit truncate max-w-[140px] xs:max-w-[180px] sm:max-w-[240px]">
              Active context:{' '}
              <span className="font-bold text-[#1c1917]">
                {[
                  currentProduct ? currentProduct.name : null,
                  fitProfile ? `${fitProfile.bodyType} Fit Profile` : null
                ]
                  .filter(Boolean)
                  .join(' & ')}
              </span>
            </p>
          </div>
          <button
            onClick={() => {
              setMessages([
                {
                  id: 'init_reset',
                  role: 'assistant',
                  content: 'Creative thread refreshed. How else can I guide your wardrobe selections today?'
                }
              ]);
            }}
            className="text-[9px] uppercase tracking-wider font-mono text-[#c2a46c] hover:underline"
            title="Clear Chat History"
          >
            Reset Thread
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                m.role === 'user' ? 'bg-[#1c1917] text-white' : 'bg-[#c2a46c]/10 text-[#c2a46c]'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : 'V'}
            </div>

            <div
              className={`p-3.5 rounded-xl text-xs max-w-[82%] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#1c1917] text-white font-outfit'
                  : 'bg-white border border-[#e7e5e4] text-[#1c1917] font-sans font-light'
              }`}
            >
              <p className="whitespace-pre-line">{m.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-[#c2a46c]/10 text-[#c2a46c] flex items-center justify-center text-[10px] font-bold animate-pulse">
              V
            </div>
            <div className="p-3.5 bg-white border border-[#e7e5e4] rounded-xl flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c2a46c]" />
              <span className="text-[10px] text-[#78716c] font-mono">Consulting our stylists...</span>
            </div>
          </div>
        )}

        <div ref={scrollToBottom} />
      </div>

      {/* Quick Presets */}
      {messages.length === 1 && (
        <div className="p-3 bg-[#f5f5f4] border-t border-[#e7e5e4] space-y-1.5">
          <p className="text-[9px] uppercase tracking-wider text-[#78716c] font-mono">
            Suggested Consultation Queries
          </p>
          <div className="flex flex-col gap-1">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => handleSend(preset)}
                className="text-left py-1.5 px-3 bg-white hover:bg-[#1c1917] hover:text-white border border-[#e7e5e4] rounded-lg text-[11px] font-outfit text-[#57534e] transition-all truncate cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 bg-white border-t border-[#e7e5e4] flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask our atelier stylists..."
          className="flex-1 px-4 py-2.5 bg-[#f5f5f4] rounded-xl border border-[#e7e5e4] text-xs font-outfit focus:outline-hidden focus:border-[#1c1917] focus:bg-white transition-all"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 bg-[#1c1917] hover:bg-[#3c3734] text-white rounded-xl transition-all disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
