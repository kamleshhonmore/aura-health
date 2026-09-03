import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  Leaf,
  Heart,
  Activity,
  Flame,
  Volume2,
  VolumeX,
  Info,
  ChevronDown,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { CycleStatus } from '../utils/cycleCalculations';
import { generateMobileOfflineResponse } from '../utils/mobileAiFallback';

// Mobile / Capacitor helper to resolve full server URL when running as standalone app
const getApiUrl = (path: string) => {
  if (
    typeof window !== 'undefined' &&
    (window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      (window.location.hostname === 'localhost' && window.location.port !== '3000'))
  ) {
    return `https://ais-dev-726rzjrfevv7hxlnsphnt3-810712876529.asia-east1.run.app${path}`;
  }
  return path;
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  roleType?: string;
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

export type ChatRole = 'general' | 'ayurveda' | 'fertility' | 'pcos' | 'perimenopause' | 'clinical';

export const CHAT_ROLES: Record<
  ChatRole,
  {
    name: string;
    title: string;
    avatar: string;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    description: string;
    icon: any;
    sampleQuestions: string[];
  }
> = {
  general: {
    name: 'Aura AI',
    title: "Women's Cycle & Health Companion",
    avatar: '🌸',
    accentColor: 'from-[#FF758C] to-[#FF7EB3]',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    description: 'Empathetic cycle insights, symptom analysis, and menstrual rhythm synchronization.',
    icon: Sparkles,
    sampleQuestions: [
      'Why do I feel tired 3 days before my period?',
      'What foods should I eat in the Luteal phase?',
      'Is spotting 14 days after period normal?',
      'How does estrogen affect my energy levels?',
    ],
  },
  clinical: {
    name: 'Nova AI Assistant',
    title: 'Clinically Guardrailed Medical AI',
    avatar: '⚕️',
    accentColor: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Strictly evidence-based, clinically validated reproductive health information (RAG constraints).',
    icon: Activity,
    sampleQuestions: [
      'What are the Rotterdam criteria for PCOS?',
      'How is Endometriosis definitively diagnosed?',
      'Can you generate a Question Prompt List for my OBGYN visit?',
      'What are the clinical markers for early perimenopause?',
    ],
  },
  ayurveda: {
    name: 'Vaidya Ananya',
    title: "Ayurvedic Women's Health Specialist",
    avatar: '🌿',
    accentColor: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'Ancient doshic balance (Vata/Pitta/Kapha), herbal teas, CCF recipes, and natural cramp relief.',
    icon: Leaf,
    sampleQuestions: [
      'What Ayurvedic remedy relieves severe period cramps fast?',
      'How to make CCF detox tea for menstrual bloating?',
      'Which herbs balance high Pitta and PMS anger?',
      'How to use castor oil pack for uterine health?',
    ],
  },
  fertility: {
    name: 'Dr. Maya',
    title: 'Fertility & Conception Care Expert',
    avatar: '💖',
    accentColor: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Ovulation timing, cervical mucus interpretation, BBT tracking, and preconception support.',
    icon: Heart,
    sampleQuestions: [
      'How do I pinpoint my exact fertile window?',
      'What does egg-white cervical mucus mean for conception?',
      'Best foods and supplements to boost egg quality?',
      'How does basal body temperature shift after ovulation?',
    ],
  },
  pcos: {
    name: 'Coach Tara',
    title: 'PCOS & Hormone Balance Consultant',
    avatar: '✨',
    accentColor: 'from-amber-500 to-rose-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Insulin sensitivity, low-glycemic diets, seed cycling protocols, and androgen control.',
    icon: Activity,
    sampleQuestions: [
      'How does the seed cycling protocol work for PCOS?',
      'Best breakfast to prevent morning insulin spikes?',
      'Does spearmint tea lower androgen levels for hormonal acne?',
      'Natural ways to regulate irregular 45-day cycles?',
    ],
  },
  perimenopause: {
    name: 'Elena',
    title: 'Menopause & Transition Coach',
    avatar: '🌺',
    accentColor: 'from-rose-500 to-orange-500',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    description: 'Cooling remedies for hot flashes, night sweats, sleep restoration, and mood serenity.',
    icon: Flame,
    sampleQuestions: [
      'What natural remedies reduce nighttime hot flashes?',
      'Which foods naturally support declining estrogen levels?',
      'How to combat perimenopause brain fog and fatigue?',
      'Is skipping two periods at age 44 normal?',
    ],
  },
};

export const AVAILABLE_MODELS = [
  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', tag: 'Fast & Smart' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', tag: 'Ultra Fast' },
];

export function GeminiChatbot({
  theme,
  cycleStatus,
  userSymptoms = [],
  userMoods = [],
  initialPrompt,
  onNavigateToTab,
}: GeminiChatbotProps) {
  const [selectedRole, setSelectedRole] = useState<ChatRole>('general');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.7-flash');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('aura_gemini_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        roleType: 'general',
        modelUsed: 'gemini-3.7-flash',
        content:
          "Hello, beautiful! 🌸 I'm **Aura AI**, your personalized Women's Health & Cycle Guide powered by Gemini.\n\nI can help you understand your cycle phases, analyze symptoms, discover ancient Ayurvedic remedies, decode fertility cues, or support your hormone balance. How are you feeling today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('aura_gemini_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Handle initial prompt if passed
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '') {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const currentRoleInfo = CHAT_ROLES[selectedRole];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setInputMessage('');
    setErrorMessage(null);

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
      // Build cycle context
      const userCycleContext = cycleStatus
        ? {
            cycleDay: cycleStatus.currentCycleDay,
            phase: cycleStatus.phase,
            daysUntilPeriod: cycleStatus.daysUntilNextPeriod,
            symptoms: userSymptoms.length > 0 ? userSymptoms.join(', ') : 'None reported today',
            moods: userMoods.length > 0 ? userMoods.join(', ') : 'Normal',
          }
        : undefined;

      // Send to server-side AI route with fallback timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const apiUrl = getApiUrl('/api/ai/chat');
      const response = await fetch(apiUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content,
          })),
          role: selectedRole,
          model: selectedModel,
          userCycleContext,
        }),
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response.');
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        roleType: selectedRole,
        modelUsed: data.modelUsed || selectedModel,
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.warn('Network chat error, using mobile intelligence fallback:', err);
      
      // Generate immediate smart on-device response tailored to user input & cycle phase
      const smartReply = generateMobileOfflineResponse(query, selectedRole, {
        cycleStatus,
        userSymptoms,
        userMoods,
      });

      const fallbackMsg: ChatMessage = {
        id: 'bot-fallback-' + Date.now(),
        role: 'assistant',
        roleType: selectedRole,
        modelUsed: 'aura-mobile-engine',
        content: smartReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to reset this chat conversation?')) {
      const resetMsg: ChatMessage = {
        id: 'welcome-reset-' + Date.now(),
        role: 'assistant',
        roleType: selectedRole,
        modelUsed: selectedModel,
        content: `Chat history cleared. I'm ${currentRoleInfo.name} (${currentRoleInfo.title}). How can I assist you with your cycle today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([resetMsg]);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking === id) {
        window.speechSynthesis.cancel();
        setIsSpeaking(null);
        return;
      }
      window.speechSynthesis.cancel();
      // Strip basic markdown
      const cleanText = text.replace(/[*_#`~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsSpeaking(null);
      utterance.onerror = () => setIsSpeaking(null);
      setIsSpeaking(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Format simple markdown helper
  const renderFormattedContent = (content: string) => {
    // Split by newlines
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold handling
      let formatted = line;
      const parts = formatted.split(/(\*\*.*?\*\*)/g);

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
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-base font-extrabold text-gray-900 mt-2.5 mb-1.5">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start space-x-2 my-0.5 text-xs text-gray-800 leading-relaxed">
            <span className="text-[#FF5376] font-bold mt-0.5">•</span>
            <span>{renderedParts}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="flex items-start space-x-2 my-0.5 text-xs text-gray-800 leading-relaxed">
            <span className="font-bold text-[#FF5376] mt-0.5 text-[11px]">{line.match(/^\d+\./)?.[0]}</span>
            <span>{renderedParts}</span>
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-gray-800 leading-relaxed my-0.5">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[750px] bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden relative">
      {/* Top Chat Header */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border-b border-pink-100/80 px-4 py-3 flex items-center justify-between shadow-xs">
        {/* Role Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-2xl bg-white/80 hover:bg-white border border-pink-200 shadow-xs transition-all cursor-pointer text-left"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentRoleInfo.accentColor} flex items-center justify-center text-lg shadow-sm`}>
              {currentRoleInfo.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-gray-900 font-['Fredoka']">{currentRoleInfo.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-gray-500 truncate max-w-[130px]">{currentRoleInfo.title}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Role Picker Dropdown */}
          {showRoleDropdown && (
            <div className="absolute top-12 left-0 w-72 bg-white rounded-2xl shadow-2xl border border-pink-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Select AI Health Specialist
              </div>
              {(Object.keys(CHAT_ROLES) as ChatRole[]).map((rKey) => {
                const r = CHAT_ROLES[rKey];
                const isSelected = selectedRole === rKey;
                return (
                  <button
                    key={rKey}
                    onClick={() => {
                      setSelectedRole(rKey);
                      setShowRoleDropdown(false);
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: 'switch-' + Date.now(),
                          role: 'assistant',
                          roleType: rKey,
                          modelUsed: selectedModel,
                          content: `Switched to **${r.name}** (*${r.title}*).\n${r.description}\n\nAsk me anything!`,
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        },
                      ]);
                    }}
                    className={`w-full flex items-start space-x-2.5 p-2 rounded-xl transition-all text-left cursor-pointer ${
                      isSelected ? 'bg-pink-50/80 border border-pink-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl mt-0.5">{r.avatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{r.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FF5376]" />}
                      </div>
                      <p className="text-[10px] text-gray-500 leading-tight">{r.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Model Selector & Actions */}
        <div className="flex items-center space-x-1.5">
          {/* Model Selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-gray-200 text-[10px] font-semibold text-gray-700 shadow-xs cursor-pointer"
              title="Gemini Model"
            >
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span className="hidden sm:inline">
                {AVAILABLE_MODELS.find((m) => m.id === selectedModel)?.name.replace('Gemini ', '') || 'Gemini'}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {showModelDropdown && (
              <div className="absolute top-10 right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-50">
                <div className="px-2 py-1 text-[9px] font-bold text-gray-400 uppercase">Gemini Models</div>
                {AVAILABLE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m.id);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                      selectedModel === m.id ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>
                      <div>{m.name}</div>
                      <div className="text-[9px] text-gray-400 font-normal">{m.tag}</div>
                    </div>
                    {selectedModel === m.id && <Check className="w-3.5 h-3.5 text-purple-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear history */}
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-xl hover:bg-white text-gray-400 hover:text-red-500 border border-transparent hover:border-gray-200 transition-all cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cycle Sync Status Pill Bar */}
      {cycleStatus && (
        <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 px-3.5 py-1.5 border-b border-pink-100 flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1.5 text-gray-700">
            <span className="w-2 h-2 rounded-full bg-[#FF5376] animate-pulse" />
            <span className="font-semibold text-gray-900">Cycle Day {cycleStatus.currentCycleDay}</span>
            <span className="text-gray-400">•</span>
            <span className="capitalize text-pink-700 font-bold">{cycleStatus.phase} Phase</span>
          </div>
          <div className="text-[10px] text-gray-500 font-medium">
            Next period in <span className="font-bold text-[#FF5376]">{cycleStatus.daysUntilNextPeriod} days</span>
          </div>
        </div>
      )}

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-[#FAF9F6]/60">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const msgRole = msg.roleType ? CHAT_ROLES[msg.roleType as ChatRole] || currentRoleInfo : currentRoleInfo;

          return (
            <div
              key={msg.id}
              className={`flex items-end space-x-2 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
            >
              {/* Bot Avatar */}
              {!isUser && (
                <div
                  className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${msgRole.accentColor} flex items-center justify-center text-sm shadow-xs shrink-0 mb-1`}
                >
                  {msgRole.avatar}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs relative group ${
                  isUser
                    ? 'bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-pink-100/90 rounded-bl-none shadow-sm'
                }`}
              >
                {/* Assistant Name and Model Header */}
                {!isUser && (
                  <div className="flex items-center justify-between mb-1 pb-1 border-b border-gray-100 text-[10px] text-gray-400">
                    <span className="font-bold text-gray-700">{msgRole.name}</span>
                    <span className="text-[9px] bg-gray-100 px-1.5 py-0.2 rounded-md text-gray-500 font-mono">
                      {msg.modelUsed?.replace('gemini-', '') || 'gemini'}
                    </span>
                  </div>
                )}

                {/* Bubble Text */}
                <div className="break-words font-['Nunito']">{renderFormattedContent(msg.content)}</div>

                {/* Footer: Timestamp & Action buttons */}
                <div className={`flex items-center justify-between mt-1 pt-0.5 text-[9px] ${isUser ? 'text-pink-100' : 'text-gray-400'}`}>
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <div className="flex items-center space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="hover:text-gray-700 p-0.5 rounded cursor-pointer"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>

                      {/* Text to speech */}
                      {'speechSynthesis' in window && (
                        <button
                          onClick={() => handleSpeak(msg.content, msg.id)}
                          className="hover:text-gray-700 p-0.5 rounded cursor-pointer"
                          title="Read aloud"
                        >
                          {isSpeaking === msg.id ? (
                            <VolumeX className="w-3 h-3 text-[#FF5376] animate-pulse" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white text-xs shadow-xs shrink-0 mb-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-end space-x-2 justify-start animate-in fade-in">
            <div className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${currentRoleInfo.accentColor} flex items-center justify-center text-sm shadow-xs shrink-0 mb-1`}>
              {currentRoleInfo.avatar}
            </div>
            <div className="bg-white border border-pink-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#FF758C] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-[#FF7EB3] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
              <span className="text-[11px] text-gray-500 font-medium ml-1">Consulting medical knowledge...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-white/95 border-t border-pink-100/60 px-3 py-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#FF5376]" />
            <span>Suggestions:</span>
          </span>
          {currentRoleInfo.sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200/80 whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Message Input Box */}
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
            placeholder={`Ask ${currentRoleInfo.name} anything about your cycle or symptoms...`}
            disabled={isLoading}
            className="flex-1 bg-pink-50/50 border border-pink-200 rounded-2xl px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF758C] focus:bg-white transition-all shadow-inner disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] hover:from-[#FF6580] hover:to-[#FF6F9A] text-white shadow-md shadow-pink-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95 flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
