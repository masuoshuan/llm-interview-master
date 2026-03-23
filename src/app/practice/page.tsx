"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, CheckCircle, BookOpen } from "lucide-react";

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

  const generateQuestion = async () => {
    setLoading(true);
    setShowAnswer(false);
    
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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">面试练习</h1>
          <p className="text-purple-200">选择主题和难度，AI 为你生成面试问题</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-purple-200 mb-2">主题</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-white/20 border border-purple-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              <label className="block text-purple-200 mb-2">难度</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-white/20 border border-purple-400/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={generateQuestion}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
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
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-l-4 border-purple-400">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">Q</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{question.question}</h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      question.difficulty === "easy" ? "bg-green-600" :
                      question.difficulty === "medium" ? "bg-yellow-600" : "bg-red-600"
                    } text-white`}>
                      {question.difficulty === "easy" ? "简单" :
                       question.difficulty === "medium" ? "中等" : "困难"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Answer Toggle */}
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-6 py-4 text-white font-semibold transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                {showAnswer ? "隐藏答案" : "查看答案"}
              </button>

              {/* Answer Card */}
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30"
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-10 h-10 text-green-400 flex-shrink-0" />
                    <div className="prose prose-invert max-w-none">
                      <h3 className="text-xl font-bold text-white mb-4">参考答案</h3>
                      <div className="text-purple-100 whitespace-pre-line leading-relaxed">
                        {question.answer}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
