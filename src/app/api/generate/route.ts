import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, difficulty, question } = body;

    // 获取环境变量
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const baseUrl = process.env.DASHSCOPE_BASE_URL || 'https://coding.dashscope.aliyuncs.com/v1';
    const model = process.env.DASHSCOPE_MODEL || 'qwen3.5-plus';

    // 检查 API Key
    if (!apiKey) {
      console.error('DASHSCOPE_API_KEY not configured');
      return NextResponse.json(
        { error: 'API Key 未配置' },
        { status: 500 }
      );
    }

    // 构建提示词
    const systemPrompt = `你是一位专业的 AI/ML 面试专家，负责帮助用户准备技术面试。

请根据用户的问题或主题，提供：
1. 清晰的解答
2. 关键概念说明
3. 实际例子（如适用）
4. 相关公式或代码（如适用）

保持回答专业、准确、易懂。`;

    const userPrompt = question 
      ? `请回答这个问题：${question}`
      : `请生成一个关于"${topic || '大模型'}"的面试问题，难度：${difficulty || 'medium'}，并提供详细答案。`;

    // 调用百炼 API
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return NextResponse.json(
        { 
          error: `API 请求失败：${response.status}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // 提取回答
    const answer = data.choices?.[0]?.message?.content || '抱歉，我无法生成回答。';

    return NextResponse.json({
      answer,
      topic: topic || 'general',
      difficulty: difficulty || 'medium',
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { 
        error: '生成失败，请稍后重试',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
