# PromptVault Supabase Backend

## 数据库 ER 图设计

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │    prompts      │     │   categories    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK, FK)     │────►│ id (PK)         │     │ id (PK)         │
│ username        │     │ user_id (FK)    │     │ name            │
│ display_name    │     │ category_id(FK) │────►│ slug            │
│ avatar_url      │     │ title           │     │ description     │
│ bio             │     │ content         │     │ parent_id (FK)  │
│ created_at      │     │ description     │     │ user_id (FK)    │
│ updated_at      │     │ is_public       │     │ created_at      │
└─────────────────┘     │ usage_count     │     │ updated_at      │
        │               │ created_at      │     └────────┬────────┘
        │               │ updated_at      │              │
        │               └────────┬────────┘              │
        │                        │                         │
        │                        │ 1:N                     │
        │                        ▼                         │
        │               ┌─────────────────┐                │
        │               │prompt_versions  │                │
        │               ├─────────────────┤                │
        │               │ id (PK)         │                │
        │               │ prompt_id (FK)  │◄────────┐       │
        │               │ version_number  │        │       │
        │               │ title           │         │       │
        │               │ content         │         │       │
        │               │ description     │         │       │
        │               │ created_at      │         │       │
        │               └─────────────────┘         │       │
        │                                             │       │
        │  M:N  ┌─────────────────┐                  │       │
        ├── ─ ─►│   prompt_tags   │◄─ ─ ─ ─ ─ ─ ─ ─ ─┘       │
        │       ├─────────────────┤                  │
        │       │ prompt_id (FK) │                  │
        │       │ tag_id (FK)    │◄─────────────────┘
        │       │ created_at     │
        │       └───────┬────────┘
        │               │
        │               │ N:1
        ▼               ▼
┌─────────────────┐
│      tags       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ slug            │
│ user_id (FK)    │
│ created_at      │
└─────────────────┘
```

## 表结构说明

### users
- 扩展 Supabase Auth 用户表的自定义用户资料
- 1:1 关联 `auth.users`

### prompts
- 存储提示词模板
- 关联 `users` (作者)
- 关联 `categories` (分类，可选)
- 支持版本历史

### categories
- 提示词分类
- 支持自引用的层级结构 (parent_id)
- 可选关联创建者

### tags
- 提示词标签
- 用户自定义标签

### prompt_tags
- prompts 和 tags 的多对多关联表

### prompt_versions
- 提示词版本历史
- 每次保存自动递增 version_number

## 快速开始

### 1. 初始化 Supabase 本地项目
```bash
cd supabase
supabase init
```

### 2. 启动本地 Supabase
```bash
supabase start
```

### 3. 运行数据库迁移
```bash
supabase db reset
```
或直接执行 SQL:
```bash
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f schema.sql
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f auth.sql
```

### 4. 配置环境变量
在 `.env` 文件中设置:
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## API 端点

### 认证
- `POST /auth/v1/signup` - 用户注册
- `POST /auth/v1/token?grant_type=password` - 登录
- `POST /auth/v1/logout` - 登出
- `GET /auth/v1/user` - 获取当前用户

### 提示词 (prompts)
- `GET /rest/v1/prompts` - 获取提示词列表
- `POST /rest/v1/prompts` - 创建提示词
- `GET /rest/v1/prompts?id=eq.{id}` - 获取单个提示词
- `PATCH /rest/v1/prompts?id=eq.{id}` - 更新提示词
- `DELETE /rest/v1/prompts?id=eq.{id}` - 删除提示词

### 分类 (categories)
- `GET /rest/v1/categories` - 获取分类列表
- `POST /rest/v1/categories` - 创建分类

### 标签 (tags)
- `GET /rest/v1/tags` - 获取标签列表
- `POST /rest/v1/tags` - 创建标签

## RLS 策略说明

| 表 | SELECT | INSERT | UPDATE | DELETE |
|----|--------|--------|--------|--------|
| users | 公开 | 仅本人 | 仅本人 | - |
| prompts | 公开(public)或本人 | 登录用户 | 仅本人 | 仅本人 |
| categories | 公开 | 登录用户 | 仅本人 | 仅本人 |
| tags | 公开 | 登录用户 | 仅本人 | 仅本人 |
| prompt_tags | 公开 | prompt作者 | prompt作者 | prompt作者 |
| prompt_versions | prompt作者 | prompt作者 | - | - |

## 触发器

1. `on_auth_user_created` - 新用户注册时自动创建 users 记录
2. `update_*_updated_at` - 自动更新各表的 updated_at 字段
