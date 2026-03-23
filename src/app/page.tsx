"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, ArrowRight, MessageSquare, Zap, Brain } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LLM Interview Master</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/practice" className="text-gray-600 hover:text-gray-900 transition-colors">
                练习
              </Link>
              <Link href="/topics" className="text-gray-600 hover:text-gray-900 transition-colors">
                主题
              </Link>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-2 rounded-lg font-medium transition-all hover:shadow-lg">
                开始面试
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI 驱动的面试准备平台
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              像对话一样
              <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                准备技术面试
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              与 AI 进行自然对话，深入理解大模型核心概念，轻松应对技术面试
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/practice"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:scale-105"
              >
                免费开始练习
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold transition-all"
              >
                了解更多
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">为什么选择我们？</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              专为 AI/ML 工程师设计的面试准备工具
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={MessageSquare}
              title="对话式学习"
              description="像聊天一样自然交互，随时追问，深入理解每个概念"
              color="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={Zap}
              title="即时反馈"
              description="实时评估你的答案，指出改进方向，快速提升"
              color="from-yellow-500 to-orange-500"
            />
            <FeatureCard
              icon={BookOpen}
              title="系统知识"
              description="覆盖 Transformer、Attention、微调等核心主题"
              color="from-teal-500 to-blue-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-4">准备好开始了吗？</h2>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
              立即开始练习，提升你的 AI/ML 面试技能
            </p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-orange-600 px-10 py-5 rounded-full text-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
            >
              免费开始 <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 LLM Interview Master. Built with ❤️ using Next.js</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: {
  icon: any;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="bg-gray-50 rounded-2xl p-8 transition-all hover:shadow-lg"
    >
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-6`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
