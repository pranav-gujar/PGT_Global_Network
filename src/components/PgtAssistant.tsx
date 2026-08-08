import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowRight,
  Home
} from 'lucide-react';
import { assistantEngine, EngineResponse, MENU_CATEGORIES } from '../lib/ai/assistantEngine';

export const PgtAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [engineState, setEngineState] = useState<EngineResponse>(() => assistantEngine.getMainMenu());
  const [inputText, setInputText] = useState<string>('');
  const [imgError, setImgError] = useState<boolean>(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  // Scroll content to top when engine state changes
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = 0;
    }
  }, [engineState]);

  const handleSelectCategory = (categoryId: string) => {
    setEngineState(assistantEngine.getSubMenu(categoryId));
  };

  const handleSelectSubItem = (knowledgeKey: string) => {
    setEngineState(assistantEngine.getAnswer(knowledgeKey));
  };

  const handleResetMainMenu = () => {
    setEngineState(assistantEngine.getMainMenu());
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setEngineState(assistantEngine.query(inputText));
    setInputText('');
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
      {/* ── 1. Floating Launcher Icon Button ──────────────────────────────────── */}
      <button
        ref={launcherRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle PGT AI Assistant"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 w-12 h-12 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl flex items-center justify-center p-2 transition-all duration-300 hover:scale-105 active:scale-95 group animate-bounce-subtle"
      >
        {!imgError ? (
          <img
            src="/PGT AI.png"
            alt="PGT AI Logo"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain drop-shadow"
          />
        ) : (
          <Bot className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform" />
        )}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
      </button>

      {/* ── 2. Chat Drawer Window ──────────────────────────────────────────────── */}
      {isOpen && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-label="PGT AI Assistant Drawer"
          className="fixed bottom-20 right-4 sm:bottom-20 sm:right-6 z-50 max-w-md w-[calc(100%-2rem)] sm:w-[400px] h-[560px] max-h-[84vh] bg-slate-900 text-white border border-slate-800 shadow-2xl rounded-3xl overflow-hidden flex flex-col transition-all duration-300 ease-out transform"
        >
          {/* Header Bar */}
          <div className="px-4 py-3.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between gap-2 shrink-0 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/60 p-1 flex items-center justify-center shrink-0">
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
                <p className="text-[10px] text-slate-400 truncate leading-tight">
                  AI Concierge
                </p>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleResetMainMenu}
                title="Return to Main Menu"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700/50 transition-colors"
              >
                <Home className="w-3 h-3 text-indigo-400" />
                <span className="hidden sm:inline">Main Menu</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Assistant"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {/* Engine Message Box */}
            <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{engineState.title}</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {engineState.text}
              </p>
            </div>

            {/* MAIN MENU STATE */}
            {engineState.type === 'main_menu' && engineState.categories && (
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider px-1">
                  Select Category
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {engineState.categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className="w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
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

            {/* SUB-MENU STATE */}
            {engineState.type === 'sub_menu' && engineState.subItems && (
              <div className="space-y-2 pt-1">
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
                  {engineState.subItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSubItem(item.knowledgeKey)}
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

            {/* ANSWER / UNSUPPORTED STATE */}
            {(engineState.type === 'answer' || engineState.type === 'unsupported') && (
              <div className="space-y-3 pt-1">
                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {engineState.primaryAction && (
                    <button
                      onClick={() => handleNavigate(engineState.primaryAction!.pageUrl)}
                      className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95 text-center flex items-center justify-center gap-1.5"
                    >
                      <span>{engineState.primaryAction.label}</span>
                    </button>
                  )}
                  {engineState.secondaryAction && (
                    <button
                      onClick={() => handleNavigate(engineState.secondaryAction!.pageUrl)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700/60 active:scale-95 text-center flex items-center justify-center gap-1.5"
                    >
                      <span>{engineState.secondaryAction.label}</span>
                    </button>
                  )}
                </div>

                {/* Reset to Main Menu */}
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
      )}
    </>
  );
};

export default PgtAssistant;
