"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export function ChatbotWidget() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mettre à jour le message d'accueil initial lors du changement de langue
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            sender: "bot",
            text: t("bot.initial_msg"),
          },
        ];
      }
      return prev;
    });
  }, [language, t]);

  // Auto-scroll à la fin des messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text, language }),
      });

      if (!response.ok) {
        throw new Error("API Offline");
      }

      const data = await response.json();
      const botMessage: Message = {
        sender: "bot",
        text: data.response,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      // Message de secours si l'API FastAPI est indisponible
      const offlineMessage: Message = {
        sender: "bot",
        text: t("bot.offline_msg"),
      };
      setMessages((prev) => [...prev, offlineMessage]);
    } finally {
      setLoading(false);
    }
  };

  const dynamicSuggestions = [
    t("bot.suggestion_1"),
    t("bot.suggestion_2"),
    t("bot.suggestion_3"),
    t("bot.suggestion_4"),
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[99] text-left">
      
      {/* Bulle de Chat Flottante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#ebc834] hover:bg-[#dfca70] text-slate-900 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center relative cursor-pointer group"
          aria-label="Ouvrir le chat"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
          <div className="absolute right-16 bg-slate-900 text-white font-bold text-[10px] tracking-wider uppercase py-1.5 px-3 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap select-none">
            {t("bot.help_bubble")}
          </div>
        </button>
      )}

      {/* Fenêtre de Chat */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 text-slate-800 dark:text-slate-100 transition-colors duration-300">
          
          {/* Header */}
          <div className="bg-[#ebc834] dark:bg-slate-950 text-slate-900 dark:text-white px-5 py-4 flex justify-between items-center border-b border-gray-200 dark:border-slate-800 select-none">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900/10 p-2 rounded-full">
                <Bot className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm uppercase tracking-wide">{t("bot.name")}</h4>
                <p className="text-[10px] font-bold text-slate-700 dark:text-slate-400 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> {t("bot.online")}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-black/5 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages de discussion */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-950/20 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                {/* Icône avatar */}
                <div className={`p-1.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 border dark:border-slate-700 select-none ${
                  msg.sender === "user" 
                    ? "bg-[#006680] text-white border-[#006680]" 
                    : "bg-[#ebc834] text-slate-900 border-[#ebc834]"
                }`}>
                  {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bulle de texte */}
                <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  msg.sender === "user"
                    ? "bg-[#006680] text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-800"
                }`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="p-1.5 h-8 w-8 rounded-full bg-[#ebc834] text-slate-900 border border-[#ebc834] flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#006680]" />
                  {t("bot.thinking")}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions rapides (cliquables) */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900 flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap select-none" style={{ scrollbarWidth: "none" }}>
            {dynamicSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                disabled={loading}
                className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-350 px-3 py-1.5 rounded-full cursor-pointer hover:border-slate-350 dark:hover:bg-slate-600 transition select-none disabled:opacity-50"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Zone de saisie */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder={t("bot.input_placeholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#ebc834] text-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="bg-[#006680] hover:bg-[#008099] disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 p-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
