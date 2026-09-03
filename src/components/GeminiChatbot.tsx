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
  WifiOff,
  AlertCircle,
  Globe,
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { CycleStatus } from '../utils/cycleCalculations';
import { generateMobileOfflineResponse } from '../utils/mobileAiFallback';
import { NativeBridge } from '../utils/nativeBridge';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Network } from '@capacitor/network';

// Fallback to OpenRouter only if Gemini API is missing
const OPENROUTER_FALLBACK_KEY = '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';

/**
 * Use CapacitorHttp for Gemini API.
 */
async function fetchGeminiAI(
  messages: { role: string; content: string }[],
  systemPrompt: string,
  modelName: string
): Promise<{ reply: string; model: string }> {
  const apiKey = localStorage.getItem('aura_gemini_api_key') || '';
  if (!apiKey) throw new Error('MISSING_API_KEY');

  const realModel = modelName.includes('3.7') ? 'gemini-1.5-flash' : 'gemini-1.5-flash-lite';

  let chatHistory = messages.map(m => ({
    role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
    chatHistory = chatHistory.slice(1);
  }

  const options = {
    url: `https://generativelanguage.googleapis.com/v1beta/models/${realModel}:generateContent?key=${apiKey}`,
    headers: { 'Content-Type': 'application/json' },
    data: {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: chatHistory
    }
  };

  const response: HttpResponse = await CapacitorHttp.post(options);

  if (response.status === 200) {
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return { reply: text, model: modelName };
  }

  throw new Error(`Gemini API Error ${response.status}: ${JSON.stringify(response.data)}`);
}

/**
 * Use CapacitorHttp for OpenRouter.
 */
async function fetchDirectOpenRouter(
  messages: { role: string; content: string }[],
  systemPrompt: string
): Promise<{ reply: string; model: string }> {
  const models = [
    'openrouter/free',
    'google/gemini-2.0-flash-exp:free',
    'minimax/minimax-m3:free',
  ];

  for (const model of models) {
    try {
      const response: HttpResponse = await CapacitorHttp.post({
        url: 'https://openrouter.ai/api/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_FALLBACK_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://aurahealth.app',
          'X-Title': 'Aura Health Mobile',
        },
        data: {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map((m) => ({
              role: m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user',
              content: m.content,
            })),
          ],
        },
      });

      if (response.status === 200) {
        const content = response.data?.choices?.[0]?.message?.content;
        if (content && content.trim().length > 0) {
          return { reply: content.trim(), model };
        }
      }
    } catch (e) {
      console.warn(`OpenRouter ${model} failed`, e);
    }
  }
  throw new Error('All cloud AI models exhausted.');
}

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
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', tag: 'Fast & Smart' },
  { id: 'gemini-1.5-flash-lite', name: 'Gemini 1.5 Flash Lite', tag: 'Ultra Fast' },
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
  const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-flash');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Connectivity Sync
  useEffect(() => {
    const checkConn = async () => {
      try {
        const s = await Network.getStatus();
        setIsOnline(s.connected);
      } catch (e) {
        setIsOnline(navigator.onLine);
      }
    };
    checkConn();

    const handle = Network.addListener('networkStatusChange', s => setIsOnline(s.connected));
    return () => { handle.remove(); };
  }, []);

  // History with Persistence
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('aura_gemini_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        roleType: 'general',
        modelUsed: 'gemini-1.5-flash',
        content: "Hello, beautiful! 🌸 I'm **Aura AI**, your personalized Women's Health & Cycle Guide. How are you feeling today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('aura_gemini_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (initialPrompt) handleSendMessage(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const currentRoleInfo = CHAT_ROLES[selectedRole];

  // REAL-TIME INTERNET TEST
  const testInternet = async () => {
    setErrorMessage("Testing cloud AI connection...");
    try {
      const res: HttpResponse = await CapacitorHttp.get({ url: 'https://www.google.com' });
      if (res.status === 200) {
        setErrorMessage(null);
        alert("Internet Connection Verified! Native bridge is active.");
      } else {
        throw new Error(`Status ${res.status}`);
      }
    } catch (e: any) {
      setErrorMessage(`Native Internet Bridge Failure: ${e.message}. Please check Wi-Fi/Data.`);
    }
  };

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
      const userCycleContext = cycleStatus ? {
        cycleDay: cycleStatus.currentCycleDay,
        phase: cycleStatus.phase,
        daysUntilPeriod: cycleStatus.daysUntilNextPeriod,
        symptoms: userSymptoms.join(', ') || 'None reported',
        moods: userMoods.join(', ') || 'Normal',
      } : undefined;

      let replyText = '';
      let modelUsed = selectedModel;

      const systemPrompt = `You are a certified Women's Health & Cycle Tracker AI Specialist (${CHAT_ROLES[selectedRole].name}).
Current Context: Day ${userCycleContext?.cycleDay}, Phase: ${userCycleContext?.phase}. Symptoms: ${userCycleContext?.symptoms}.
Answer with empathy, clinical accuracy, and phase-specific wellness tips. Use markdown and bullet points.`;

      // 1. Try Gemini Direct via Native Bridge
      try {
        const result = await fetchGeminiAI(newMessages, systemPrompt, selectedModel);
        replyText = result.reply;
        modelUsed = result.model;
      } catch (e: any) {
        if (e.message === 'MISSING_API_KEY') {
          setErrorMessage("Please enter your Gemini API Key in Settings to enable real-time cloud analysis.");
        } else {
          console.warn("Gemini Native Bridge failed, falling back...", e);
        }
      }

      // 2. Try OpenRouter Fallback
      if (!replyText) {
        const result = await fetchDirectOpenRouter(newMessages, systemPrompt);
        replyText = result.reply;
        modelUsed = result.model;
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        roleType: selectedRole,
        modelUsed,
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (err: any) {
      console.error("Critical AI Bridge Failure:", err);
      const smartReply = generateMobileOfflineResponse(query, selectedRole, { cycleStatus, userSymptoms, userMoods });
      const fallbackMsg: ChatMessage = {
        id: 'bot-off-' + Date.now(),
        role: 'assistant',
        roleType: selectedRole,
        modelUsed: 'aura-offline-engine',
        content: smartReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
      setErrorMessage(`Live AI Connection issue: ${err.message}. Using offline backup.`);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Reset chat?')) {
      setMessages([{
        id: 'welcome-reset-' + Date.now(),
        role: 'assistant',
        roleType: selectedRole,
        modelUsed: selectedModel,
        content: `I'm ${currentRoleInfo.name}. How can I assist you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
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
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#`~]/g, ''));
      utterance.onend = () => setIsSpeaking(null);
      setIsSpeaking(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      let formatted = line;
      const parts = formatted.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.startsWith('### ')) return <h4 key={idx} className="text-sm font-bold text-gray-900 mt-2 mb-1">{line.replace('### ', '')}</h4>;
      if (line.startsWith('- ') || line.startsWith('* ')) return (
        <div key={idx} className="flex items-start space-x-2 my-0.5 text-xs text-gray-800">
          <span className="text-[#FF5376] font-bold">•</span><span>{renderedParts}</span>
        </div>
      );
      if (line.trim() === '') return <div key={idx} className="h-1.5" />;
      return <p key={idx} className="text-xs text-gray-800 leading-relaxed my-0.5">{renderedParts}</p>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[750px] bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden relative">
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border-b border-pink-100/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="relative">
          <button onClick={() => setShowRoleDropdown(!showRoleDropdown)} className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-2xl bg-white/80 border border-pink-200 shadow-xs cursor-pointer">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentRoleInfo.accentColor} flex items-center justify-center text-lg shadow-sm`}>{currentRoleInfo.avatar}</div>
            <div>
              <div className="flex items-center space-x-1.5"><span className="text-xs font-bold text-gray-900 font-['Fredoka']">{currentRoleInfo.name}</span><span className="text-[9px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold uppercase">AI</span></div>
              <p className="text-[10px] text-gray-500 truncate max-w-[130px]">{currentRoleInfo.title}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          {showRoleDropdown && (
            <div className="absolute top-12 left-0 w-72 bg-white rounded-2xl shadow-2xl border border-pink-100 p-2 z-50">
              {(Object.keys(CHAT_ROLES) as ChatRole[]).map((rKey) => {
                const r = CHAT_ROLES[rKey];
                return (
                  <button key={rKey} onClick={() => { setSelectedRole(rKey); setShowRoleDropdown(false); }} className={`w-full flex items-start space-x-2.5 p-2 rounded-xl text-left cursor-pointer ${selectedRole === rKey ? 'bg-pink-50 border border-pink-200' : 'hover:bg-gray-50'}`}>
                    <span className="text-xl mt-0.5">{r.avatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between"><span className="text-xs font-bold text-gray-900">{r.name}</span>{selectedRole === rKey && <Check className="w-3.5 h-3.5 text-[#FF5376]" />}</div>
                      <p className="text-[10px] text-gray-500 leading-tight">{r.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1.5">
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-xl text-[10px] font-bold border transition-colors ${
              isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="hidden sm:inline">{isOnline ? 'Live AI' : 'Offline'}</span>
          </div>
          <button onClick={testInternet} className="p-1.5 rounded-xl text-emerald-600 hover:bg-emerald-50 border border-emerald-100" title="Verify Internet Bridge"><Globe className="w-4 h-4" /></button>
          <div className="relative">
            <button onClick={() => setShowModelDropdown(!showModelDropdown)} className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-[10px] font-semibold text-gray-700 cursor-pointer">
              <Sparkles className="w-3 h-3 text-purple-600" /><span>{AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name.replace('Gemini ', '')}</span><ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            {showModelDropdown && (
              <div className="absolute top-10 right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-50">
                {AVAILABLE_MODELS.map(m => (
                  <button key={m.id} onClick={() => { setSelectedModel(m.id); setShowModelDropdown(false); }} className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer ${selectedModel === m.id ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}>
                    <div><div>{m.name}</div><div className="text-[9px] text-gray-400 font-normal">{m.tag}</div></div>{selectedModel === m.id && <Check className="w-3.5 h-3.5 text-purple-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleClearHistory} className="p-1.5 rounded-xl text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      {!isOnline && (
        <div className="bg-amber-500 text-white px-4 py-1.5 flex items-center justify-center gap-2 text-[10px] font-bold animate-pulse">
           <WifiOff className="w-3.5 h-3.5" /><span>Device Offline - Offline Engine Ready</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-[#FAF9F6]/60">
        {errorMessage && (
          <div className="p-3 mb-2 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
            <div><p className="font-bold">AI Status Alert</p><p>{errorMessage}</p></div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end space-x-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in`}>
            {msg.role !== 'user' && <div className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${CHAT_ROLES[msg.roleType as ChatRole]?.accentColor || currentRoleInfo.accentColor} flex items-center justify-center text-sm shrink-0 mb-1`}>{CHAT_ROLES[msg.roleType as ChatRole]?.avatar || currentRoleInfo.avatar}</div>}
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 relative group ${msg.role === 'user' ? 'bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] text-white rounded-br-none' : 'bg-white text-gray-800 border border-pink-100 rounded-bl-none shadow-sm'}`}>
              {msg.role !== 'user' && <div className="flex items-center justify-between mb-1 pb-1 border-b border-gray-100 text-[9px] text-gray-400">
                <span className="font-bold text-gray-700">{CHAT_ROLES[msg.roleType as ChatRole]?.name || currentRoleInfo.name}</span>
                <span className="bg-gray-100 px-1 rounded text-gray-500 uppercase">{msg.modelUsed?.replace('gemini-', '')}</span>
              </div>}
              <div className="break-words font-['Nunito']">{renderFormattedContent(msg.content)}</div>
              <div className={`flex items-center justify-between mt-1 text-[8px] ${msg.role === 'user' ? 'text-pink-100' : 'text-gray-400'}`}>
                <span>{msg.timestamp}</span>
                {msg.role !== 'user' && <div className="flex items-center space-x-1.5 opacity-60 group-hover:opacity-100"><button onClick={() => handleCopy(msg.content, msg.id)} className="cursor-pointer">{copiedId === msg.id ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}</button><button onClick={() => handleSpeak(msg.content, msg.id)} className="cursor-pointer"><Volume2 className="w-2.5 h-2.5" /></button></div>}
              </div>
            </div>
            {msg.role === 'user' && <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white text-xs shrink-0 mb-1"><User className="w-4 h-4" /></div>}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end space-x-2 justify-start animate-pulse">
            <div className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${currentRoleInfo.accentColor} flex items-center justify-center text-sm shrink-0 mb-1`}>{currentRoleInfo.avatar}</div>
            <div className="bg-white border border-pink-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm text-[11px] text-gray-500 font-medium">Consulting cloud medical knowledge...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-pink-100">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-2">
          <input ref={inputRef} type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Ask anything about your health..." disabled={isLoading} className="flex-1 bg-pink-50/50 border border-pink-200 rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF758C]" />
          <button type="submit" disabled={!inputMessage.trim() || isLoading} className="p-2.5 rounded-2xl bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] text-white disabled:opacity-40 cursor-pointer flex items-center justify-center shrink-0"><Send className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );
}
