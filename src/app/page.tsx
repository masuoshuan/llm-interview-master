"use client";

import { motion } from "framer-motion";
import { Brain, BookOpen, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const topics = [
  { id: "transformer", name: "Transformer 架构", icon: Brain, color: "from-blue-500 to-purple-500" },
  { id: "attention", name: "Attention 机制", icon: Sparkles, color: "from-green-500 to-teal-500" },
  { id: "llm-basics", name: "大模型基础", icon: BookOpen, color: "from-orange-500 to-red-500" },
  { id: "fine-tuning", name: "微调技术", icon: MessageSquare, color: "from-pink-500 to-rose-500" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            LLM Interview Master
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            大模型面试学习平台 - 智能问题生成 · 详细讲解 · 动画演示
          </p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
          >
            开始练习 <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/topic/${topic.id}`}
                className={`block p-6 rounded-2xl bg-gradient-to-br ${topic.color} hover:scale-105 transition-transform`}
              >
                <topic.icon className="w-12 h-12 text-white mb-4" />
                <h3 className="text-xl font-bold text-white">{topic.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-20 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">智能问题生成</h3>
            <p className="text-purple-200">AI 根据难度和主题生成面试问题</p>
          </div>
          <div className="text-center p-6">
            <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">详细讲解</h3>
            <p className="text-purple-200">逐步解答，深入理解每个概念</p>
          </div>
          <div className="text-center p-6">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">动画演示</h3>
            <p className="text-purple-200">可视化展示复杂概念</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
