import { useState, useCallback } from "react";
import { useI18n } from "../../hooks/useI18n";
import { useRoles } from "../../hooks/useRoles";
import type { Gender, PresetCharacter } from "../../types";
import StepWelcome from "./StepWelcome";
import StepGender from "./StepGender";
import StepCharacterSelect from "./StepCharacterSelect";
import StepTraits from "./StepTraits";

type Step = "welcome" | "gender" | "select" | "traits";

interface GuidedOnboardingProps {
  skipWelcome?: boolean;
  onCustomCreate?: (gender: Gender, traits: string[]) => void;
}

export default function GuidedOnboarding({
  skipWelcome = false,
  onCustomCreate,
}: GuidedOnboardingProps) {
  const { locale } = useI18n();
  const { createRole } = useRoles();

  const [step, setStep] = useState<Step>(skipWelcome ? "gender" : "welcome");
  const [gender, setGender] = useState<Gender | null>(null);
  const [traits, setTraits] = useState<string[]>([]);

  const handleGenderSelect = (g: Gender) => {
    setGender(g);
    setTimeout(() => setStep("select"), 300);
  };

  const handleSelectPreset = async (preset: PresetCharacter) => {
    await createRole({
      name: locale === "zh" ? preset.nameZh : preset.nameEn,
      description:
        locale === "zh" ? preset.descriptionZh : preset.descriptionEn,
      systemPrompt:
        locale === "zh" ? preset.systemPromptZh : preset.systemPromptEn,
      avatar: preset.avatar,
      gender: preset.gender,
      personalityTraits: preset.personalityTraits,
      avatarUrl: `/presets/${preset.presetId}/avatar.png`,
      illustrationUrl: `/presets/${preset.presetId}/illustration.png`,
      isPreset: true,
      presetId: preset.presetId,
    });
  };

  const handleCustom = () => {
    setStep("traits");
  };

  const handleToggleTrait = useCallback((traitId: string) => {
    setTraits((prev) =>
      prev.includes(traitId)
        ? prev.filter((t) => t !== traitId)
        : prev.length < 5
          ? [...prev, traitId]
          : prev
    );
  }, []);

  const handleTraitsDone = () => {
    if (gender && onCustomCreate) {
      onCustomCreate(gender, traits);
    }
  };

  return (
    <div className="flex-1">
      {step === "welcome" && (
        <StepWelcome onNext={() => setStep("gender")} />
      )}
      {step === "gender" && (
        <StepGender
          selected={gender}
          onSelect={handleGenderSelect}
          onBack={() => setStep("welcome")}
        />
      )}
      {step === "select" && gender && (
        <StepCharacterSelect
          gender={gender}
          onSelectPreset={handleSelectPreset}
          onCustom={handleCustom}
          onBack={() => setStep("gender")}
        />
      )}
      {step === "traits" && (
        <StepTraits
          selected={traits}
          onToggle={handleToggleTrait}
          onNext={handleTraitsDone}
          onBack={() => setStep("select")}
        />
      )}
    </div>
  );
}
