/**
 * 高频问题缓存模块
 * 使用内存 Map 缓存 LLM 回答，相同 key 直接命中，跳过 API 调用
 */

export interface CachedAnswer {
  question: string;
  answer: string;
  difficulty: string;
  topic: string;
  recommendedQuestions?: string[];
  cachedAt: number;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 小时

// 服务端单例缓存（Next.js hot reload 下通过 global 保持）
declare global {
  // eslint-disable-next-line no-var
  var __questionCache: Map<string, CachedAnswer> | undefined;
}

function getCache(): Map<string, CachedAnswer> {
  if (!global.__questionCache) {
    global.__questionCache = new Map();
    // 预填充高频经典问题
    seedHighFrequencyQuestions(global.__questionCache);
  }
  return global.__questionCache;
}

export function getCacheKey(topic: string, question: string): string {
  return `${topic}::${question.trim().toLowerCase().slice(0, 100)}`;
}

export function getCached(key: string): CachedAnswer | null {
  const cache = getCache();
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry;
}

export function setCached(key: string, value: Omit<CachedAnswer, 'cachedAt'>): void {
  getCache().set(key, { ...value, cachedAt: Date.now() });
}

export function getCacheStats() {
  const cache = getCache();
  return { size: cache.size, keys: Array.from(cache.keys()) };
}

// 预置高频经典问题答案，首次访问直接命中
function seedHighFrequencyQuestions(cache: Map<string, CachedAnswer>) {
  const seeds: Array<Omit<CachedAnswer, 'cachedAt'> & { key: string }> = [
    {
      key: 'transformer::请解释 transformer 的 self-attention 机制',
      topic: 'transformer',
      difficulty: 'medium',
      question: '请解释 Transformer 的 Self-Attention 机制',
      answer: `Self-Attention（自注意力）是 Transformer 的核心机制，允许序列中每个位置关注所有其他位置。

**核心公式：**
\`Attention(Q, K, V) = softmax(QKᵀ / √dₖ) · V\`

**三个矩阵的含义：**
- **Q（Query）**：当前词"想查询"的信息
- **K（Key）**：序列中每个词"能提供"的索引
- **V（Value）**：实际携带的内容信息

**计算步骤：**
1. 输入 X 分别乘以 Wq、Wk、Wv 得到 Q、K、V
2. Q·Kᵀ 计算相似度得分矩阵（点积注意力）
3. 除以 √dₖ 缩放（防止梯度消失）
4. Softmax 归一化为概率分布
5. 加权求和 V 得到输出

**优势：**
- 并行计算（vs RNN 的串行）
- 全局依赖捕获（vs CNN 的局部感受野）
- 长距离依赖建模能力强`,
      recommendedQuestions: [
        'Multi-Head Attention 为什么要多头？各头学到什么？',
        'Scaled Dot-Product 为什么要除以 √dₖ？',
        'Self-Attention 的时间复杂度是多少？如何优化？',
      ],
    },
    {
      key: 'transformer::bert 和 gpt 有什么区别？',
      topic: 'transformer',
      difficulty: 'medium',
      question: 'BERT 和 GPT 有什么区别？',
      answer: `BERT 和 GPT 都基于 Transformer，但方向和训练目标完全不同。

**架构差异：**
| 维度 | BERT | GPT |
|------|------|-----|
| 编码方向 | 双向（Encoder） | 单向左→右（Decoder） |
| 预训练任务 | MLM + NSP | 自回归语言模型 |
| 适合任务 | 理解类（分类、NER、QA） | 生成类（文本续写、对话） |
| 注意力 | 全序列互注意力 | 因果掩码注意力 |

**BERT 的核心：**
- Masked Language Model：随机遮盖 15% token 并预测
- Next Sentence Prediction：判断两句是否相邻

**GPT 的核心：**
- 自回归：用前 n 个 token 预测第 n+1 个
- Causal Mask 确保不看到未来信息

**记忆口诀：** BERT 双向看全文，GPT 单向往后写。`,
      recommendedQuestions: [
        'GPT 系列从 GPT-1 到 GPT-4 有哪些核心进化？',
        'BERT 的 Masked LM 为什么遮盖 15%？',
        '什么是 Instruction Tuning？和 RLHF 有什么关系？',
      ],
    },
    {
      key: 'fine-tuning::什么是 lora 微调？',
      topic: 'fine-tuning',
      difficulty: 'medium',
      question: '什么是 LoRA 微调？',
      answer: `LoRA（Low-Rank Adaptation）是一种参数高效微调方法（PEFT），通过在预训练权重旁边注入低秩矩阵来适配下游任务。

**核心思想：**
预训练权重 W 冻结，旁路引入低秩分解：
\`ΔW = B · A\`，其中 A ∈ ℝ^(d×r)，B ∈ ℝ^(r×k)，r ≪ min(d,k)

**训练时：**
\`h = Wx + BAx\`（只有 A、B 更新）

**优势：**
- 参数量极少（r=8 时仅需全量参数的 0.1%-1%）
- 显存节省 3x 以上
- 切换任务只需换 A/B 矩阵，不动基础模型
- 推理无额外延迟（可合并：W' = W + BA）

**关键超参数：**
- rank r：越大表达能力越强，通常 4~64
- alpha：缩放系数，通常等于 r
- target_modules：通常对 Q、V 矩阵应用 LoRA`,
      recommendedQuestions: [
        'LoRA 和 QLoRA 有什么区别？如何进一步节省显存？',
        'P-Tuning v2 和 LoRA 各有什么优缺点？',
        '微调时如何选择学习率和 rank？',
      ],
    },
    {
      key: 'llm-basics::什么是 rlhf？',
      topic: 'llm-basics',
      difficulty: 'medium',
      question: '什么是 RLHF？',
      answer: `RLHF（Reinforcement Learning from Human Feedback，人类反馈强化学习）是让大模型与人类价值观对齐的核心技术，ChatGPT/Claude 都使用了这一方法。

**三阶段流程：**

**阶段 1 - 监督微调（SFT）：**
- 用高质量人工标注数据对基础模型进行指令微调
- 让模型学会"如何回答"的基本格式

**阶段 2 - 奖励模型训练（RM）：**
- 对同一个问题收集多个模型回答
- 人工标注排序（A > B > C）
- 训练奖励模型预测人类偏好分数

**阶段 3 - PPO 强化学习：**
- 用奖励模型作为环境，给模型输出打分
- 用 PPO 算法优化策略
- KL 散度约束防止模型退化

**RLHF 的问题：**
- 人工标注成本高
- 奖励模型可能被"欺骗"（reward hacking）
- PPO 训练不稳定

**替代方案：** DPO（Direct Preference Optimization）直接从偏好数据优化，无需奖励模型。`,
      recommendedQuestions: [
        'DPO 和 RLHF 有什么本质区别？DPO 为什么更简单？',
        'PPO 算法的核心思想是什么？为什么用 KL 散度约束？',
        '奖励黑客（Reward Hacking）是什么？如何缓解？',
      ],
    },
  ];

  for (const seed of seeds) {
    const { key, ...value } = seed;
    cache.set(key, { ...value, cachedAt: Date.now() });
  }
}
