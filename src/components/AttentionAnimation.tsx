"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";

interface AttentionMatrixProps {
  sequenceLength?: number;
}

// 预定义的注意力权重矩阵（避免 Math.random 导致的水合不一致）
const ATTENTION_WEIGHTS = [
  [1.0, 0.3, 0.15, 0.1],
  [0.2, 1.0, 0.4, 0.25],
  [0.1, 0.35, 1.0, 0.45],
  [0.15, 0.2, 0.38, 1.0],
];

export function AttentionAnimation({ sequenceLength = 4 }: AttentionMatrixProps) {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const words = ["I", "love", "machine", "learning"];

  const attentionWeights = useMemo(() => ATTENTION_WEIGHTS, []);

  return (
    <div className="p-8 bg-white/5 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-2">Self-Attention 可视化</h3>
      <p className="text-purple-300 text-sm mb-6">悬停单词查看注意力权重分布</p>

      {/* Input Sequence */}
      <div className="flex gap-2 mb-8 justify-center">
        {words.map((word, i) => (
          <motion.div
            key={word}
            className={`px-4 py-2 rounded-lg text-white font-medium cursor-pointer transition-all ${
              activeRow === i ? 'bg-purple-400 shadow-lg shadow-purple-400/40' : 'bg-purple-600'
            }`}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
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
        {words.map((word) => (
          <div key={`header-${word}`} className="w-12 h-12 flex items-center justify-center text-purple-300 text-xs font-medium">
            {word}
          </div>
        ))}

        {/* Matrix rows */}
        {words.map((rowWord, rowIndex) => (
          <motion.div key={`row-${rowWord}`} className="contents">
            <div className="w-12 h-12 flex items-center justify-center text-purple-300 text-xs font-medium">
              {rowWord}
            </div>
            {words.map((_, colIndex) => {
              const weight = attentionWeights[rowIndex][colIndex];
              const isActive = activeRow === rowIndex;
              return (
                <motion.div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="w-12 h-12 rounded-lg border border-purple-500/30 flex items-center justify-center"
                  style={{
                    backgroundColor: `rgba(147, 51, 234, ${isActive ? weight : weight * 0.25})`,
                  }}
                  animate={{
                    scale: isActive ? [1, 1.06, 1] : 1,
                    borderColor: isActive ? 'rgba(167, 139, 250, 0.6)' : 'rgba(147, 51, 234, 0.3)',
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white text-xs font-bold"
                    >
                      {weight.toFixed(1)}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-600/25 border border-purple-500/30" />
          <span className="text-purple-400 text-xs">低注意力</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-400 border border-purple-300/50" />
          <span className="text-purple-400 text-xs">高注意力</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 p-4 bg-purple-900/30 rounded-xl">
        <p className="text-purple-200 text-sm">
          <strong className="text-white">说明：</strong>
          {activeRow !== null
            ? `「${words[activeRow]}」对各词的注意力权重，对角线最大（自注意力）。`
            : '悬停上方单词，查看该词对序列中其他词的注意力权重。颜色越深表示关注度越高。'}
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
