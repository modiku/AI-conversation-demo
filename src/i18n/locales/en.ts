import type { TranslationKey } from "./zh";

const en: Record<TranslationKey, string> = {
  // App
  "app.title": "AI Companion",

  // Auth
  "auth.login": "Sign In",
  "auth.register": "Sign Up",
  "auth.loginTitle": "Sign in to your account",
  "auth.registerTitle": "Create a new account",
  "auth.email": "Email",
  "auth.emailPlaceholder": "your@email.com",
  "auth.password": "Password",
  "auth.passwordPlaceholder": "At least 6 characters",
  "auth.submitting": "Processing...",
  "auth.noAccount": "Don't have an account?",
  "auth.hasAccount": "Already have an account?",
  "auth.goRegister": "Sign Up",
  "auth.goLogin": "Sign In",
  "auth.error.emailInUse": "This email is already registered",
  "auth.error.invalidEmail": "Invalid email format",
  "auth.error.weakPassword": "Password must be at least 6 characters",
  "auth.error.userNotFound": "User not found",
  "auth.error.wrongPassword": "Incorrect password",
  "auth.error.invalidCredential": "Invalid email or password",
  "auth.error.tooManyRequests": "Too many attempts, please try again later",
  "auth.error.default": "Operation failed, please try again",

  // Header
  "header.signOut": "Sign Out",
  "header.backToList": "← Back to Characters",

  // Dashboard
  "dashboard.title": "My AI Characters",
  "dashboard.newRole": "+ New Character",
  "dashboard.empty": "No characters yet",
  "dashboard.emptyHint": "Click \"New Character\" above to get started",

  // Role
  "role.edit": "Edit",
  "role.delete": "Delete",
  "role.deleteConfirm": "Delete this character? All conversation history will be lost.",
  "role.noDescription": "No description",
  "role.messages": "messages",
  "role.lastChat": "Last chat",

  // Role Form
  "roleForm.createTitle": "New Character",
  "roleForm.editTitle": "Edit Character",
  "roleForm.name": "Name",
  "roleForm.namePlaceholder": "e.g. Sakura",
  "roleForm.description": "Description",
  "roleForm.descriptionPlaceholder": "Brief description of this character",
  "roleForm.systemPrompt": "System Prompt",
  "roleForm.systemPromptPlaceholder": "Define the AI's role, behavior, and response style...",
  "roleForm.systemPromptHint": "This will be sent to the AI as the system prompt",
  "roleForm.avatar": "Avatar",
  "roleForm.gender": "Gender",
  "roleForm.male": "Male",
  "roleForm.female": "Female",
  "roleForm.traits": "Personality Traits",
  "roleForm.avatarUpload": "Upload Avatar",
  "roleForm.illustrationUpload": "Upload Illustration",
  "roleForm.fileTooLarge": "File size cannot exceed 5MB",
  "roleForm.uploadFailed": "Upload failed, please try again",
  "roleForm.cancel": "Cancel",
  "roleForm.saving": "Saving...",
  "roleForm.save": "Save Changes",
  "roleForm.create": "Create Character",

  // Chat
  "chat.placeholder": "Type a message... (Enter to send, Shift+Enter for new line)",
  "chat.send": "Send",
  "chat.clear": "Clear History",
  "chat.clearConfirm": "Clear all conversation history for this character?",
  "chat.startHint": "Send a message to start the conversation",
  "chat.sidebar.title": "Characters",
  "chat.notFound": "Character not found or has been deleted",
  "chat.aiError": "Sorry, AI response failed. Please try again later.",
  "chat.export": "Export Chat",

  // Onboarding
  "onboarding.title": "Create Your First AI Character",
  "onboarding.subtitle": "Design an AI companion that matches your style",
  "onboarding.start": "Get Started",
  "onboarding.gender": "Choose Gender",
  "onboarding.genderHint": "What gender should your character be?",
  "onboarding.male": "Male",
  "onboarding.female": "Female",
  "onboarding.traits": "Choose Personality",
  "onboarding.traitsHint": "Add personality traits to your character (up to 5)",
  "onboarding.traitsCount": "Selected {{count}}/5",
  "onboarding.next": "Next",
  "onboarding.back": "Back",
  "onboarding.selectCharacter": "Choose Your Character",
  "onboarding.selectHint": "Pick a preset character or create your own",
  "onboarding.custom": "Create Custom",
  "onboarding.customHint": "Build a unique character your way",

  // Profile
  "profile.edit": "Edit Profile",
  "profile.displayName": "Display Name",
  "profile.displayNamePlaceholder": "Enter your display name",
  "profile.avatar": "Avatar",
  "profile.save": "Save",
  "profile.saving": "Saving...",
  "profile.cancel": "Cancel",
  "profile.uploadFailed": "Avatar upload failed, please try again",
};

export default en;
