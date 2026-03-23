import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { topic, difficulty } = await request.json();

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

    const response = await fetch(`${process.env.DASHSCOPE_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.DASHSCOPE_MODEL || 'qwen3.5-plus',
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', error);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // 解析 AI 生成的内容
    const content = data.choices?.[0]?.message?.content || '';
    
    // 尝试提取 JSON
    let questionData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        questionData = JSON.parse(jsonMatch[0]);
      } else {
        questionData = {
          question: content,
          answer: '请查看相关文档获取详细答案。',
          difficulty,
          topic
        };
      }
    } catch {
      questionData = {
        question: content,
        answer: '请查看相关文档获取详细答案。',
        difficulty,
        topic
      };
    }

    return NextResponse.json(questionData);
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: '生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}
