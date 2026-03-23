# LLM Interview Master 🧠

大模型面试学习平台 - 帮助你准备 AI/ML 技术面试

## ✨ 特性

- 🎯 **智能问题生成** - AI 根据主题和难度生成面试问题
- 📖 **详细讲解** - 逐步解答，深入理解每个概念
- 🎬 **动画演示** - 可视化展示 Transformer、Attention 等复杂概念
- 💬 **交互练习** - 模拟面试对话体验

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 生产环境
npm start
```

## 📚 主题覆盖

- Transformer 架构
- Attention 机制
- 大模型基础
- 微调技术

## 🛠️ 技术栈

- **框架**: Next.js 14 + TypeScript
- **动画**: Framer Motion
- **UI**: Tailwind CSS
- **部署**: Vercel

## 🌐 在线演示

[Coming Soon]

## 📝 License

MIT

## 🔑 AI 配置

使用百炼 AI 生成面试问题：

```bash
# 复制环境变量文件
cp .env.local.example .env.local

# 编辑 .env.local 填入你的 API Key
```

### 支持的模型

- **qwen3.5-plus** (推荐) - 支持图片理解
- **kimi-k2.5** - 支持图片理解
- **glm-5**
- **MiniMax-M2.5**

### API 配置

- Base URL: `https://coding.dashscope.aliyuncs.com/v1`
- 协议：兼容 Anthropic 格式
