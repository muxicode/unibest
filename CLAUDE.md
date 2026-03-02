# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 **unibest** 项目 - 基于 Vue 3、TypeScript、Vite 5、UnoCSS、wot-design-uni 和 z-paging 构建的 uni-app 开发模板。这是一个跨平台框架，可以构建 H5（网页）、小程序（微信、支付宝等）和移动应用（iOS/Android）。

## 关键命令

### 开发

- `pnpm dev:h5` - 运行 H5/Web 开发服务器 (http://localhost:9000)
- `pnpm dev:mp-weixin` - 运行微信小程序（在微信开发者工具中导入 `dist/dev/mp-weixin`）
- `pnpm dev:app` - 运行移动应用（在 HBuilderX 中导入 `dist/dev/app`）

### 构建

- `pnpm build:h5` - 构建 H5/Web（输出：`dist/build/h5`）
- `pnpm build:mp-weixin` - 构建微信小程序（输出：`dist/build/mp-weixin`）
- `pnpm build:app` - 构建移动应用（输出：`dist/build/app`）

### 代码质量

- `pnpm type-check` - 运行 TypeScript 类型检查
- 代码在提交时通过 husky + lint-staged 自动格式化
- 已配置 ESLint、Prettier 和 Stylelint

## 架构

### 核心结构

- **多平台编译**：单一代码库通过 uni-app 编译到 H5、小程序和原生应用
- **请求拦截**：所有 API 请求通过 `src/interceptors/request.ts` 处理，自动注入 token 和错误处理
- **路由拦截**：`src/interceptors/route.ts` 中的导航守卫用于身份验证
- **状态管理**：使用带持久化插件的 Pinia stores（位于 `src/store/`）
- **自动导入**：Vue 组合式 API 和自定义 hooks 自动导入

### 关键目录

- `src/pages/` - 页面组件，带有 uni-pages 的 route-block 配置
- `src/layouts/` - 布局组件（默认、标签栏、页面布局）
- `src/service/` - API 服务模块
- `src/hooks/` - 可组合函数（自动导入）
- `src/utils/` - 工具函数，包括 http 客户端
- `env/` - 环境配置文件

### 平台特定处理

- 使用 `#ifdef` 指令进行条件编译（如 `#ifdef H5`、`#ifndef H5`）
- 通过 `src/utils/platform.ts` 进行平台检测
- H5 代理配置由 `VITE_APP_PROXY` 环境变量控制

### 组件库

- **wot-design-uni**：UI 组件，配置了 easycom 自动导入（`wd-*` 前缀）
- **z-paging**：分页组件，同样配置了 easycom

### 认证流程

1. Token 存储在带持久化的 Pinia user store 中
2. 请求拦截器自动在请求头中添加 token
3. 响应码 2 触发重定向到 `/pages/login/login`
4. 响应码 3 触发重定向到 `/pages/deal/deal` 进行注册

### API 配置

- 基础 URL 通过 env 文件中的 `VITE_SERVER_BASEURL` 配置
- H5 代理可通过 `VITE_APP_PROXY` 在开发环境启用
- 请求超时设置为 10 秒
- 查询参数可通过请求中的 `query` 选项传递

## 重要说明

- 使用 Vite 而非 HBuilderX 以获得更好的开发体验
- TypeScript 严格模式未启用，但类型检查可用
- 使用 UnoCSS 实现原子化 CSS（配置在 `uno.config.ts`）
- 通过 @uni-helper/vite-plugin-uni-pages 支持约定式路由
- 构建输出在 `dist/` 目录，按平台和环境分离
