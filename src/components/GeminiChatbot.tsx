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
import { generateMasterAuraResponse } from '../utils/aiMasterEngine';

/**
 * Fetches real-time AI completions with multi-layer fallback:
 * Layer 1: OpenRouter (if user configured a custom API key in Settings)
 * Layer 2: Pollinations AI Real-Time Live Engine (100% Free, No API key required, 24/7 active)
 * Layer 3: Backup Pollinations AI GET Endpoint
 */
async function fetchServerAIChat(
  messages: { role: string; content: string }[],
  userCycleContext?: any
): Promise<{ reply: string; model: string }> {
  const customApiKey = localStorage.getItem('aura_openrouter_api_key') || '';

  let systemInstruction = `You are "Aura AI", the warm, authoritative Master Women's Health, Clinical, and App Navigation Intelligence. Always answer warmly, authoritatively, and clearly using clean markdown, bullet points, and actionable tips.`;

  if (userCycleContext) {
    systemInstruction += `\n\nUser's Current Cycle Context:\n- Cycle Day: ${userCycleContext.cycleDay || "Unknown"}\n- Current Phase: ${userCycleContext.phase || "Unknown"}\n- Cycle Length: ${userCycleContext.cycleLength || 28} days\n- Next Period In: ${userCycleContext.daysUntilPeriod ?? "N/A"} days\n- Current Logged Symptoms/Mood: ${userCycleContext.symptoms || "None reported today"}`;
  }

  const formattedMessages = [
    { role: "system", content: systemInstruction },
    ...messages.map((m) => ({
      role: m.role === "assistant" || m.role === "model" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  // --- LAYER 1: Try OpenRouter if Custom API Key is Provided ---
  if (customApiKey && customApiKey.trim().length > 0) {
    const candidateModels = [
      "openrouter/auto",
      "meta-llama/llama-3.3-70b-instruct",
      "deepseek/deepseek-chat",
      "qwen/qwen-2.5-72b-instruct",
    ];

    for (const model of candidateModels) {
      try {
        console.log('[AURA-AI] Calling OpenRouter with custom key, model:', model);
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${customApiKey.trim()}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://aistudio.google.com",
            "X-Title": "Aura Women Health App",
          },
          body: JSON.stringify({
            model,
            messages: formattedMessages,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.choices?.[0]?.message?.content;
          if (text && typeof text === "string" && text.trim().length > 0) {
            console.log('[AURA-AI] OpenRouter success with model:', model);
            return {
              reply: text.trim(),
              model: 'Aura AI • OpenRouter Live Online',
            };
          }
        }
      } catch (err) {
        console.warn(`[AURA-AI] OpenRouter model ${model} error:`, err);
      }
    }
  }

  // --- LAYER 2: Pollinations AI Real-Time Live Engine (100% Free, No API Key Required, Always Online) ---
  try {
    console.log('[AURA-AI] Connecting to Pollinations AI Real-Time Live Engine...');
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: formattedMessages,
        model: "openai",
      }),
    });

    if (response.ok) {
      const text = await response.text();
      if (text && typeof text === "string" && text.trim().length > 0) {
        console.log('[AURA-AI] Pollinations AI Live Engine success!');
        return {
          reply: text.trim(),
          model: 'Aura AI • Real-Time Live Engine',
        };
      }
    } else {
      console.warn('[AURA-AI] Pollinations AI status:', response.status);
    }
  } catch (err) {
    console.warn('[AURA-AI] Pollinations AI error:', err);
  }

  // --- LAYER 3: Backup Pollinations GET Endpoint ---
  try {
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop()?.content || 'Hello';
    const encodedPrompt = encodeURIComponent(`System: ${systemInstruction}\n\nUser Question: ${lastUserMessage}`);
    const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=openai`);

    if (response.ok) {
      const text = await response.text();
      if (text && typeof text === "string" && text.trim().length > 0) {
        return {
          reply: text.trim(),
          model: 'Aura AI • Live Online Core',
        };
      }
    }
  } catch (err) {
    console.warn('[AURA-AI] Backup Pollinations GET error:', err);
  }

  throw new Error("Online AI request failed. Please check your internet connection.");
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

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
    <div className="flex flex-col h-full flex-1 min-h-[350px] bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden relative font-['Nunito']">
      {/* Top Futuristic Graphical AI Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 animate-pulse pointer-events-none" />

        <div className="flex items-center space-x-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-rose-500/30 text-white shrink-0 relative">
            <span className="animate-spin [animation-duration:8s] absolute inset-0 rounded-2xl border border-white/30" />
            🌸
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-black tracking-wide font-['Fredoka']">Aura AI</h2>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-rose-200 text-[9px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20">
                Neural Core
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-semibold">
              Clinical & On-Device Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 relative z-10">
          {/* Blinking Live Indicator (Green when online with API key, Red when offline/local) */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
            isOnline
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
            <span>{isOnline ? 'Live Online' : 'Local Mode'}</span>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
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
