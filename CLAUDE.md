# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint

# Database (Prisma 7 with Neon PostgreSQL)
npx prisma db push           # Sync schema to database
npx prisma generate          # Generate Prisma Client
npx prisma studio            # Open database GUI
npx prisma migrate dev       # Create migration (development)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router, React 19)
- **Database**: PostgreSQL on Neon, Prisma 7 ORM
- **Auth**: NextAuth v5 (beta)
- **State**: Zustand (cart), React Query (server state)
- **UI**: Tailwind CSS 4, shadcn/ui (Radix primitives)
- **Validation**: Zod 4, React Hook Form

### Project Structure
```
src/
├── app/              # Next.js App Router pages
├── components/ui/    # shadcn/ui components
├── lib/
│   ├── prisma.ts     # Prisma client singleton
│   └── utils.ts      # cn() helper for Tailwind
└── store/
    └── cart.ts       # Zustand cart store (persisted)

prisma/
├── schema.prisma     # Database models
prisma.config.ts      # Prisma 7 datasource config (URL from env)
```

### Database Models
- **Auth**: User (with role enum), Account, Session, VerificationToken
- **Commerce**: Category (hierarchical), Product, Address
- **Orders**: Order (with status/payment enums), OrderItem

### Key Patterns
- **Prisma 7**: Datasource URL configured in `prisma.config.ts`, not in schema
- **Path alias**: `@/*` maps to `./src/*`
- **Cart**: Client-side Zustand store with localStorage persistence
- **User roles**: `USER` | `ADMIN` enum for authorization

## Module Roadmap

### Phase 1: 后台管理 (Admin) ← 当前阶段
| 模块 | 路由 | 功能 |
|------|------|------|
| 认证 | `/admin/login` | 管理员登录 |
| 仪表盘 | `/admin` | 数据概览 |
| 分类管理 | `/admin/categories` | 层级分类 CRUD、排序 |
| 商品管理 | `/admin/products` | 商品 CRUD、库存、上下架 |
| 订单管理 | `/admin/orders` | 订单列表、状态变更、详情 |
| 用户管理 | `/admin/users` | 用户列表、角色管理 |

### Phase 2: 前台商城 (Shop)
| 模块 | 路由 | 功能 |
|------|------|------|
| 首页 | `/` | 推荐商品、分类导航 |
| 商品 | `/products`, `/products/[slug]` | 列表、详情 |
| 购物车 | `/cart` | 购物车页面（Zustand store 已就绪） |
| 结算 | `/checkout` | 地址选择、下单 |
| 用户中心 | `/account/*` | 登录注册、地址管理、订单历史 |

### Phase 3: 扩展功能 (暂缓)
- 支付集成（微信/支付宝/Stripe）
- 图片云存储（Cloudinary/S3）
- 商品搜索
