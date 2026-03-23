"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, CheckCircle, BookOpen, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";

interface Question {
  question: string;
  answer: string;
  difficulty: string;
  topic: string;
}

export default function PracticePage() {
  const [topic, setTopic] = useState("Transformer 架构");
  const [difficulty, setDifficulty] = useState("medium");
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);

  const generateQuestion = async () => {
    setLoading(true);
    setShowAnswer(false);
    setFeedback(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty }),
      });

      if (!response.ok) throw new Error('生成失败');
      
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error('Error:', error);
      alert('生成问题失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">面试练习</h1>
              <p className="text-purple-200">AI 为你生成个性化面试问题</p>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-purple-200 mb-2 text-sm font-medium">📚 主题</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-white/10 border border-purple-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all min-h-[48px]"
              >
                <option value="Transformer 架构">Transformer 架构</option>
                <option value="Attention 机制">Attention 机制</option>
                <option value="大模型基础">大模型基础</option>
                <option value="微调技术">微调技术</option>
                <option value="Prompt Engineering">Prompt Engineering</option>
                <option value="RLHF">RLHF</option>
              </select>
            </div>
            <div>
              <label className="block text-purple-200 mb-2 text-sm font-medium">📊 难度</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-white/10 border border-purple-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all min-h-[48px]"
              >
                <option value="easy">🟢 简单</option>
                <option value="medium">🟡 中等</option>
                <option value="hard">🔴 困难</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={generateQuestion}
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> 生成中...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> 生成问题</>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Question Display */}
        <AnimatePresence>
          {question && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Question Card */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="glass-card p-6 border-l-4 border-purple-400"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 font-bold text-white text-lg">
                    Q
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-3 leading-relaxed">{question.question}</h2>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        question.difficulty === "easy" ? "bg-green-600/80" :
                        question.difficulty === "medium" ? "bg-yellow-600/80" : "bg-red-600/80"
                      } text-white`}>
                        {question.difficulty === "easy" ? "🟢 简单" :
                         question.difficulty === "medium" ? "🟡 中等" : "🔴 困难"}
                      </span>
                      <span className="text-purple-300 text-sm">•</span>
                      <span className="text-purple-200 text-sm">{question.topic}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Answer Toggle */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowAnswer(!showAnswer)}
                className="w-full glass-card hover:bg-white/20 rounded-xl px-6 py-4 text-white font-semibold transition-all flex items-center justify-center gap-2 min-h-[56px]"
              >
                <BookOpen className="w-5 h-5" />
                {showAnswer ? "隐藏答案" : "查看答案"}
              </motion.button>

              {/* Answer Card */}
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="glass-card rounded-2xl p-6 border border-green-500/30 bg-gradient-to-br from-green-600/20 to-emerald-600/20"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <CheckCircle className="w-10 h-10 text-green-400 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">参考答案</h3>
                      <p className="text-purple-200 text-sm mb-4">
                        仔细阅读答案，理解关键概念和解题思路
                      </p>
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none mb-6">
                    <div className="text-purple-100 whitespace-pre-line leading-relaxed bg-black/20 rounded-xl p-6">
                      {question.answer}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <span className="text-purple-200 text-sm">这个答案有帮助吗？</span>
                    <button
                      onClick={() => setFeedback('helpful')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        feedback === 'helpful' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-white/10 hover:bg-white/20 text-purple-200'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" /> 有帮助
                    </button>
                    <button
                      onClick={() => setFeedback('not-helpful')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        feedback === 'not-helpful' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-white/10 hover:bg-white/20 text-purple-200'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" /> 需改进
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Next Question Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={generateQuestion}
                className="w-full glass-card hover:bg-white/20 rounded-xl px-6 py-4 text-white font-semibold transition-all flex items-center justify-center gap-2 min-h-[56px]"
              >
                <RefreshCw className="w-5 h-5" />
                生成下一题
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!question && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-purple-600/30 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">准备开始练习</h3>
            <p className="text-purple-200 mb-6 max-w-md mx-auto">
              选择主题和难度，点击&quot;生成问题&quot;开始你的面试练习
            </p>
            <button
              onClick={generateQuestion}
              className="btn-primary mx-auto"
            >
              <Sparkles className="w-5 h-5" /> 开始练习
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
