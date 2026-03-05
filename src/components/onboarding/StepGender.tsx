import { useI18n } from "../../hooks/useI18n";
import type { Gender } from "../../types";

interface StepGenderProps {
  selected: Gender | null;
  onSelect: (gender: Gender) => void;
  onBack: () => void;
}

export default function StepGender({
  selected,
  onSelect,
  onBack,
}: StepGenderProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t("onboarding.gender")}
      </h2>
      <p className="text-gray-500 mb-10">{t("onboarding.genderHint")}</p>

      <div className="flex gap-6">
        <button
          onClick={() => onSelect("male")}
          className={`w-44 h-56 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 transition hover:scale-105 ${
            selected === "male"
              ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
              : "border-gray-200 bg-white hover:border-blue-300"
          }`}
        >
          <div className="text-6xl">👨</div>
          <span
            className={`text-lg font-medium ${
              selected === "male" ? "text-blue-700" : "text-gray-700"
            }`}
          >
            {t("onboarding.male")}
          </span>
        </button>

        <button
          onClick={() => onSelect("female")}
          className={`w-44 h-56 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 transition hover:scale-105 ${
            selected === "female"
              ? "border-pink-500 bg-pink-50 shadow-lg shadow-pink-100"
              : "border-gray-200 bg-white hover:border-pink-300"
          }`}
        >
          <div className="text-6xl">👩</div>
          <span
            className={`text-lg font-medium ${
              selected === "female" ? "text-pink-700" : "text-gray-700"
            }`}
          >
            {t("onboarding.female")}
          </span>
        </button>
      </div>

      <button
        onClick={onBack}
        className="mt-10 text-sm text-gray-400 hover:text-gray-600 transition"
      >
        {t("onboarding.back")}
      </button>
    </div>
  );
}
