import { useI18n } from "../../hooks/useI18n";
import { presetCharacters } from "../../data/presetCharacters";
import { personalityTraits } from "../../data/personalityTraits";
import type { Gender, PresetCharacter } from "../../types";

interface StepCharacterSelectProps {
  gender: Gender;
  onSelectPreset: (preset: PresetCharacter) => void;
  onCustom: () => void;
  onBack: () => void;
}

export default function StepCharacterSelect({
  gender,
  onSelectPreset,
  onCustom,
  onBack,
}: StepCharacterSelectProps) {
  const { t, locale } = useI18n();

  const filtered = presetCharacters.filter((p) => p.gender === gender);

  const getTraitLabel = (tid: string) => {
    const trait = personalityTraits.find((p) => p.id === tid);
    return trait
      ? `${trait.emoji} ${locale === "zh" ? trait.zh : trait.en}`
      : tid;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t("onboarding.selectCharacter")}
      </h2>
      <p className="text-gray-500 mb-10">{t("onboarding.selectHint")}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl w-full mb-8">
        {filtered.map((preset) => {
          const avatarPath = `/presets/${preset.presetId}/avatar.png`;

          return (
            <button
              key={preset.presetId}
              onClick={() => onSelectPreset(preset)}
              className="bg-white rounded-2xl border-2 border-gray-200 p-5 text-left hover:border-blue-400 hover:shadow-lg transition group"
            >
              {/* Avatar area */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={avatarPath}
                    alt={preset.nameEn}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (
                        e.target as HTMLImageElement
                      ).parentElement!.textContent = preset.avatar;
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">
                    {locale === "zh" ? preset.nameZh : preset.nameEn}
                  </h3>
                </div>
              </div>

              {/* Traits */}
              <div className="flex flex-wrap gap-1 mb-3">
                {preset.personalityTraits.map((tid) => (
                  <span
                    key={tid}
                    className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full"
                  >
                    {getTraitLabel(tid)}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500">
                {locale === "zh"
                  ? preset.descriptionZh
                  : preset.descriptionEn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Custom create option */}
      <button
        onClick={onCustom}
        className="px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition"
      >
        ✏️ {t("onboarding.custom")}
        <span className="block text-xs text-gray-400 mt-0.5">
          {t("onboarding.customHint")}
        </span>
      </button>

      <button
        onClick={onBack}
        className="mt-8 text-sm text-gray-400 hover:text-gray-600 transition"
      >
        {t("onboarding.back")}
      </button>
    </div>
  );
}
