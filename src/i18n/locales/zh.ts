const zh = {
  // App
  "app.title": "AI 伙伴",

  // Auth
  "auth.login": "登录",
  "auth.register": "注册",
  "auth.loginTitle": "登录你的账号",
  "auth.registerTitle": "创建新账号",
  "auth.email": "邮箱",
  "auth.emailPlaceholder": "your@email.com",
  "auth.password": "密码",
  "auth.passwordPlaceholder": "至少 6 位",
  "auth.submitting": "处理中...",
  "auth.noAccount": "还没有账号？",
  "auth.hasAccount": "已有账号？",
  "auth.goRegister": "去注册",
  "auth.goLogin": "去登录",
  "auth.error.emailInUse": "该邮箱已被注册",
  "auth.error.invalidEmail": "邮箱格式不正确",
  "auth.error.weakPassword": "密码至少需要 6 位",
  "auth.error.userNotFound": "用户不存在",
  "auth.error.wrongPassword": "密码错误",
  "auth.error.invalidCredential": "邮箱或密码错误",
  "auth.error.tooManyRequests": "登录尝试次数过多，请稍后再试",
  "auth.error.default": "操作失败，请重试",

  // Header
  "header.signOut": "退出登录",
  "header.backToList": "← 返回角色列表",

  // Dashboard
  "dashboard.title": "我的 AI 角色",
  "dashboard.newRole": "+ 新建角色",
  "dashboard.empty": "还没有创建任何角色",
  "dashboard.emptyHint": "点击上方「新建角色」按钮开始创建",

  // Role
  "role.edit": "编辑",
  "role.delete": "删除",
  "role.deleteConfirm": "确定要删除这个角色吗？所有对话记录也会被删除。",
  "role.noDescription": "暂无描述",
  "role.messages": "条消息",
  "role.lastChat": "最近对话",

  // Role Form
  "roleForm.createTitle": "新建角色",
  "roleForm.editTitle": "编辑角色",
  "roleForm.name": "角色名称",
  "roleForm.namePlaceholder": "如: 小樱",
  "roleForm.description": "角色描述",
  "roleForm.descriptionPlaceholder": "简短描述这个角色",
  "roleForm.systemPrompt": "System Prompt",
  "roleForm.systemPromptPlaceholder": "定义 AI 的角色、行为和回答风格...",
  "roleForm.systemPromptHint": "这段内容会作为 System Prompt 发送给 AI",
  "roleForm.avatar": "头像",
  "roleForm.gender": "性别",
  "roleForm.male": "男性",
  "roleForm.female": "女性",
  "roleForm.traits": "性格特质",
  "roleForm.avatarUpload": "上传头像",
  "roleForm.illustrationUpload": "上传立绘",
  "roleForm.fileTooLarge": "文件大小不能超过 5MB",
  "roleForm.uploadFailed": "上传失败，请重试",
  "roleForm.cancel": "取消",
  "roleForm.saving": "保存中...",
  "roleForm.save": "保存修改",
  "roleForm.create": "创建角色",

  // Chat
  "chat.placeholder": "输入消息... (Enter 发送, Shift+Enter 换行)",
  "chat.send": "发送",
  "chat.clear": "清空对话",
  "chat.clearConfirm": "确定要清空当前角色的所有对话记录吗？",
  "chat.startHint": "发送一条消息开始对话吧",
  "chat.sidebar.title": "角色列表",
  "chat.notFound": "角色不存在或已被删除",
  "chat.aiError": "抱歉，AI 响应失败，请稍后重试。",

  // Onboarding
  "onboarding.title": "创建你的第一个 AI 角色",
  "onboarding.subtitle": "打造一个符合你风格的 AI 伙伴",
  "onboarding.start": "开始创建",
  "onboarding.gender": "选择性别",
  "onboarding.genderHint": "你想创建的角色性别是？",
  "onboarding.male": "男性",
  "onboarding.female": "女性",
  "onboarding.traits": "选择性格特质",
  "onboarding.traitsHint": "为你的角色添加性格特点（最多 5 个）",
  "onboarding.traitsCount": "已选 {{count}}/5",
  "onboarding.next": "下一步",
  "onboarding.back": "上一步",
  "onboarding.selectCharacter": "选择你的角色",
  "onboarding.selectHint": "选择一个预设角色，或自定义创建",
  "onboarding.custom": "自定义创建",
  "onboarding.customHint": "按你的想法打造独一无二的角色",
} as const;

export type TranslationKey = keyof typeof zh;
export default zh;
