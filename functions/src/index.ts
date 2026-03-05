import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

const deepseekApiKey = defineSecret("DEEPSEEK_API_KEY");

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

export const chat = onCall(
  {
    secrets: [deepseekApiKey],
    timeoutSeconds: 120,
    cors: true,
  },
  async (request) => {
    // Verify authentication
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be logged in to use the chat function."
      );
    }

    const { messages } = request.data as ChatRequest;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new HttpsError(
        "invalid-argument",
        "Messages array is required and must not be empty."
      );
    }

    // Limit context size to prevent abuse
    if (messages.length > 50) {
      throw new HttpsError(
        "invalid-argument",
        "Too many messages. Maximum 50 messages allowed."
      );
    }

    try {
      const response = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${deepseekApiKey.value()}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("DeepSeek API error:", response.status, errorText);
        throw new HttpsError(
          "internal",
          `AI service returned error: ${response.status}`
        );
      }

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message?.content;

      if (!assistantMessage) {
        throw new HttpsError("internal", "No response from AI service.");
      }

      return { content: assistantMessage };
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      console.error("Chat function error:", error);
      throw new HttpsError("internal", "Failed to get AI response.");
    }
  }
);
