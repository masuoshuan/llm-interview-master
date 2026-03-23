import { NextResponse } from 'next/server';
import { getCacheKey, getCached, setCached } from '@/lib/cache';
import { buildResumeContext } from '@/lib/rag';

/**
 * 多 LLM 提供商（优先级：百炼 > 恩牛 > 火山引擎 > 硅基流动 > 通义千问）
 * 使用快速、无 thinking 模式的模型以降低响应延迟
 */
const providers = [
  {
    name: 'dashscope',
    baseUrl: process.env.DASHSCOPE_BASE_URL || 'https://coding.dashscope.aliyuncs.com/v1',
    apiKey: process.env.DASHSCOPE_API_KEY,
    // glm-5 比 qwen3.5-plus 更快，无 thinking 开销
    model: process.env.DASHSCOPE_FAST_MODEL || 'glm-5',
  },
  {
    name: 'ennew',
    baseUrl: process.env.ENNEW_LLM_BASE_URL,
    apiKey: process.env.ENNEW_LLM_API_KEY,
    model: process.env.ENNEW_LLM_MODEL_NO_THINK || 'Qwen3-235B-A22B-FP8-No-Think',
  },
  {
    name: 'volcengine',
    baseUrl: process.env.VOLCENGINE_LLM_BASE_URL,
    apiKey: process.env.VOLCENGINE_LLM_API_KEY,
    model: process.env.VOLCENGINE_LLM_MODEL || 'deepseek-v3-2-251201',
  },
  {
    name: 'siliconflow',
    baseUrl: process.env.SILICONFLOW_LLM_BASE_URL,
    apiKey: process.env.SILICONFLOW_LLM_API_KEY,
    model: process.env.SILICONFLOW_LLM_MODEL || 'Qwen/Qwen2.5-7B-Instruct',
  },
  {
    name: 'qwen',
    baseUrl: process.env.QWEN_LLM_BASE_URL,
    apiKey: process.env.QWEN_LLM_API_KEY,
    model: process.env.QWEN_LLM_MODEL || 'qwen3-max',
  },
];

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const { topic, difficulty, question, history } = await request.json() as {
      topic: string;
      difficulty: string;
      question: string;
      history?: HistoryMessage[];
    };

    // 1. 命中缓存直接返回
    const cacheKey = getCacheKey(topic, question || topic);
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, _source: 'cache' });
    }

    // 2. 选择可用提供商
    const provider = providers.find(p => p.apiKey);
    if (!provider?.apiKey) {
      return NextResponse.json(
        { error: '请配置 API Key，复制 .env.local.example 为 .env.local 并填入密钥' },
        { status: 500 }
      );
    }

    // 3. 构建系统提示（注入简历 RAG 上下文）
    const resumeSection = buildResumeContext(question || topic);

    const systemPrompt = `你是一位专业的 AI/ML 面试专家，帮助候选人准备技术面试。${resumeSection}

回答要求：
- 结构清晰，使用 Markdown 格式（加粗、代码块、列表）
- 覆盖核心原理、公式（如有）、实际应用
- 最后附上 3 个相关推荐问题（JSON 字段 recommendedQuestions）
- 回答控制在 400 字以内，突出重点

难度级别：${difficulty === 'easy' ? '基础概念' : difficulty === 'hard' ? '深入原理与工程实践' : '技术细节与原理'}`;

    // 4. 构建对话历史（记忆机制）
    const recentHistory = (history || []).slice(-6); // 保留最近 6 轮
    const messages = [
      ...recentHistory.map(m => ({ role: m.role, content: m.content })),
      {
        role: 'user' as const,
        content: question
          ? `主题：${topic}\n\n问题：${question}`
          : `请给我一道关于「${topic}」的面试题（难度：${difficulty}），并给出详细答案。`,
      },
    ];

    // 5. 调用 LLM
    const response = await fetch(`${provider.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model,
        system: systemPrompt,
        messages,
        max_tokens: 1500,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`${provider.name} API Error:`, error);
      throw new Error(`${provider.name} API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || data.content?.[0]?.text || '';

    // 6. 解析响应（提取 JSON 中的 recommendedQuestions）
    let questionData: {
      question: string;
      answer: string;
      difficulty: string;
      topic: string;
      recommendedQuestions?: string[];
    };

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        questionData = JSON.parse(jsonMatch[0]);
      } else {
        // 尝试从文本中提取推荐问题
        const recMatch = content.match(/推荐问题[：:]\s*([\s\S]*?)(?:\n\n|$)/);
        const recommendations = recMatch
          ? recMatch[1].split('\n').filter(Boolean).map((s: string) => s.replace(/^[\d\.\-\*]+\s*/, '')).slice(0, 3)
          : [];

        questionData = {
          question: question || `关于「${topic}」的面试题`,
          answer: content,
          difficulty,
          topic,
          recommendedQuestions: recommendations,
        };
      }
    } catch {
      questionData = {
        question: question || `关于「${topic}」的面试题`,
        answer: content,
        difficulty,
        topic,
      };
    }

    // 7. 写入缓存（跳过带用户特定历史的对话）
    if (!history || history.length === 0) {
      setCached(cacheKey, questionData);
    }

    return NextResponse.json({ ...questionData, _provider: provider.name, _source: 'llm' });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: '生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}
