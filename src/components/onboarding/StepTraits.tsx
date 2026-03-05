import { useI18n } from "../../hooks/useI18n";
import { personalityTraits } from "../../data/personalityTraits";

interface StepTraitsProps {
  selected: string[];
  onToggle: (traitId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepTraits({
  selected,
  onToggle,
  onNext,
  onBack,
}: StepTraitsProps) {
  const { t, locale } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t("onboarding.traits")}
      </h2>
      <p className="text-gray-500 mb-8">{t("onboarding.traitsHint")}</p>

      <div className="flex flex-wrap justify-center gap-3 max-w-lg mb-6">
        {personalityTraits.map((trait) => {
          const isSelected = selected.includes(trait.id);
          const isDisabled = !isSelected && selected.length >= 5;

          return (
            <button
              key={trait.id}
              onClick={() => !isDisabled && onToggle(trait.id)}
              disabled={isDisabled}
              className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition ${
                isSelected
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : isDisabled
                    ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              {trait.emoji}{" "}
              {locale === "zh" ? trait.zh : trait.en}
              {isSelected && " ✓"}
            </button>
          );
        })}
      </div>

      <p className="text-sm text-gray-400 mb-8">
        {t("onboarding.traitsCount", { count: selected.length })}
      </p>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-6 py-2.5 text-gray-500 hover:text-gray-700 transition"
        >
          {t("onboarding.back")}
        </button>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {t("onboarding.next")}
        </button>
      </div>
    </div>
  );
}
