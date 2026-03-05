#!/bin/bash
# =============================================================
# Firebase 部署脚本
# 使用前请确保:
# 1. 已在 .env.local 中填写真实的 Firebase 配置
# 2. Firebase 项目已启用 Authentication (邮箱/密码) 和 Firestore
# 3. 项目已升级为 Blaze 计划 (Cloud Function 需要)
# =============================================================

set -e

echo "=== Step 1: Firebase 登录 ==="
firebase login

echo ""
echo "=== Step 2: 选择 Firebase 项目 ==="
firebase use --add

echo ""
echo "=== Step 3: 设置 DeepSeek API Key ==="
echo "请输入你的 DeepSeek API Key:"
firebase functions:secrets:set DEEPSEEK_API_KEY

echo ""
echo "=== Step 4: 编译 Cloud Functions ==="
cd functions && npm install && npm run build && cd ..

echo ""
echo "=== Step 5: 部署 Firestore 安全规则 ==="
firebase deploy --only firestore:rules

echo ""
echo "=== Step 6: 部署 Cloud Functions ==="
firebase deploy --only functions

echo ""
echo "=== 部署完成! ==="
echo "现在可以运行 'npm run dev' 启动前端开发服务器"
