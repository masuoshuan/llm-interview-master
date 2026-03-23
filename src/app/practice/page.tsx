"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, MessageSquare, Plus, Trash2, ChevronRight, BookOpen, ThumbsUp, ThumbsDown } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Topic {
  id: string;
  name: string;
  icon: string;
  count: number;
}

const topics: Topic[] = [
  { id: 'transformer', name: 'Transformer 架构', icon: '🧠', count: 24 },
  { id: 'attention', name: 'Attention 机制', icon: '✨', count: 18 },
  { id: 'llm-basics', name: '大模型基础', icon: '📚', count: 32 },
  { id: 'fine-tuning', name: '微调技术', icon: '🔧', count: 15 },
  { id: 'prompt', name: 'Prompt Engineering', icon: '💡', count: 21 },
  { id: 'rlhf', name: 'RLHF', icon: '🎯', count: 12 },
];

export default function PracticePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content?: string) => {
    const messageContent = content || input;
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic || 'general',
          difficulty: 'medium',
          question: messageContent,
        }),
      });

      if (!response.ok) throw new Error('生成失败');
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || data.question || '抱歉，我暂时无法回答这个问题。',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，出现了一些问题。请稍后重试。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSelectedTopic(null);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - Topics */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-1">学习主题</h2>
          <p className="text-sm text-gray-500">选择一个主题开始对话</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                selectedTopic === topic.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold">{topic.name}</div>
                  <div className={`text-xs ${selectedTopic === topic.id ? 'text-orange-100' : 'text-gray-500'}`}>
                    {topic.count} 个问题
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${selectedTopic === topic.id ? 'text-white' : 'text-gray-400'}`} />
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={clearChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
            清空对话
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            <div>
              <h1 className="font-bold text-gray-900">
                {selectedTopic ? topics.find(t => t.id === selectedTopic)?.name : '自由对话'}
              </h1>
              <p className="text-xs text-gray-500">AI 面试助手</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {messages.length} 条消息
            </span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <EmptyState onSelectTopic={sendMessage} />
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                      <span className="text-gray-500 text-sm">正在思考...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 bg-gray-50 rounded-2xl p-2 border border-gray-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入你的问题，例如：'请解释 Transformer 的 Self-Attention 机制'..."
                className="flex-1 bg-transparent border-none outline-none resize-none px-4 py-3 text-gray-900 placeholder-gray-400 max-h-32 min-h-[56px]"
                rows={1}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                发送
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              按 Enter 发送，Shift + Enter 换行
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-indigo-500' 
          : 'bg-gradient-to-br from-orange-500 to-red-500'
      }`}>
        {isUser ? (
          <span className="text-white text-sm font-bold">你</span>
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className={`max-w-2xl ${isUser ? 'text-right' : ''}`}>
        <div className={`rounded-2xl p-4 shadow-sm ${
          isUser 
            ? 'bg-blue-500 text-white rounded-tr-sm' 
            : 'bg-white text-gray-900 rounded-tl-sm border border-gray-200'
        }`}>
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
        
        {!isUser && (
          <div className="flex items-center gap-2 mt-2">
            <button className="text-gray-400 hover:text-green-500 transition-colors">
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <ThumbsDown className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1 text-xs">
              <BookOpen className="w-3 h-3" />
              引用来源
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ onSelectTopic }: { onSelectTopic: (topic: string) => void }) {
  const suggestions = [
    "请解释 Transformer 的 Self-Attention 机制",
    "BERT 和 GPT 有什么区别？",
    "什么是 LoRA 微调？",
    "如何优化大模型的推理速度？",
  ];

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          开始你的面试练习
        </h2>
        <p className="text-gray-600 mb-8">
          选择一个主题或直接提问，AI 会为你详细解答
        </p>
        
        <div className="grid sm:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectTopic(suggestion)}
              className="text-left p-4 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl transition-all text-sm text-gray-700"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
