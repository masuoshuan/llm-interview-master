"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AttentionMatrixProps {
  sequenceLength?: number;
}

export function AttentionAnimation(_props: AttentionMatrixProps) {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  
  const words = ["I", "love", "machine", "learning"];
  
  return (
    <div className="p-8 bg-white/5 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-6">Self-Attention 可视化</h3>
      
      {/* Input Sequence */}
      <div className="flex gap-2 mb-8 justify-center">
        {words.map((word, i) => (
          <motion.div
            key={i}
            className="px-4 py-2 bg-purple-600 rounded-lg text-white font-medium"
            whileHover={{ scale: 1.1 }}
            onMouseEnter={() => setActiveRow(i)}
            onMouseLeave={() => setActiveRow(null)}
          >
            {word}
          </motion.div>
        ))}
      </div>

      {/* Attention Matrix */}
      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
        {/* Header row */}
        <div className="w-12 h-12" />
        {words.map((word, i) => (
          <div key={`header-${i}`} className="w-12 h-12 flex items-center justify-center text-purple-300 text-sm">
            {word}
          </div>
        ))}
        
        {/* Matrix rows */}
        {words.map((_, rowIndex) => (
          <>
            <div key={`label-${rowIndex}`} className="w-12 h-12 flex items-center justify-center text-purple-300 text-sm">
              {words[rowIndex]}
            </div>
            {words.map((_, colIndex) => {
              const intensity = rowIndex === colIndex ? 1 : Math.random() * 0.5;
              return (
                <motion.div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="w-12 h-12 rounded border border-purple-500/30"
                  style={{
                    backgroundColor: `rgba(147, 51, 234, ${activeRow === rowIndex ? intensity : intensity * 0.3})`,
                  }}
                  animate={{
                    scale: activeRow === rowIndex ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: activeRow === rowIndex ? Infinity : 0,
                  }}
                />
              );
            })}
          </>
        ))}
      </div>

      {/* Explanation */}
      <div className="mt-8 p-4 bg-purple-900/30 rounded-xl">
        <p className="text-purple-200 text-sm">
          <strong className="text-white">说明：</strong>
          将鼠标悬停在上方单词上，查看该单词对其他单词的注意力权重。
          颜色越深表示注意力越强。Self-Attention 允许每个位置关注序列中的所有位置。
        </p>
      </div>
    </div>
  );
}

export function TransformerBlockAnimation() {
  const [activeStage, setActiveStage] = useState(0);
  
  const stages = [
    { name: "Input Embedding", color: "from-blue-500 to-purple-500" },
    { name: "Positional Encoding", color: "from-purple-500 to-pink-500" },
    { name: "Multi-Head Attention", color: "from-pink-500 to-red-500" },
    { name: "Add & Norm", color: "from-red-500 to-orange-500" },
    { name: "Feed Forward", color: "from-orange-500 to-yellow-500" },
    { name: "Add & Norm", color: "from-yellow-500 to-green-500" },
  ];

  return (
    <div className="p-8 bg-white/5 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-6">Transformer Encoder 流程</h3>
      
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.name}
            className={`h-16 rounded-xl bg-gradient-to-r ${stage.color} flex items-center px-6 cursor-pointer`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveStage(index)}
            animate={{
              boxShadow: activeStage === index 
                ? "0 0 30px rgba(147, 51, 234, 0.5)" 
                : "0 0 0 rgba(0,0,0,0)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <span className="text-white font-semibold text-lg">{stage.name}</span>
            </div>
            
            {activeStage === index && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-auto text-white/80 text-sm"
              >
                ← 点击查看详解
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Stage Details */}
      {activeStage !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 bg-white/10 rounded-xl"
        >
          <h4 className="text-lg font-bold text-white mb-2">
            {stages[activeStage].name}
          </h4>
          <p className="text-purple-200 text-sm">
            {activeStage === 0 && "将输入 token 转换为固定维度的向量表示"}
            {activeStage === 1 && "添加位置信息，使模型能够理解序列顺序"}
            {activeStage === 2 && "并行计算多个注意力头，捕捉不同的关系模式"}
            {activeStage === 3 && "残差连接 + 层归一化，稳定训练"}
            {activeStage === 4 && "两层全连接网络，增加非线性变换能力"}
            {activeStage === 5 && "再次残差连接 + 层归一化"}
          </p>
        </motion.div>
      )}
    </div>
  );
}
