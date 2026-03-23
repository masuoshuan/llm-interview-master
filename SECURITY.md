# 🔐 安全配置指南

## ⚠️ 重要：保护你的 API Key

**绝对不要**将 API Key 提交到 Git 仓库！

## 配置步骤

### 1. 复制环境变量模板
```bash
cp .env.local.example .env.local
```

### 2. 编辑 `.env.local`
填入你的 API Key（此文件已在 `.gitignore` 中）：

```bash
# 百炼 AI（推荐）
DASHSCOPE_API_KEY=sk-your-key-here
DASHSCOPE_BASE_URL=https://coding.dashscope.aliyuncs.com/v1
DASHSCOPE_MODEL=qwen3.5-plus

# 或其他提供商...
```

### 3. 验证配置
```bash
# 检查 .env.local 是否被 Git 跟踪
git check-ignore .env.local
# 应该输出：.env.local
```

## 支持的 LLM 提供商

| 提供商 | 优先级 | 推荐模型 |
|--------|--------|----------|
| 百炼 (DashScope) | 1 | qwen3.5-plus |
| 恩牛 (Ennew) | 2 | Qwen3-235B-A22B-FP8 |
| 火山引擎 (Volcengine) | 3 | deepseek-v3-2-251201 |
| 硅基流动 (SiliconFlow) | 4 | Pro/moonshotai/Kimi-K2 |
| 通义千问 (Qwen) | 5 | qwen3-max |

## 如果意外泄露了 API Key

1. **立即**到提供商控制台撤销/重置密钥
2. 检查 Git 历史是否有泄露：
   ```bash
   git log --all --oneline -- '*.env*'
   ```
3. 如果有泄露，使用 `git filter-branch` 或 BFG 清理历史

## 最佳实践

- ✅ 使用 `.env.local` 存储密钥（已加入 gitignore）
- ✅ 使用 `.env.local.example` 作为模板（不含真实密钥）
- ✅ 定期轮换 API Key
- ❌ 不要在代码中硬编码密钥
- ❌ 不要提交 `.env.local` 到 Git
- ❌ 不要在日志中打印完整密钥
