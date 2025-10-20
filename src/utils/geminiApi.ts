import { settingsUtils } from "./settings";

interface GeminiResponse {
  success: boolean;
  content?: string;
  error?: string;
}

// Utility function for retries
async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying after error: ${error}. Retries left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
}

export const geminiApi = {
  async enhanceText(
    text: string,
    tone: string = "professional",
  ): Promise<GeminiResponse> {
    const apiKey = settingsUtils.getSettings().geminiApiKey;

    if (!apiKey) {
      return {
        success: false,
        error: "No API key found. Please add your Gemini API key in settings.",
      };
    }

    const prompt = `
      Enhance the following text to be more ${tone}.
      Improve clarity, flow, and impact while preserving original meaning and Markdown formatting.

      Original text:
      ${text}
    `;

    try {
      const response = await retry(async () => {
        const res = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" +
            apiKey,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 4096,
              },
            }),
          },
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.error?.message ||
              `API request failed with status ${res.status}`,
          );
        }
        return res;
      });

      const data = await response.json();

      const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!enhancedText) {
        return {
          success: false,
          error: `No enhanced text was generated. API response: ${JSON.stringify(data)}`,
        };
      }

      return {
        success: true,
        content: enhancedText,
      };
    } catch (error) {
      console.error("Error enhancing text after retries:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while enhancing the text. Please try again.",
      };
    }
  },
};
