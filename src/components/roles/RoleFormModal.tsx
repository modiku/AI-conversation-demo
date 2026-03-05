import { useState, useEffect, type FormEvent } from "react";
import type { Role } from "../../types";

const PRESET_TEMPLATES = [
  {
    name: "英语老师",
    avatar: "👩‍🏫",
    description: "帮助你练习英语口语和语法",
    systemPrompt:
      "你是一位耐心的英语老师。用户可能使用中文或英文与你交流。如果用户使用中文提问，请用英文回答并附上中文翻译。纠正用户的语法错误，并给出改进建议。",
  },
  {
    name: "代码助手",
    avatar: "💻",
    description: "帮你写代码、调 bug、讲解技术原理",
    systemPrompt:
      "你是一位经验丰富的全栈开发工程师。请用简洁清晰的方式回答编程问题，给出代码示例时使用合适的语言。如果用户的问题不够明确，请先追问具体需求。",
  },
  {
    name: "翻译官",
    avatar: "🌐",
    description: "中英互译，保持原文风格和语气",
    systemPrompt:
      "你是一位专业翻译。当用户输入中文时，翻译为英文；当用户输入英文时，翻译为中文。保持原文的语气和风格，必要时提供多种翻译选项。",
  },
];

interface RoleFormModalProps {
  isOpen: boolean;
  editingRole: Role | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    systemPrompt: string;
    avatar: string;
  }) => Promise<void>;
}

export default function RoleFormModal({
  isOpen,
  editingRole,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [avatar, setAvatar] = useState("🤖");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingRole) {
      setName(editingRole.name);
      setDescription(editingRole.description);
      setSystemPrompt(editingRole.systemPrompt);
      setAvatar(editingRole.avatar || "🤖");
    } else {
      setName("");
      setDescription("");
      setSystemPrompt("");
      setAvatar("🤖");
    }
  }, [editingRole, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, description, systemPrompt, avatar });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (template: (typeof PRESET_TEMPLATES)[number]) => {
    setName(template.name);
    setDescription(template.description);
    setSystemPrompt(template.systemPrompt);
    setAvatar(template.avatar);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingRole ? "编辑角色" : "新建角色"}
          </h2>

          {!editingRole && (
            <div className="mb-5">
              <p className="text-sm text-gray-500 mb-2">快速使用模板:</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_TEMPLATES.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => applyTemplate(t)}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full transition"
                  >
                    {t.avatar} {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  头像
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-16 h-10 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  角色名称 *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="如: 英语老师"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                角色描述
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="简短描述这个角色的功能"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System Prompt *
              </label>
              <textarea
                required
                rows={5}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                placeholder="定义 AI 的角色、行为和回答风格..."
              />
              <p className="text-xs text-gray-400 mt-1">
                这段内容会作为 System Prompt 发送给 AI，用于定义它的角色和行为
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "保存中..." : editingRole ? "保存修改" : "创建角色"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
