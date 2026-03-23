"use client";

import { motion } from "framer-motion";
import { AttentionAnimation, TransformerBlockAnimation } from "@/components/AttentionAnimation";
import { Brain, Layers, Zap } from "lucide-react";

export default function TransformerTopicPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">Transformer 架构</h1>
          <p className="text-xl text-purple-200">
            革命性的序列建模架构，彻底改变了 NLP 领域
          </p>
        </motion.div>

        {/* Key Concepts */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30"
          >
            <Brain className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Self-Attention</h3>
            <p className="text-purple-200">
              核心机制，允许每个位置关注序列中的所有位置
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
          >
            <Layers className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Multi-Head</h3>
            <p className="text-purple-200">
              多个注意力头并行，学习不同的表示子空间
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-pink-600/20 to-red-600/20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30"
          >
            <Zap className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Position Encoding</h3>
            <p className="text-purple-200">
              正弦位置编码，注入序列顺序信息
            </p>
          </motion.div>
        </div>

        {/* Animations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AttentionAnimation />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TransformerBlockAnimation />
          </motion.div>
        </div>

        {/* Detailed Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">核心公式</h2>
          
          <div className="space-y-6">
            <div className="bg-black/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-purple-300 mb-3">Attention 公式</h3>
              <code className="text-white text-lg block">
                Attention(Q, K, V) = softmax(QK^T / √dₖ) V
              </code>
            </div>

            <div className="bg-black/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-purple-300 mb-3">Multi-Head Attention</h3>
              <code className="text-white text-sm block space-y-2">
                <div>MultiHead(Q, K, V) = Concat(head₁, ..., headₕ)Wᴼ</div>
                <div>where headᵢ = Attention(QWᵢᵠ, KWᵢᴷ, VWᵢⱽ)</div>
              </code>
            </div>

            <div className="bg-black/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-purple-300 mb-3">Positional Encoding</h3>
              <code className="text-white text-sm block space-y-2">
                <div>PE(pos,2i) = sin(pos/10000^(2i/d_model))</div>
                <div>PE(pos,2i+1) = cos(pos/10000^(2i/d_model))</div>
              </code>
            </div>
          </div>
        </motion.div>

        {/* Practice Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <a
            href="/practice"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
          >
            开始练习 Transformer 面试题
          </a>
        </motion.div>
      </div>
    </main>
  );
}
