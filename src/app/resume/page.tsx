"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, Trash2, CheckCircle, ArrowLeft, AlertCircle, BookOpen } from "lucide-react";
import Link from "next/link";

interface ResumeStatus {
  uploaded: boolean;
  fileName?: string;
  uploadedAt?: number;
  chunkCount?: number;
  preview?: string;
}

export default function ResumePage() {
  const [status, setStatus] = useState<ResumeStatus>({ uploaded: false });
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'paste' | 'tips'>('paste');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/resume');
      const data = await res.json();
      setStatus(data);
      if (data.uploaded) {
        localStorage.setItem('resume_uploaded', '1');
      }
    } catch {
      // ignore
    }
  };

  const handleUpload = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '上传失败');
      setMessage({ type: 'success', text: data.message });
      localStorage.setItem('resume_uploaded', '1');
      await fetchStatus();
      setText('');
    } catch (e: unknown) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : '上传失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch('/api/resume', { method: 'DELETE' });
      setStatus({ uploaded: false });
      localStorage.removeItem('resume_uploaded');
      setMessage({ type: 'success', text: '简历已清除' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileRead = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setText(ev.target?.result as string || '');
    };
    reader.readAsText(file, 'utf-8');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回练习
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">简历 RAG 知识库</h1>
          <p className="text-purple-200">
            上传你的简历，AI 面试助手将结合你的经历回答个性化问题
          </p>
        </motion.div>

        {/* Status Card */}
        <AnimatePresence>
          {status.uploaded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 bg-green-500/20 border border-green-500/40 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">简历已导入</p>
                    <p className="text-green-300 text-sm">
                      {status.fileName && `文件：${status.fileName} · `}
                      共 {status.chunkCount} 个知识块 ·
                      上传于 {status.uploadedAt ? new Date(status.uploadedAt).toLocaleString('zh-CN') : ''}
                    </p>
                    {status.preview && (
                      <p className="text-green-200/70 text-xs mt-2 line-clamp-2">{status.preview}...</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-green-400 hover:text-red-400 transition-colors flex items-center gap-1 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  清除
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-4 p-4 rounded-xl flex items-center gap-2 text-sm ${
                message.type === 'success'
                  ? 'bg-green-500/20 border border-green-500/40 text-green-300'
                  : 'bg-red-500/20 border border-red-500/40 text-red-300'
              }`}
            >
              {message.type === 'success'
                ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                : <AlertCircle className="w-4 h-4 flex-shrink-0" />
              }
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'paste', label: '粘贴/上传简历', icon: FileText },
            { id: 'tips', label: '使用指南', icon: BookOpen },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'paste' | 'tips')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-purple-300 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'paste' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* File Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-purple-500/40 hover:border-purple-400 rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-white/5"
            >
              <Upload className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <p className="text-white font-medium">点击上传 .txt 格式简历</p>
              <p className="text-purple-300 text-sm mt-1">或直接在下方粘贴文本</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md"
              className="hidden"
              onChange={handleFileRead}
            />

            {/* Text Area */}
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={`粘贴简历内容，例如：

姓名：张三
工作经历：
- 2022-2024 某科技公司 AI 工程师
  负责大模型微调、RAG 系统搭建...

技能：Python、PyTorch、LangChain...`}
              className="w-full h-64 bg-white/10 border border-purple-500/30 rounded-2xl p-4 text-white placeholder-purple-300/50 resize-none outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all text-sm"
            />

            <div className="flex items-center justify-between">
              <span className="text-purple-300 text-sm">{text.length} 字</span>
              <button
                onClick={handleUpload}
                disabled={loading || text.trim().length < 50}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all"
              >
                {loading ? '上传中...' : (
                  <>
                    <Upload className="w-4 h-4" />
                    导入简历
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {[
              {
                title: '什么是简历 RAG？',
                content: '将你的简历导入知识库后，AI 会自动检索相关段落注入到对话上下文中，让回答更贴合你的实际经历。',
              },
              {
                title: '哪些问题会触发简历检索？',
                content: '涉及"你的项目经历"、"为什么选择这份工作"、"你做过哪些优化"等个性化问题时，系统会优先从简历中检索相关内容作为背景。',
              },
              {
                title: '简历格式建议',
                content: '建议使用纯文本格式，按「基本信息 → 工作经历 → 项目经历 → 技能」分段，每段之间留空行，方便系统分块检索。',
              },
              {
                title: '隐私说明',
                content: '简历内容存储在服务器内存中，服务重启后会清空。不会持久化到数据库，也不会用于模型训练。',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-purple-500/20 rounded-2xl p-5"
              >
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-purple-200 text-sm leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
