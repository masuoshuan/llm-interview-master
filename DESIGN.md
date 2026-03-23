# 🎨 LLM Interview Master - 设计系统

基于 **UI/UX Pro Max** 标准构建

## 1. 设计风格

**主风格：** Modern Dark + Glassmorphism
- 深色渐变背景
- 毛玻璃效果卡片
- 霓虹紫色调
- 流畅动画

## 2. 色彩系统

### 主色调
```css
--primary: #9333ea      /* Purple 600 */
--primary-hover: #7e22ce /* Purple 700 */
--primary-light: #a855f7 /* Purple 500 */
```

### 背景色
```css
--bg-dark: #0f172a      /* Slate 900 */
--bg-purple: #581c87    /* Purple 900 */
--bg-card: rgba(255, 255, 255, 0.1)
```

### 语义色
```css
--success: #22c55e      /* Green 500 */
--warning: #eab308      /* Yellow 500 */
--error: #ef4444        /* Red 500 */
--info: #3b82f6         /* Blue 500 */
```

### 渐变色
```css
--gradient-hero: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)
--gradient-card-1: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)
--gradient-card-2: linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)
--gradient-card-3: linear-gradient(135deg, #f97316 0%, #ef4444 100%)
--gradient-card-4: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)
```

## 3. 字体系统

### 字体栈
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
--font-mono: 'Fira Code', 'Courier New', monospace
```

### 字号层级
```css
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */
--text-5xl: 3rem      /* 48px */
```

### 行高
```css
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.75
```

## 4. 间距系统

**基准：** 4px (0.25rem)

```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
```

## 5. 圆角系统

```css
--radius-sm: 0.375rem   /* 6px */
--radius-md: 0.5rem     /* 8px */
--radius-lg: 0.75rem    /* 12px */
--radius-xl: 1rem       /* 16px */
--radius-2xl: 1.5rem    /* 24px */
--radius-full: 9999px   /* Circle */
```

## 6. 阴影系统

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-glow: 0 0 30px rgba(147, 51, 234, 0.5)
```

## 7. 动画系统

### 时长
```css
--duration-fast: 150ms
--duration-normal: 300ms
--duration-slow: 500ms
```

### 缓动函数
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### 动画效果
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

## 8. 响应式断点

```css
--sm: 640px   /* Mobile landscape */
--md: 768px   /* Tablet */
--lg: 1024px  /* Desktop */
--xl: 1280px  /* Large desktop */
--2xl: 1536px /* Extra large */
```

## 9. 组件设计规范

### 按钮
- 最小高度：44px（可访问性）
- 圆角：8px (md)
- 内边距：12px 24px
- 字体：16px, 600 weight
- 悬停效果：scale(1.05) + 亮度提升

### 卡片
- 圆角：16px (xl)
- 内边距：24px
- 背景：rgba(255, 255, 255, 0.1)
- 边框：1px solid rgba(255, 255, 255, 0.2)
- 毛玻璃：backdrop-filter: blur(10px)

### 输入框
- 高度：48px
- 圆角：8px
- 边框：1px solid rgba(147, 51, 234, 0.3)
- 焦点：2px solid rgba(147, 51, 234, 0.5)

## 10. 可访问性标准

- ✅ 色彩对比度 ≥ 4.5:1 (WCAG AA)
- ✅ 最小点击区域 44×44px
- ✅ 键盘导航支持
- ✅ 焦点可见
- ✅ 图片 Alt 文本
- ✅ 减少动画选项

## 11. 设计原则

1. **清晰优先** - 信息层次分明
2. **一致性** - 全平台统一体验
3. **流畅动画** - 150-300ms，有意义
4. **深色友好** - 护眼模式优先
5. **移动优先** - 响应式设计
6. **性能导向** - 优化加载速度

---

*最后更新：2026-03-23*
*基于 UI/UX Pro Max 标准*
