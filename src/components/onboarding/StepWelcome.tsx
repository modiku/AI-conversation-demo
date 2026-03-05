import { useI18n } from "../../hooks/useI18n";

export default function StepWelcome({ onNext }: { onNext: () => void }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in-up">
      <div className="text-6xl mb-6">✨</div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4 animate-fade-in-up">
        {t("onboarding.title")}
      </h1>
      <p className="text-gray-500 text-lg text-center mb-10 animate-fade-in-up [animation-delay:0.2s]">
        {t("onboarding.subtitle")}
      </p>
      <button
        onClick={onNext}
        className="px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition animate-fade-in-up [animation-delay:0.4s]"
      >
        {t("onboarding.start")}
      </button>
    </div>
  );
}
