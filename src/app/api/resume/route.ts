import { NextResponse } from 'next/server';
import { saveResume, getResume, clearResume } from '@/lib/rag';

// GET：获取简历状态
export async function GET() {
  const store = getResume();
  if (!store) {
    return NextResponse.json({ uploaded: false });
  }
  return NextResponse.json({
    uploaded: true,
    fileName: store.fileName,
    uploadedAt: store.uploadedAt,
    chunkCount: store.chunks.length,
    preview: store.raw.slice(0, 200),
  });
}

// POST：上传简历文本
export async function POST(request: Request) {
  try {
    const { text, fileName } = await request.json() as { text: string; fileName?: string };

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: '简历内容太短，请确保至少 50 字' },
        { status: 400 }
      );
    }

    saveResume(text.trim(), fileName);

    const store = getResume()!;
    return NextResponse.json({
      success: true,
      chunkCount: store.chunks.length,
      message: `简历已成功导入，共分为 ${store.chunks.length} 个知识块`,
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json({ error: '上传失败，请重试' }, { status: 500 });
  }
}

// DELETE：清除简历
export async function DELETE() {
  clearResume();
  return NextResponse.json({ success: true, message: '简历已清除' });
}
