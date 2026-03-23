import { NextResponse } from 'next/server';

/**
 * 多 LLM 提供商支持
 * 优先级：百炼 > 恩牛 > 火山引擎 > 硅基流动 > 通义千问
 */
const providers = [
  {
    name: 'dashscope',
    baseUrl: process.env.DASHSCOPE_BASE_URL || 'https://coding.dashscope.aliyuncs.com/v1',
    apiKey: process.env.DASHSCOPE_API_KEY,
    model: process.env.DASHSCOPE_MODEL || 'qwen3.5-plus',
  },
  {
    name: 'ennew',
    baseUrl: process.env.ENNEW_LLM_BASE_URL,
    apiKey: process.env.ENNEW_LLM_API_KEY,
    model: process.env.ENNEW_LLM_MODEL || 'Qwen3-235B-A22B-FP8',
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
    model: process.env.SILICONFLOW_LLM_MODEL,
  },
  {
    name: 'qwen',
    baseUrl: process.env.QWEN_LLM_BASE_URL,
    apiKey: process.env.QWEN_LLM_API_KEY,
    model: process.env.QWEN_LLM_MODEL || 'qwen3-max',
  },
];

export async function POST(request: Request) {
  try {
    const { topic, difficulty } = await request.json();

    // 选择可用的提供商（按优先级）
    const provider = providers.find(p => p.apiKey) || providers[0];
    
    if (!provider.apiKey) {
      return NextResponse.json(
        { error: '请配置 API Key，复制 .env.local.example 为 .env.local 并填入密钥' },
        { status: 500 }
      );
    }

    const systemPrompt = `你是一位专业的 AI/ML 面试专家，负责生成面试问题和详细答案。

请根据用户选择的主题和难度生成：
1. 一个面试问题（要有深度，能考察候选人的理解）
2. 详细的答案解析（包含关键概念、公式、示例）

难度级别：
- easy: 基础概念理解
- medium: 技术细节和原理
- hard: 深入分析和实际应用`;

    const userPrompt = `请生成一个关于"${topic}"的面试问题，难度：${difficulty}。

请以 JSON 格式返回：
{
  "question": "问题内容",
  "answer": "详细答案，包含关键点和解释",
  "difficulty": "${difficulty}",
  "topic": "${topic}"
}`;

    const response = await fetch(`${provider.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`${provider.name} API Error:`, error);
      throw new Error(`${provider.name} API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    let questionData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      questionData = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        question: content,
        answer: '请查看相关文档获取详细答案。',
        difficulty,
        topic
      };
    } catch {
      questionData = {
        question: content,
        answer: '请查看相关文档获取详细答案。',
        difficulty,
        topic
      };
    }

    return NextResponse.json({
      ...questionData,
      _provider: provider.name, // 用于调试
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: '生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}
