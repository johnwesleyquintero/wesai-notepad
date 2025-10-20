import { settingsUtils } from "./settings";

interface GeminiResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export const geminiApi = {
  async enhanceText(
    text: string,
    tone: string = "professional",
  ): Promise<GeminiResponse> {
    try {
      const apiKey = settingsUtils.getSettings().geminiApiKey;

      if (!apiKey) {
        return {
          success: false,
          error:
            "No API key found. Please add your Gemini API key in settings.",
        };
      }

      const prompt = `
        Enhance the following text to be more ${tone}.
        Improve clarity, flow, and impact while preserving original meaning and Markdown formatting.

        Original text:
        ${text}
      `;

      const response = await fetch(
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

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error:
            data.error?.message || "Failed to enhance text. Please try again.",
        };
      }

      // Extract the enhanced text from the response
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
      console.error("Error enhancing text:", error);
      return {
        success: false,
        error: "An error occurred while enhancing the text. Please try again.",
      };
    }
  },
};
