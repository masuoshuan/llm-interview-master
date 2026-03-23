"use client";

import { motion } from "framer-motion";
import { Brain, BookOpen, MessageSquare, Sparkles, ArrowRight, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

const topics = [
  { id: "transformer", name: "Transformer 架构", icon: Brain, color: "from-blue-500 to-purple-500", description: "深入理解注意力机制" },
  { id: "attention", name: "Attention 机制", icon: Sparkles, color: "from-green-500 to-teal-500", description: "Self-Attention 详解" },
  { id: "llm-basics", name: "大模型基础", icon: BookOpen, color: "from-orange-500 to-red-500", description: "核心概念与原理" },
  { id: "fine-tuning", name: "微调技术", icon: MessageSquare, color: "from-pink-500 to-rose-500", description: "LoRA/P-Tuning 等" },
];

const features = [
  {
    icon: Brain,
    title: "智能问题生成",
    description: "AI 根据难度和主题生成高质量面试问题",
    color: "text-purple-400",
  },
  {
    icon: BookOpen,
    title: "详细讲解",
    description: "逐步解答，深入理解每个核心概念",
    color: "text-blue-400",
  },
  {
    icon: Zap,
    title: "动画演示",
    description: "可视化展示复杂概念，学习更高效",
    color: "text-yellow-400",
  },
  {
    icon: Shield,
    title: "面试模拟",
    description: "真实面试场景，提升应变能力",
    color: "text-green-400",
  },
  {
    icon: Users,
    title: "进度追踪",
    description: "记录学习轨迹，针对性提升",
    color: "text-pink-400",
  },
  {
    icon: Sparkles,
    title: "即时反馈",
    description: "实时评估答案，指出改进方向",
    color: "text-cyan-400",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-purple-600/30 border border-purple-400/50 rounded-full text-purple-200 text-sm font-medium">
              🚀 AI 驱动的面试准备平台
            </span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            LLM Interview
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Master
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            大模型面试学习平台 - 智能问题生成 · 详细讲解 · 动画演示
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/practice"
              className="group inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            >
              开始练习 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="#features"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
            >
              了解更多
            </Link>
          </div>
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            学习主题
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/topic/${topic.id}`}
                  className={`block p-6 rounded-2xl bg-gradient-to-br ${topic.color} hover:shadow-2xl transition-all h-full`}
                >
                  <topic.icon className="w-14 h-14 text-white mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{topic.name}</h3>
                  <p className="text-white/80 text-sm">{topic.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          id="features"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            核心特性
          </h2>
          <p className="text-purple-200 text-center mb-12 max-w-2xl mx-auto">
            专为 AI/ML 工程师设计的面试准备工具
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 rounded-2xl"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-200 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="glass-card rounded-3xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            准备好开始了吗？
          </h2>
          <p className="text-purple-200 text-lg mb-8 max-w-2xl mx-auto">
            立即开始练习，提升你的 AI/ML 面试技能
          </p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-10 py-5 rounded-full text-xl font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          >
            免费开始 <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-purple-300 text-sm">
          <p>© 2026 LLM Interview Master. Built with Next.js + Framer Motion</p>
        </div>
      </footer>
    </main>
  );
}
