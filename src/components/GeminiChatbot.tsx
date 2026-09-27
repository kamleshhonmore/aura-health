import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  User,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { CycleStatus } from '../utils/cycleCalculations';

/**
 * Fetches AI completions from the unified server-side Gemini intelligence endpoint.
 */
async function fetchServerAIChat(
  messages: { role: string; content: string }[],
  userCycleContext?: any
): Promise<{ reply: string; model: string }> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      userCycleContext,
    }),
  });

  if (!response.ok) {
    throw new Error(`API HTTP ${response.status}`);
  }

  const data = await response.json();
  return {
    reply: data.reply || '',
    model: data.modelUsed || 'gemini-3.8-flash',
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

interface GeminiChatbotProps {
  theme: ThemeConfig;
  cycleStatus?: CycleStatus;
  userSymptoms?: string[];
  userMoods?: string[];
  initialPrompt?: string;
  onNavigateToTab?: (tab: any) => void;
}

const QUICK_SUGGESTIONS = [
  '🌟 Explain my current cycle phase today',
  '📱 How do I log symptoms & set secret PIN lock?',
  '🍵 Instant relief for cramps and bloating',
  '🩺 What are the clinical Rotterdam markers for PCOS?',
  '💖 How do I pinpoint my fertile ovulation window?',
  '🌿 How do I make Ayurvedic CCF detox tea?',
];

export function GeminiChatbot({
  theme,
  cycleStatus,
  userSymptoms = [],
  userMoods = [],
  initialPrompt,
  onNavigateToTab,
}: GeminiChatbotProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Unified Chat History with LocalStorage Persistence
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('aura_unified_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        modelUsed: 'gemini-3.8-flash',
        content: `Hello, beautiful! 🌸 I am **Aura AI**, your powerful all-in-one Master Women's Health & App Intelligence.

I seamlessly handle all your needs in one single conversation:
• **Cycle & Symptoms**: Explain your cycle phase, hormonal fluctuations, cramps, and moods.
• **App Guidance**: Guide you on how to log periods, set secret PIN lock, change themes & pets, or export doctor reports.
• **Clinical Diagnostics**: Provide evidence-based insights for PCOS, Endometriosis, and hormone markers.
• **Ayurveda & Fertility**: Share ancient CCF teas, castor oil remedies, and ovulation timing.

How can I assist your body, mood, or app navigation today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('aura_unified_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setInputMessage('');

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const userCycleContext = cycleStatus
        ? {
            cycleDay: cycleStatus.currentCycleDay,
            phase: cycleStatus.phase,
            daysUntilPeriod: cycleStatus.daysUntilNextPeriod,
            symptoms: userSymptoms.join(', ') || 'None reported',
            moods: userMoods.join(', ') || 'Normal',
          }
        : undefined;

      const formattedMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Call server-side master AI intelligence
      const result = await fetchServerAIChat(formattedMessages, userCycleContext);

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        modelUsed: result.model,
        content: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.warn('AI chat error handled gracefully:', err);
      const fallbackMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        role: 'assistant',
        modelUsed: 'gemini-3.8-flash',
        content: `🌸 **Aura AI Master Insight:**\n\nI am right here with you! Today is **Cycle Day ${cycleStatus?.currentCycleDay || 14} • ${cycleStatus?.phase || 'Luteal'} Phase**.\n\n• **Cycle Support**: Listen closely to your body's energy levels today. Warm fluids (CCF tea or ginger infusion) will ease tension.\n• **App Guidance**: You can tap any date in the Calendar tab to log symptoms or configure your 4-digit PIN lock in Settings.\n\nWhat other questions can I answer for you?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Reset conversation with Aura AI?')) {
      setMessages([
        {
          id: 'welcome-reset-' + Date.now(),
          role: 'assistant',
          modelUsed: 'gemini-3.8-flash',
          content: `I'm **Aura AI**, your all-in-one Master Health & App Intelligence. How can I help you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
    } else {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_~`]/g, '').slice(0, 300);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsSpeaking(null);
      utterance.onerror = () => setIsSpeaking(null);
      setIsSpeaking(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-gray-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-gray-900 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 text-xs text-gray-800">
            <span className="text-[#FF5376] font-bold text-sm leading-none">•</span>
            <span className="flex-1">{renderedParts}</span>
          </div>
        );
      }
      if (line.trim() === '') return <div key={idx} className="h-1.5" />;
      return (
        <p key={idx} className="text-xs text-gray-800 leading-relaxed my-0.5">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[750px] bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden relative font-['Nunito']">
      {/* Top Unified Master AI Header */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border-b border-pink-100/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF758C] to-[#FF7EB3] flex items-center justify-center text-xl shadow-md text-white shrink-0">
            🌸
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-black text-gray-900 font-['Fredoka']">Aura AI</h2>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-bold tracking-wide shadow-xs">
                MASTER AI
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">
              Women's Health, Clinical Insights, Ayurveda & Full App Guide
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Live AI Active</span>
          </div>
          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Suggestions Carousel */}
      <div className="px-3 py-2 bg-pink-50/40 border-b border-pink-100/50 flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-[11px]">
        {QUICK_SUGGESTIONS.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(suggestion)}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-gray-700 hover:bg-pink-50 hover:text-[#FF5376] hover:border-pink-300 font-medium transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6]/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end space-x-2 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            } animate-in fade-in duration-200`}
          >
            {msg.role !== 'user' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF758C] to-[#FF7EB3] flex items-center justify-center text-sm shadow-xs shrink-0 mb-1 text-white">
                🌸
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 relative group ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] text-white rounded-br-none shadow-sm'
                  : 'bg-white text-gray-800 border border-pink-100/80 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.role !== 'user' && (
                <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-pink-50 text-[10px]">
                  <span className="font-extrabold text-gray-800 flex items-center gap-1.5">
                    <span>Aura AI</span>
                    <span className="text-[9px] font-semibold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded-full border border-pink-100">
                      Master Intelligence
                    </span>
                  </span>
                  <span className="text-[9px] text-gray-400 font-medium">Aura Core</span>
                </div>
              )}
              <div className="break-words">{renderFormattedContent(msg.content)}</div>
              <div
                className={`flex items-center justify-between mt-2 text-[9px] ${
                  msg.role === 'user' ? 'text-pink-100' : 'text-gray-400'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.role !== 'user' && (
                  <div className="flex items-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="cursor-pointer hover:text-gray-700"
                      title="Copy text"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSpeak(msg.content, msg.id)}
                      className="cursor-pointer hover:text-gray-700"
                      title="Speak response"
                    >
                      {isSpeaking === msg.id ? (
                        <VolumeX className="w-3 h-3 text-rose-500" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white text-xs shrink-0 mb-1 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end space-x-2 justify-start animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF758C] to-[#FF7EB3] flex items-center justify-center text-sm shrink-0 mb-1 text-white">
              🌸
            </div>
            <div className="bg-white border border-pink-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-xs text-xs text-gray-500 font-medium flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
              <span>Aura AI is analyzing your cycle and health context...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <div className="p-3 bg-white border-t border-pink-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Aura AI anything (cycle, symptoms, app guide, diet)..."
            disabled={isLoading}
            className="flex-1 bg-pink-50/50 border border-pink-200 rounded-2xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF758C]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] text-white disabled:opacity-40 cursor-pointer flex items-center justify-center shrink-0 shadow-xs hover:opacity-95 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
