"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Sparkles, Loader2, MessageSquare, Trash2, ChevronRight,
  BookOpen, ThumbsUp, ThumbsDown, Lightbulb, FileText, Zap, History, X,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendedQuestions?: string[];
  source?: 'cache' | 'llm' | 'rag';
}

interface Topic {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// 持久化存储的会话结构
interface SavedSession {
  id: string;
  topicId: string | null;
  topicName: string;
  startedAt: number;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string; // ISO string，便于 JSON 序列化
    recommendedQuestions?: string[];
    source?: 'cache' | 'llm' | 'rag';
  }>;
}

const STORAGE_KEY = 'llm_interview_sessions';
const MAX_SESSIONS = 20;

const topics: Topic[] = [
  { id: 'transformer', name: 'Transformer 架构', icon: '🧠', count: 24 },
  { id: 'attention', name: 'Attention 机制', icon: '✨', count: 18 },
  { id: 'llm-basics', name: '大模型基础', icon: '📚', count: 32 },
  { id: 'fine-tuning', name: '微调技术', icon: '🔧', count: 15 },
  { id: 'prompt', name: 'Prompt Engineering', icon: '💡', count: 21 },
  { id: 'rlhf', name: 'RLHF', icon: '🎯', count: 12 },
];

const TOPIC_INIT_QUESTIONS: Record<string, string> = {
  transformer: '请给我出 3 道关于 Transformer 架构的面试题，覆盖不同难度，每道题给出详细答案。',
  attention: '请给我出 3 道关于 Attention 机制的面试题，覆盖不同难度，每道题给出详细答案。',
  'llm-basics': '请给我出 3 道大模型基础知识的面试题，覆盖不同难度，每道题给出详细答案。',
  'fine-tuning': '请给我出 3 道关于大模型微调技术的面试题（LoRA、P-Tuning 等），每道题给出详细答案。',
  prompt: '请给我出 3 道关于 Prompt Engineering 的面试题，覆盖不同难度，每道题给出详细答案。',
  rlhf: '请给我出 3 道关于 RLHF 的面试题，覆盖不同难度，每道题给出详细答案。',
};

function toHistory(messages: Message[]): HistoryMessage[] {
  return messages.map(m => ({ role: m.role, content: m.content }));
}

// localStorage 工具函数
function loadSessions(): SavedSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSession(session: SavedSession) {
  try {
    const sessions = loadSessions();
    const idx = sessions.findIndex(s => s.id === session.id);
    if (idx >= 0) {
      sessions[idx] = session;
    } else {
      sessions.unshift(session);
    }
    // 只保留最近 MAX_SESSIONS 条
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
  } catch {
    // 忽略存储错误（隐身模式等）
  }
}

function deleteSession(id: string) {
  try {
    const sessions = loadSessions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {}
}

export default function PracticePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastTopicRef = useRef<string | null>(null);
  const currentSessionId = useRef<string>(Date.now().toString());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setHasResume(!!localStorage.getItem('resume_uploaded'));
    setSavedSessions(loadSessions());
  }, []);

  // 每次消息更新时保存到 localStorage
  useEffect(() => {
    if (messages.length === 0) return;
    const topicObj = topics.find(t => t.id === selectedTopic);
    const session: SavedSession = {
      id: currentSessionId.current,
      topicId: selectedTopic,
      topicName: topicObj?.name || '自由对话',
      startedAt: parseInt(currentSessionId.current),
      messages: messages.map(m => ({
        ...m,
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
      })),
    };
    saveSession(session);
    setSavedSessions(loadSessions());
  }, [messages, selectedTopic]);

  // 切换话题时自动生成该主题的面试题
  useEffect(() => {
    if (!selectedTopic || selectedTopic === lastTopicRef.current) return;
    lastTopicRef.current = selectedTopic;
    const initQuestion = TOPIC_INIT_QUESTIONS[selectedTopic];
    if (initQuestion) {
      // 新话题 = 新 session
      currentSessionId.current = Date.now().toString();
      setMessages([]);
      setTimeout(() => sendMessage(initQuestion), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic]);

  const sendMessage = useCallback(async (content?: string) => {
    const messageContent = content || input;
    if (!messageContent.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
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
          history: toHistory(messages),
        }),
      });

      if (!response.ok) throw new Error('生成失败');
      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || data.question || '抱歉，我暂时无法回答这个问题。',
        timestamp: new Date(),
        recommendedQuestions: data.recommendedQuestions || [],
        source: data._source,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，出现了一些问题。请稍后重试。',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, loading, messages, selectedTopic]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSelectedTopic(null);
    lastTopicRef.current = null;
    currentSessionId.current = Date.now().toString();
  };

  // 从历史记录恢复会话
  const restoreSession = (session: SavedSession) => {
    const restored: Message[] = session.messages.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
    setMessages(restored);
    setSelectedTopic(session.topicId);
    lastTopicRef.current = session.topicId;
    currentSessionId.current = session.id;
    setShowHistory(false);
  };

  return (
    <div className="h-screen flex bg-gray-50 relative">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-1">学习主题</h2>
          <p className="text-sm text-gray-500">点击话题自动生成面试题</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                if (selectedTopic === topic.id) {
                  lastTopicRef.current = null;
                  setSelectedTopic(null);
                  setTimeout(() => setSelectedTopic(topic.id), 50);
                } else {
                  setSelectedTopic(topic.id);
                }
              }}
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
                    {selectedTopic === topic.id ? '点击刷新题目' : '点击开始练习'}
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${selectedTopic === topic.id ? 'text-white' : 'text-gray-400'}`} />
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2">
          {/* 历史记录入口 */}
          <button
            onClick={() => { setSavedSessions(loadSessions()); setShowHistory(true); }}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-sm font-medium bg-gray-50 hover:bg-gray-100 text-gray-700"
          >
            <History className="w-4 h-4 text-gray-500" />
            历史对话
            {savedSessions.length > 0 && (
              <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                {savedSessions.length}
              </span>
            )}
          </button>

          <Link
            href="/resume"
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
              hasResume
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            {hasResume ? '✓ 简历已上传' : '上传简历（RAG）'}
          </Link>

          <button
            onClick={clearChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all text-sm"
          >
            <Trash2 className="w-4 h-4" />
            清空对话
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            <div>
              <h1 className="font-bold text-gray-900">
                {selectedTopic ? topics.find(t => t.id === selectedTopic)?.name : '自由对话'}
              </h1>
              <p className="text-xs text-gray-500">
                {loading ? '正在生成面试题...' : 'AI 面试助手 · 可继续追问'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {messages.length > 0 && (
              <span className="text-sm text-gray-400">{messages.length} 条消息</span>
            )}
            {hasResume && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                <FileText className="w-3 h-3" /> 简历 RAG
              </span>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <EmptyState onSelectTopic={sendMessage} />
          ) : (
            <>
              <AnimatePresence>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onRecommendClick={sendMessage}
                  />
                ))}
              </AnimatePresence>
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
        <div className="p-6 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 bg-gray-50 rounded-2xl p-2 border border-gray-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="继续追问，或输入新问题..."
                className="flex-1 bg-transparent border-none outline-none resize-none px-4 py-3 text-gray-900 placeholder-gray-400 max-h-32 min-h-[56px]"
                rows={1}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4" />
                发送
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Enter 发送 · Shift+Enter 换行 · 对话自动保存
            </p>
          </div>
        </div>
      </main>

      {/* 历史记录抽屉 */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 z-20"
              onClick={() => setShowHistory(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl z-30 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">历史对话</h2>
                  <p className="text-sm text-gray-500">{savedSessions.length} 条记录，保存在本地</p>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {savedSessions.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <History className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">暂无历史记录</p>
                    <p className="text-xs mt-1">对话完成后自动保存</p>
                  </div>
                ) : (
                  savedSessions.map((session) => {
                    const topicObj = topics.find(t => t.id === session.topicId);
                    const firstAI = session.messages.find(m => m.role === 'assistant');
                    const preview = firstAI?.content.slice(0, 80) || '暂无内容';
                    const date = new Date(session.startedAt);
                    const isToday = new Date().toDateString() === date.toDateString();
                    const dateStr = isToday
                      ? date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
                      : date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-2xl p-4 cursor-pointer transition-all"
                        onClick={() => restoreSession(session)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{topicObj?.icon || '💬'}</span>
                            <span className="font-semibold text-gray-900 text-sm">{session.topicName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400 whitespace-nowrap">{dateStr}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSession(session.id);
                                setSavedSessions(loadSessions());
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 text-gray-400 transition-all rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{preview}...</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-gray-400">{session.messages.length} 条消息</span>
                          <span className="text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">点击恢复 →</span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {savedSessions.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      localStorage.removeItem(STORAGE_KEY);
                      setSavedSessions([]);
                    }}
                    className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors py-2"
                  >
                    清空所有历史记录
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MessageBubble({
  message,
  onRecommendClick,
}: {
  message: Message;
  onRecommendClick: (q: string) => void;
}) {
  const isUser = message.role === 'user';
  const [liked, setLiked] = useState<boolean | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
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

      <div className={`flex-1 min-w-0 ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`rounded-2xl p-4 shadow-sm max-w-2xl ${
          isUser
            ? 'bg-blue-500 text-white rounded-tr-sm'
            : 'bg-white text-gray-900 rounded-tl-sm border border-gray-200'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-headings:font-bold prose-strong:font-bold prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && (
          <div className="mt-2 space-y-3">
            <div className="flex items-center gap-3">
              {message.source && (
                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  message.source === 'cache'
                    ? 'bg-green-100 text-green-700'
                    : message.source === 'rag'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {message.source === 'cache' && <><Zap className="w-3 h-3" />缓存</>}
                  {message.source === 'rag' && <><FileText className="w-3 h-3" />简历 RAG</>}
                  {message.source === 'llm' && <><Sparkles className="w-3 h-3" />AI 生成</>}
                </span>
              )}
              <button
                onClick={() => setLiked(true)}
                className={`transition-colors ${liked === true ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLiked(false)}
                className={`transition-colors ${liked === false ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1 text-xs">
                <BookOpen className="w-3 h-3" />
                引用来源
              </button>
            </div>

            {message.recommendedQuestions && message.recommendedQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-yellow-500" />
                  继续探索
                </p>
                <div className="flex flex-wrap gap-2">
                  {message.recommendedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => onRecommendClick(q)}
                      className="text-xs text-left px-3 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 hover:border-orange-300 text-orange-800 rounded-xl transition-all max-w-xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
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
    "什么是 RLHF？",
    "如何优化大模型的推理速度？",
    "Positional Encoding 有哪些方式？",
  ];

  return (
    <div className="h-full flex items-center justify-center py-12">
      <div className="text-center max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">开始你的面试练习</h2>
        <p className="text-gray-500 mb-8 text-sm">
          点击左侧话题自动生成面试题，或直接输入问题
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => onSelectTopic(suggestion)}
              className="text-left p-4 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl transition-all text-sm text-gray-700 shadow-sm"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
