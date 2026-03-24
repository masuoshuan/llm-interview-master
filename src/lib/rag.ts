/**
 * 简历 RAG 模块
 * 简单关键词匹配检索，将相关简历片段注入到 LLM 上下文
 */

export interface ResumeStore {
  raw: string;         // 原始简历文本
  chunks: string[];    // 按段落分块
  uploadedAt: number;
  fileName?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __resumeStore: ResumeStore | undefined;
}

export function saveResume(text: string, fileName?: string): void {
  const chunks = text
    .split(/\n{2,}/)
    .map(c => c.trim())
    .filter(c => c.length > 20);

  global.__resumeStore = {
    raw: text,
    chunks,
    uploadedAt: Date.now(),
    fileName,
  };
}

export function getResume(): ResumeStore | null {
  return global.__resumeStore || null;
}

export function clearResume(): void {
  global.__resumeStore = undefined;
}

/**
 * 根据问题检索最相关的简历段落（关键词匹配）
 */
export function retrieveRelevantChunks(question: string, topK = 3): string[] {
  const store = global.__resumeStore;
  if (!store || store.chunks.length === 0) return [];

  const keywords = question.toLowerCase()
    .replace(/[？?！!。，,]/g, ' ')
    .split(/\s+/)
    .filter(k => k.length > 1);

  const scored = store.chunks.map(chunk => {
    const lower = chunk.toLowerCase();
    const score = keywords.reduce((s, k) => s + (lower.includes(k) ? 1 : 0), 0);
    return { chunk, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.chunk);
}

/**
 * 构建注入到 system prompt 的简历上下文
 */
export function buildResumeContext(question: string): string {
  const store = global.__resumeStore;
  if (!store) return '';

  const relevant = retrieveRelevantChunks(question);
  if (relevant.length === 0) {
    // 问题与简历无关，注入简历摘要（前 500 字）
    return `\n\n【候选人简历摘要】\n${store.raw.slice(0, 500)}`;
  }

  return `\n\n【简历相关段落】\n${relevant.join('\n\n')}`;
}
