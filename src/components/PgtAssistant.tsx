import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  BookOpen,
  Building2,
  Award,
  MessageSquare,
  X,
  RotateCcw,
  Send,
  ChevronRight,
  Home
} from 'lucide-react';
import { assistantEngine, EngineResponse } from '../lib/ai/assistantEngine';

type EntranceState = 'hidden' | 'entering' | 'idle';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  userText?: string;
  response?: EngineResponse;
}

export const PgtAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [entranceState, setEntranceState] = useState<EntranceState>('hidden');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-init',
      sender: 'assistant',
      response: assistantEngine.getMainMenu(new Date())
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [imgError, setImgError] = useState<boolean>(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ── Entrance animation sequence synchronized to trigger right AFTER site preloader finishes (~650ms) ──
  useEffect(() => {
    // 1. Hide launcher while site preloader overlay is active (0ms to 650ms)
    setEntranceState('hidden');

    // 2. Trigger elastic spring pop entrance animation as page content becomes visible (650ms)
    const entranceTimer = setTimeout(() => {
      setEntranceState('entering');
    }, 650);

    // 3. Transition smoothly into continuous idle float bobbing after entrance completes (650ms + 850ms = 1500ms)
    const idleTimer = setTimeout(() => {
      setEntranceState('idle');
    }, 1500);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(idleTimer);
    };
  }, [location.pathname]);

  // ── Click outside handler to close drawer smoothly ────────────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!isOpen) return;
      const target = event.target as Node;
      if (
        drawerRef.current &&
        !drawerRef.current.contains(target) &&
        launcherRef.current &&
        !launcherRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // ── Smooth scroll positioning logic ──────────────────────────────────────
  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      if (messages.length <= 1 && !isTyping) {
        chatScrollRef.current.scrollTop = 0;
      } else {
        scrollToBottom();
      }
    }
  }, [messages, isTyping, isOpen]);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // ── WhatsApp-style typing indicator flow for user actions ───────────────
  const pushMessageWithTyping = (userText: string, botResponseGetter: () => EngineResponse) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      userText
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = botResponseGetter();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        response: botResponse
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 450);
  };

  const handleSelectCategory = (categoryId: string, categoryLabel: string) => {
    pushMessageWithTyping(`Selected: ${categoryLabel}`, () => assistantEngine.getSubMenu(categoryId));
  };

  const handleSelectSubItem = (knowledgeKey: string, subItemLabel: string) => {
    pushMessageWithTyping(subItemLabel, () => assistantEngine.getAnswer(knowledgeKey));
  };

  const handleResetMainMenu = () => {
    pushMessageWithTyping('Return to Main Menu', () => assistantEngine.getMainMenu(new Date()));
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryText = inputText.trim();
    if (!queryText) return;

    setInputText('');
    pushMessageWithTyping(queryText, () => assistantEngine.query(queryText));
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'Building2':
        return <Building2 className="w-4 h-4 text-violet-400 shrink-0" />;
      case 'Award':
        return <Award className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-sky-400 shrink-0" />;
      default:
        return <Bot className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };

  return (
    <>
      {/* ── 1. Floating Launcher Icon Button with Morphing & Entrance Sync ─────── */}
      <div
        key={`pgt-launcher-wrapper-${location.pathname}`}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 transition-all duration-300 ${
          entranceState === 'hidden'
            ? 'opacity-0 scale-0 translate-y-16 pointer-events-none'
            : entranceState === 'entering'
            ? 'animate-launcher-entrance'
            : 'animate-launcher-bob'
        }`}
      >
        <button
          ref={launcherRef}
          onClick={handleToggleOpen}
          aria-label={isOpen ? 'Close PGT AI Assistant' : 'Open PGT AI Assistant'}
          title={isOpen ? 'Close Assistant' : 'Open Assistant'}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900/95 backdrop-blur-md border border-indigo-500/30 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative animate-launcher-aura"
        >
          {/* Inner Launcher Morphing Icon Container */}
          <div className="relative w-full h-full p-1.5 sm:p-2 flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl">
            {/* Closed State: AI Logo Icon */}
            <div
              className={`absolute inset-0 p-1.5 sm:p-2 flex items-center justify-center transition-all duration-300 transform ${
                isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            >
              {!imgError ? (
                <img
                  src="/PGT AI.png"
                  alt="PGT AI Logo"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain drop-shadow"
                />
              ) : (
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 group-hover:rotate-12 transition-transform" />
              )}
            </div>

            {/* Open State: Close 'X' Cross Icon */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${
                isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
              }`}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300 group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </div>

          {/* Online Status Ring Indicator (Unclipped, attached to floating button unit) */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 z-10 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse shadow-md pointer-events-none" />
          )}
        </button>
      </div>

      {/* ── 2. Chat Drawer Window with Origin-Anchored Exit Animations ────────── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label="PGT AI Assistant Drawer"
        style={{ transformOrigin: 'bottom right' }}
        className={`fixed bottom-[64px] right-3 left-3 sm:left-auto sm:right-6 sm:bottom-[88px] z-50 max-w-md sm:w-[400px] h-[520px] max-h-[78vh] bg-slate-900 text-white border border-slate-800 shadow-2xl rounded-3xl overflow-hidden flex flex-col transform-gpu transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto shadow-indigo-950/50'
            : 'opacity-0 scale-0 translate-y-6 pointer-events-none'
        }`}
      >
        {/* Header Bar */}
        <div className="px-4 py-3.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between gap-2 shrink-0 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/60 p-1 flex items-center justify-center shrink-0 shadow-inner">
              {!imgError ? (
                <img src="/PGT AI.png" alt="PGT AI" className="w-full h-full object-contain" />
              ) : (
                <Bot className="w-5 h-5 text-indigo-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-xs sm:text-sm text-white truncate leading-tight">
                PGT Assistant
              </h2>
              <p className="text-[10px] text-slate-400 truncate leading-tight font-medium">
                AI Concierge
              </p>
            </div>
          </div>

          {/* Minimalist Home Header Button (Clean, Hover Zoom Micro-Interaction, Native Tooltip) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleResetMainMenu}
              title="Return to Main Menu"
              aria-label="Return to Main Menu"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600/25 text-slate-300 hover:text-indigo-300 border border-slate-700/60 hover:border-indigo-500/50 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm group"
            >
              <Home className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Content Area - Scrollable Chat History Message Stream */}
        <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {/* 1. USER MESSAGE BUBBLE */}
              {msg.sender === 'user' && (
                <div className="flex justify-end animate-msg-user">
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-xs px-3.5 py-2 text-xs font-medium max-w-[85%] shadow-md">
                    {msg.userText}
                  </div>
                </div>
              )}

              {/* 2. ASSISTANT MESSAGE CARD */}
              {msg.sender === 'assistant' && msg.response && (
                <div className="flex flex-col items-start space-y-2 animate-msg-bot w-full">
                  {/* Main Response Box */}
                  <div className="w-full bg-gradient-to-br from-indigo-950/40 via-slate-800/60 to-slate-900 border border-indigo-500/20 rounded-2xl p-3.5 space-y-2 shadow-inner">
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs sm:text-sm">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
                      <span>{msg.response.title}</span>
                    </div>
                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {msg.response.text}
                    </p>
                  </div>

                  {/* MAIN MENU CATEGORIES */}
                  {msg.response.type === 'main_menu' && msg.response.categories && (
                    <div className="w-full space-y-2 pt-1">
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider px-1">
                        Select Category
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.response.categories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => handleSelectCategory(cat.id, cat.label)}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-2.5 group active:scale-[0.99]"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                                {getCategoryIcon(cat.iconName)}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-semibold text-xs text-white group-hover:text-indigo-300 transition-colors truncate">
                                  {cat.label}
                                </h4>
                                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                  {cat.description}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUB-MENU ITEMS */}
                  {msg.response.type === 'sub_menu' && msg.response.subItems && (
                    <div className="w-full space-y-2 pt-1">
                      <div className="flex items-center justify-between px-1">
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                          Available Items
                        </p>
                        <button
                          onClick={handleResetMainMenu}
                          className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Back to Categories</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {msg.response.subItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectSubItem(item.knowledgeKey, item.label)}
                            className="w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group active:scale-[0.99]"
                          >
                            <div className="min-w-0">
                              <h4 className="font-semibold text-xs text-white group-hover:text-indigo-300 transition-colors truncate">
                                {item.label}
                              </h4>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {item.description}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ANSWER / UNSUPPORTED ACTIONS */}
                  {(msg.response.type === 'answer' || msg.response.type === 'unsupported') && (
                    <div className="w-full space-y-3 pt-1">
                      <div className="flex items-center gap-2 pt-1">
                        {msg.response.primaryAction && (
                          <button
                            onClick={() => handleNavigate(msg.response!.primaryAction!.pageUrl)}
                            className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95 text-center flex items-center justify-center gap-1.5"
                          >
                            <span>{msg.response.primaryAction.label}</span>
                          </button>
                        )}
                        {msg.response.secondaryAction && (
                          <button
                            onClick={() => handleNavigate(msg.response!.secondaryAction!.pageUrl)}
                            className="flex-1 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700/60 active:scale-95 text-center flex items-center justify-center gap-1.5"
                          >
                            <span>{msg.response.secondaryAction.label}</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={handleResetMainMenu}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-xs font-medium text-slate-400 hover:text-indigo-300 border border-slate-800 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Return to Main Menu</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* WhatsApp-Style Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 animate-msg-bot pt-1">
              <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700/60 p-1 flex items-center justify-center shrink-0 shadow-inner">
                {!imgError ? (
                  <img src="/PGT AI.png" alt="PGT AI" className="w-full h-full object-contain" />
                ) : (
                  <Bot className="w-4 h-4 text-indigo-400" />
                )}
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-xs px-3.5 py-2.5 flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-typing-dot-1" />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-typing-dot-2" />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-typing-dot-3" />
              </div>
            </div>
          )}
        </div>

        {/* Footer Freeform Text Input */}
        <form
          onSubmit={handleTextSubmit}
          className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Ask PGT Assistant..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            aria-label="Send Inquiry"
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-all shadow-md shadow-indigo-500/20 active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
};

export default PgtAssistant;

