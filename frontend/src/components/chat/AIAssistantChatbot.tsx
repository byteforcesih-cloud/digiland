import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight,
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Loader2, 
  ArrowDown, 
  Globe, 
  Compass, 
  AlertTriangle, 
  Lightbulb,
  Radio,
  Square
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useTranslation } from '../../context/LanguageContext';
import { ChatMessage, ChatbotAction, LanguageCode } from '../../types';

export type VoiceState = 
  | 'IDLE' 
  | 'LISTENING' 
  | 'PROCESSING_VOICE' 
  | 'TEXT_RECEIVED' 
  | 'SENDING_TO_AI' 
  | 'AI_RESPONSE_RECEIVED' 
  | 'READING_RESPONSE';

// Helper to render structured markdown (Headings, Tables, Lists, Callouts, Bold)
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const bodyRows = tableRows.slice(1).filter(r => !r.every(c => c.match(/^:?-+:?$/)));
      elements.push(
        <div key={`table-${elements.length}`} className="my-2 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="min-w-full divide-y divide-slate-200 text-[11px]">
            <thead className="bg-slate-100 text-slate-800 font-bold">
              <tr>
                {headerRow.map((cell, idx) => (
                  <th key={idx} className="px-2.5 py-1.5 text-left">{parseInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-2.5 py-1 text-slate-700">{parseInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
    inTable = false;
  };

  const parseInline = (text: string): React.ReactNode => {
    // Bold: **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      // Inline code: `text`
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={pIdx} className="font-mono bg-slate-100 text-indigo-700 px-1 py-0.5 rounded text-[10px]">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Table row detection: | cell | cell |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
      tableRows.push(cells);
      return;
    } else if (inTable) {
      flushTable();
    }

    // Heading: ### Heading
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={idx} className="font-extrabold text-xs text-indigo-950 mt-2.5 mb-1 flex items-center gap-1.5 border-b border-indigo-100 pb-1">
          {parseInline(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    // Callout / Note: > 💡 or > ⚠️
    if (trimmed.startsWith('> ')) {
      const calloutText = trimmed.slice(2);
      const isWarn = calloutText.includes('⚠️') || calloutText.includes('Important');
      elements.push(
        <div key={idx} className={`my-2 p-2.5 rounded-xl border text-[11px] font-medium flex items-start gap-2 ${
          isWarn 
            ? 'bg-amber-50/90 border-amber-200 text-amber-900' 
            : 'bg-indigo-50/90 border-indigo-200 text-indigo-900'
        }`}>
          {isWarn ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" /> : <Lightbulb className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />}
          <div>{parseInline(calloutText)}</div>
        </div>
      );
      return;
    }

    // Bullet point: • or -
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      elements.push(
        <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5 text-slate-700">
          <span className="text-indigo-600 font-bold">•</span>
          <span className="flex-1">{parseInline(trimmed.slice(2))}</span>
        </div>
      );
      return;
    }

    // Numbered List: 1. or 2.
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <div key={idx} className="flex items-start gap-2 ml-1 my-1 text-slate-700">
          <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
            {numMatch[1]}
          </span>
          <span className="flex-1">{parseInline(numMatch[2])}</span>
        </div>
      );
      return;
    }

    // Regular line / Paragraph
    if (trimmed) {
      elements.push(
        <p key={idx} className="my-1 leading-relaxed text-slate-700">
          {parseInline(trimmed)}
        </p>
      );
    }
  });

  if (inTable) {
    flushTable();
  }

  return <div className="space-y-0.5 text-xs">{elements}</div>;
};

export const AIAssistantChatbot: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const [currentlySpeakingIdx, setCurrentlySpeakingIdx] = useState<number | null>(null);
  
  // Safe refs for synchronous tracking & instant cancellation
  const isOpenRef = useRef(false);
  const currentSessionIdRef = useRef(0);
  const recognitionRef = useRef<any>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const initialGreetings: Record<string, string> = {
    ta: "வணக்கம்! நான் உங்கள் டிஜிலாண்ட் AI உதவியாளர். நில ஆவணங்கள், சர்வே எண்கள், ஆவண சரிபார்ப்பு அல்லது புகார்கள் குறித்து நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
    hi: "नमस्ते! मैं आपका डिजीलँड AI सहायक हूँ। भूमि अभिलेख, खसरा संख्या, दस्तावेज़ सत्यापन या शिकायतों में मैं आपकी कैसे सहायता कर सकता हूँ?",
    te: "నమస్కారం! నేను మీ డిజిలాండ్ AI అసిస్టెంట్‌ని. భూమి రికార్డులు, సర్వే నంబర్లు లేదా ఫిర్యాదులలో నేను మీకు ఎలా సహాయపడగలను?",
    kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಡಿಜಿಲ್ಯಾಂಡ್ AI ಸಹಾಯಕ. ಭೂ ದಾಖಲೆಗಳು ಅಥವಾ ಪರಿಶೀಲನೆಯಲ್ಲಿ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    ml: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഡിജിലാൻഡ് AI അസിസ്റ്റന്റാണ്. ഭൂമി രേഖകൾ അല്ലെങ്കിൽ സ്ഥിരീകരണത്തിൽ ഞാൻ എങ്ങനെ സഹായിക്കണം?",
    en: "Vanakkam! I am your DigiLand AI Assistant. How can I assist you with Land Records, Survey Numbers, AI Reviews, or Filing Grievances today?"
  };

  const initialSuggestedActions: Record<string, string[]> = {
    ta: [
      'சர்வே எண் மூலம் நிலத்தை எவ்வாறு தேடுவது?',
      'நில ஆவணத்தை எவ்வாறு பதிவேற்றுவது?',
      'AI மதிப்பாய்வு எவ்வாறு செயல்படுகிறது?',
      'எனது 1GB பாதுகாப்பு சேமிப்பக பெட்டகம் எங்கே?'
    ],
    hi: [
      'खसरा संख्या द्वारा भूमि कैसे खोजें?',
      'अपना भूमि दस्तावेज़ कैसे अपलोड करें?',
      'AI समीक्षा कैसे काम करती है?',
      'मेरा 1GB सुरक्षित स्टोरेज वॉल्ट कहाँ है?'
    ],
    te: [
      'సర్వే నంబర్ ద్వారా భూమిని ఎలా శోధించాలి?',
      'నా భూమి పత్రాన్ని ఎలా అప్‌లోడ్ చేయాలి?',
      'AI సమీక్ష ఎలా పనిచేస్తుంది?',
      'నా 1GB సురక్షిత నిల్వ వాల్ట్ ఎక్కడ ఉంది?'
    ],
    kn: [
      'ಸರ್ವೆ ನಂಬರ್ ಮೂಲಕ ಭೂಮಿಯನ್ನು ಹುಡುಕುವುದು ಹೇಗೆ?',
      'ನನ್ನ ಭೂಮಿ ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡುವುದು ಹೇಗೆ?',
      'AI ಪರಿಶೀಲನೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?',
      'ನನ್ನ 1GB ಸುರಕ್ಷಿತ ಸಂಗ್ರಹಣೆ ವಾಲ್ಟ್ ಎಲ್ಲಿದೆ?'
    ],
    ml: [
      'സർവേ നമ്പർ ഉപയോഗിച്ച് ഭൂമി എങ്ങനെ തിരയാം?',
      'എന്റെ ഭൂമി രേഖ എങ്ങനെ അപ്‌ലോഡ് ചെയ്യാം?',
      'AI അവലോകനം എങ്ങനെ പ്രവർത്തിക്കുന്നു?',
      'എന്റെ 1GB സുരക്ഷിത സംഭരണ നിലവറ എവിടെയാണ്?'
    ],
    en: [
      'How to search land by Survey No?',
      'How to upload my land document?',
      'How does AI Review work?',
      'Where is my 1GB Secure Storage Vault?'
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: initialGreetings[language] || initialGreetings.en,
      suggested_actions: initialSuggestedActions[language] || initialSuggestedActions.en
    }
  ]);

  // Update initial greeting when language changes if no user messages sent yet
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{
          role: 'assistant',
          content: initialGreetings[language] || initialGreetings.en,
          suggested_actions: initialSuggestedActions[language] || initialSuggestedActions.en
        }];
      }
      return prev;
    });
  }, [language]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, voiceState]);

  // Keep isOpenRef strictly in sync with isOpen state
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  /**
   * CRITICAL VOICE & AUDIO CLEANUP
   * Immediately stops all active TTS, SpeechRecognition, MediaStream tracks,
   * and clears voice states and pending callbacks.
   */
  const stopAllVoiceAndAudio = useCallback(() => {
    // 1. Invalidate any in-flight async callbacks
    currentSessionIdRef.current += 1;

    // 2. Cancel browser speech synthesis immediately
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Error cancelling speech synthesis:', e);
      }
    }

    // 3. Stop active SpeechRecognition instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore if already stopped
      }
    }

    // 4. Stop and release any active microphone MediaStream tracks
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      } catch (e) {
        // Ignore
      }
    }

    // 5. Reset states
    activeUtteranceRef.current = null;
    setCurrentlySpeakingIdx(null);
    setVoiceState('IDLE');
    setSpeechError(null);
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      isOpenRef.current = false;
      stopAllVoiceAndAudio();
    };
  }, [stopAllVoiceAndAudio]);

  /**
   * Language-Synchronized AI Voice Synthesis (TTS)
   * Reads complete response aloud using selected language.
   * Checks isOpenRef and sessionId to prevent delayed background speech.
   */
  const speakText = useCallback((text: string, msgIndex?: number, sessionId?: number) => {
    if (!('speechSynthesis' in window) || !isSpeakingEnabled) return;

    // Critical check: if chatbot is closed or session is outdated, do NOT speak
    if (!isOpenRef.current) {
      return;
    }
    if (sessionId !== undefined && sessionId !== currentSessionIdRef.current) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Strip markdown formatting symbols and emoji icons for natural, clean speech
      const cleanSpeech = text
        .replace(/###\s*/g, '')
        .replace(/##\s*/g, '')
        .replace(/#\s*/g, '')
        .replace(/\*\*/g, '')
        .replace(/`/g, '')
        .replace(/^>\s*[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]?\s*/gmu, '')
        .replace(/\|/g, ' ')
        .replace(/•\s*/g, '')
        .replace(/⚡\s*/g, '')
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanSpeech) {
        setVoiceState('IDLE');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      activeUtteranceRef.current = utterance;

      const langMap: Record<string, string> = {
        en: 'en-IN',
        ta: 'ta-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        ml: 'ml-IN'
      };
      const targetLang = langMap[language] || 'en-IN';
      utterance.lang = targetLang;

      // Pick matching browser voice for target language
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]) || v.lang === targetLang);
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        // Re-verify chatbot is still open
        if (!isOpenRef.current || (sessionId !== undefined && sessionId !== currentSessionIdRef.current)) {
          window.speechSynthesis.cancel();
          setCurrentlySpeakingIdx(null);
          setVoiceState('IDLE');
          return;
        }
        setVoiceState('READING_RESPONSE');
        if (msgIndex !== undefined) {
          setCurrentlySpeakingIdx(msgIndex);
        }
      };

      utterance.onend = () => {
        setCurrentlySpeakingIdx(null);
        setVoiceState('IDLE');
        activeUtteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('TTS playback error:', e.error);
        }
        setCurrentlySpeakingIdx(null);
        setVoiceState('IDLE');
        activeUtteranceRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS execution error:', err);
      setCurrentlySpeakingIdx(null);
      setVoiceState('IDLE');
    }
  }, [language, isSpeakingEnabled]);

  // Stop currently reading voice without closing chatbot
  const stopSpeakingOnly = () => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // Ignore
      }
    }
    setCurrentlySpeakingIdx(null);
    setVoiceState('IDLE');
    activeUtteranceRef.current = null;
  };

  /**
   * Send text message to the EXISTING chatbot API.
   * If invoked via voice, automatically starts reading AI response aloud.
   */
  const handleSend = async (textToSend?: string, isFromVoice: boolean = false) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isLoading) return;

    // Increment session ID to identify this specific turn
    const thisSessionId = ++currentSessionIdRef.current;

    // Stop any existing TTS before generating new response
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingIdx(null);
    }

    // 1. Display converted text as normal User Message
    const userMsg: ChatMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);
    setSpeechError(null);
    setVoiceState('SENDING_TO_AI');

    try {
      // 2. Call existing chatbot API
      const res = await aiService.chat(query, language, messages, location.pathname);

      // Check if user closed chatbot during API processing
      if (!isOpenRef.current || thisSessionId !== currentSessionIdRef.current) {
        return;
      }

      // 3. Display AI response in chat
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: res.reply,
        suggested_actions: res.suggested_actions || [],
        related_topics: res.related_topics || [],
        flowchart: res.flowchart,
        action: res.action,
        live_data: res.live_data,
        is_out_of_scope: res.is_out_of_scope
      };

      setMessages(prev => {
        const next = [...prev, assistantMsg];
        const newMsgIdx = next.length - 1;

        // 4. Automatically start voice reading (TTS) if enabled or requested via voice
        if (isOpenRef.current && (isSpeakingEnabled || isFromVoice)) {
          setVoiceState('AI_RESPONSE_RECEIVED');
          // Start TTS reading aloud
          setTimeout(() => {
            speakText(res.reply, newMsgIdx, thisSessionId);
          }, 50);
        } else {
          setVoiceState('IDLE');
        }

        return next;
      });

      // Handle in-chat automated action execution
      if (res.action && res.action.type === 'CHANGE_LANGUAGE' && res.action.language) {
        setLanguage(res.action.language);
      }
    } catch (err) {
      if (!isOpenRef.current) return;

      const fallbackMsg: ChatMessage = {
        role: 'assistant',
        content: "### ⚠️ Processing Error\n\nSorry, I couldn't process that request right now. Please select one of the following DigiLand services or try again.",
        suggested_actions: ['How to search land by Survey No?', 'How to upload land document?', 'Open Land Search']
      };
      setMessages(prev => [...prev, fallbackMsg]);
      setVoiceState('IDLE');
    } finally {
      if (isOpenRef.current) {
        setIsLoading(false);
      }
    }
  };

  /**
   * VOICE INPUT / SPEECH-TO-TEXT (STT) WORKFLOW
   * User clicks 🎤 -> Start voice recording -> User speaks -> Stop recording ->
   * Convert Voice -> Text -> Display as User Message -> Send to existing Chatbot API ->
   * Receive AI response -> Display AI response -> Automatically start reading aloud (TTS)
   */
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Stop any ongoing audio/TTS
    stopAllVoiceAndAudio();

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      const langMap: Record<string, string> = {
        en: 'en-IN',
        ta: 'ta-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        ml: 'ml-IN'
      };
      recognition.lang = langMap[language] || 'en-IN';

      recognition.onstart = () => {
        if (!isOpenRef.current) {
          recognition.abort();
          return;
        }
        setVoiceState('LISTENING');
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        if (!isOpenRef.current) return;

        const transcript = event.results?.[0]?.[0]?.transcript?.trim();
        if (transcript) {
          setVoiceState('PROCESSING_VOICE');
          // Trigger the complete pipeline: Voice -> Text -> Display -> API -> Response -> Read Aloud
          handleSend(transcript, true);
        } else {
          setSpeechError('No speech was detected. Please try speaking again.');
          setVoiceState('IDLE');
        }
      };

      recognition.onerror = (event: any) => {
        if (!isOpenRef.current) return;

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in your browser.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech detected. Please click the microphone and speak clearly.');
        } else if (event.error !== 'aborted') {
          setSpeechError(`Voice input error: ${event.error}`);
        }
        setVoiceState('IDLE');
      };

      recognition.onend = () => {
        // If not transitioned into processing/sending, return to IDLE
        setVoiceState(prev => (prev === 'LISTENING' ? 'IDLE' : prev));
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setSpeechError('Could not initialize microphone. Please check browser permissions.');
      setVoiceState('IDLE');
    }
  };

  const toggleListening = () => {
    if (voiceState === 'LISTENING') {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }
      setVoiceState('IDLE');
    } else {
      startListening();
    }
  };

  /**
   * CRITICAL CLOSE HANDLER
   * When user clicks (✕):
   * 1. Stop current TTS immediately
   * 2. Stop microphone if active & release resources
   * 3. Cancel/ignore pending voice callbacks
   * 4. Close chatbot
   * ZERO voice or audio in background.
   */
  const handleCloseChat = () => {
    isOpenRef.current = false;
    stopAllVoiceAndAudio();
    setIsOpen(false);
  };

  /**
   * REOPEN CHATBOT
   * Opens cleanly with IDLE state, no active audio, no active mic.
   */
  const handleOpenChat = () => {
    stopAllVoiceAndAudio();
    isOpenRef.current = true;
    setIsOpen(true);
  };

  const handleActionExecution = (action: ChatbotAction) => {
    if (action.type === 'NAVIGATE' && action.path) {
      navigate(action.path);
    } else if (action.type === 'CHANGE_LANGUAGE' && action.language) {
      setLanguage(action.language);
    }
  };

  return (
    <>
      {/* Floating Chatbot Toggle Button */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-950 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group border border-indigo-400/40 ring-4 ring-indigo-500/20"
          title={t.aiAssistant}
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="text-xs font-bold pr-1 hidden sm:inline-block">
            {t.aiAssistant}
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[94vw] sm:w-[460px] h-[630px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between shadow-sm border-b border-indigo-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold leading-none">{t.brandName} {t.aiAssistant}</h3>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {t.voiceSynchronized} • 6 {t.languageName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* In-Chat Language Selector (controls both Voice Input & Voice Output) */}
              <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <select
                  value={language}
                  onChange={(e) => {
                    stopSpeakingOnly();
                    setLanguage(e.target.value as LanguageCode);
                  }}
                  className="bg-transparent text-white text-[11px] font-bold outline-none cursor-pointer"
                  title={t.preferredLanguage}
                >
                  <option value="en" className="bg-slate-900 text-white">English</option>
                  <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
                  <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
                  <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
                  <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
                  <option value="ml" className="bg-slate-900 text-white">മലയാളം (Malayalam)</option>
                </select>
              </div>

              {/* Voice Output (TTS) Toggle */}
              <button
                onClick={() => {
                  if (voiceState === 'READING_RESPONSE') {
                    stopSpeakingOnly();
                  }
                  setIsSpeakingEnabled(!isSpeakingEnabled);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSpeakingEnabled ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={isSpeakingEnabled ? t.voiceSynchronized : t.voiceSynchronized}
              >
                {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* CRITICAL CLOSE (✕) BUTTON: Immediately stops all voice, TTS, mic & closes */}
              <button
                onClick={handleCloseChat}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title={t.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Voice Reading / Status Banner */}
          {voiceState === 'READING_RESPONSE' && (
            <div className="bg-indigo-700 text-white px-4 py-2 flex items-center justify-between text-xs font-bold animate-in fade-in">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span>{t.voiceSynchronized} ({language.toUpperCase()})...</span>
              </div>
              <button
                onClick={stopSpeakingOnly}
                className="flex items-center gap-1 px-2 py-0.5 bg-indigo-900/90 hover:bg-indigo-950 rounded-lg text-[10px] font-bold transition-colors"
                title={t.stopVoice}
              >
                <Square className="w-3 h-3 fill-current" />
                <span>{t.stopVoice}</span>
              </button>
            </div>
          )}

          {/* Active Voice Listening Banner */}
          {voiceState === 'LISTENING' && (
            <div className="bg-rose-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>{t.listeningVoice} ({language.toUpperCase()})... {t.speakQuestion}</span>
              </div>
              <button
                onClick={toggleListening}
                className="px-2 py-0.5 bg-rose-800 hover:bg-rose-900 rounded-lg text-[10px] uppercase font-bold tracking-wider"
              >
                {t.close}
              </button>
            </div>
          )}

          {/* Processing Speech Banner */}
          {voiceState === 'PROCESSING_VOICE' && (
            <div className="bg-amber-600 text-white px-4 py-1.5 flex items-center gap-2 text-xs font-bold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{t.processing}</span>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Text Bubble with Structured Markdown */}
                <div
                  className={`max-w-[92%] rounded-2xl px-4 py-3 text-xs relative group ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-sm font-medium'
                      : m.is_out_of_scope
                      ? 'bg-amber-50 text-amber-950 border border-amber-200 rounded-bl-none shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.role === 'user' ? (
                    <p className="leading-relaxed">{m.content}</p>
                  ) : (
                    <div>
                      <MarkdownRenderer content={m.content} />
                      
                      {/* Individual Message Speaker Icon */}
                      <div className="mt-2 pt-1 flex items-center justify-end border-t border-slate-100">
                        {currentlySpeakingIdx === idx ? (
                          <button
                            onClick={stopSpeakingOnly}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-[10px] font-bold"
                            title={t.stopVoice}
                          >
                            <Square className="w-3 h-3 fill-current" />
                            <span>{t.stopVoice}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => speakText(m.content, idx)}
                            className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 text-[10px] font-medium"
                            title={t.voiceSynchronized}
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{t.view}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Execution Button */}
                  {m.action && m.action.type === 'NAVIGATE' && m.action.path && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleActionExecution(m.action!)}
                        className="w-full py-2 px-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl text-[11px] shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>{t.open} {m.action.label || ''}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Procedural Flowchart Component */}
                {m.role === 'assistant' && m.flowchart && m.flowchart.length > 0 && (
                  <div className="w-full max-w-[94%] mt-2.5 space-y-1.5">
                    <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider px-1 block flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      {t.details}
                    </span>
                    <div className="space-y-1.5">
                      {m.flowchart.map((step, sIdx) => (
                        <React.Fragment key={sIdx}>
                          <div className="bg-white border border-indigo-100 rounded-xl p-3 shadow-2xs flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              {step.step}
                            </span>
                            <div className="flex-1">
                              <h4 className="text-[11px] font-bold text-slate-900">{step.title}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{step.description}</p>
                              
                              {step.action_btn && (
                                <button
                                  onClick={() => navigate(step.action_btn!.path)}
                                  className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold transition-colors"
                                >
                                  <span>{step.action_btn.label}</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                          {sIdx < m.flowchart!.length - 1 && (
                            <div className="flex justify-center text-indigo-400">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Action Chips */}
                {m.role === 'assistant' && m.suggested_actions && m.suggested_actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[94%]">
                    {m.suggested_actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSend(act, false)}
                        className="text-[10px] font-bold bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full shadow-2xs transition-colors text-left"
                      >
                        ⚡ {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl rounded-bl-none text-xs text-slate-500 w-fit shadow-xs animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>{t.processing}</span>
              </div>
            )}

            {speechError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all ${
                voiceState === 'LISTENING'
                  ? 'bg-rose-600 border-rose-600 text-white shadow-lg ring-4 ring-rose-200 animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300'
              }`}
              title={voiceState === 'LISTENING' ? t.stopVoice : t.listeningVoice}
            >
              {voiceState === 'LISTENING' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder={
                voiceState === 'LISTENING'
                  ? `${t.listeningVoice}...`
                  : language === 'ta' 
                  ? 'பட்டா, சர்வே எண் அல்லது ஆவண பதிவேற்றம் பற்றி கேட்கவும்...'
                  : language === 'hi'
                  ? 'पट्टा, खसरा संख्या या दस्तावेज़ अपलोड के बारे में पूछें...'
                  : language === 'te'
                  ? 'పట్టా, సర్వే నంబర్ లేదా పత్రాల అప్‌లోడ్ గురించి అడగండి...'
                  : language === 'kn'
                  ? 'ಪಟ್ಟಾ, ಸರ್ವೆ ನಂಬರ್ ಅಥವಾ ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಬಗ್ಗೆ ಕೇಳಿ...'
                  : language === 'ml'
                  ? 'പട്ട, സർവേ നമ്പർ അല്ലെങ്കിൽ രേഖ അപ്‌ലോഡ് ചെയ്യുന്നതിനെക്കുറിച്ച് ചോദിക്കുക...'
                  : t.askAssistant
              }
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none font-medium"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={isLoading || !inputVal.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-40 transition-colors shadow-sm"
              title={t.submit}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
