import { GoogleGenAI } from "@google/genai";
import { PhotoStyle, ImageResolution } from "../types/dish";

let storedApiKey: string | null = null;

export const setApiKey = (key: string) => {
  storedApiKey = key;
};

export const getApiKey = (): string | null => {
  return storedApiKey;
};

const getClient = () => {
  if (!storedApiKey) {
    throw new Error("API key not set. Please enter your Gemini API key.");
  }
  return new GoogleGenAI({ apiKey: storedApiKey });
};

export const generateDishImage = async (
  dishName: string,
  dishDescription: string,
  style: PhotoStyle,
  resolution: ImageResolution
): Promise<string> => {
  const ai = getClient();

  let stylePrompt = "";
  let aspectRatio = "1:1";

  switch (style) {
    case PhotoStyle.RUSTIC:
      stylePrompt = "Rustic style, dark moody lighting, wooden table texture, professional food photography, 85mm lens, f/1.8, cinematic lighting, rich details.";
      aspectRatio = "4:3";
      break;
    case PhotoStyle.MODERN:
      stylePrompt = "Bright and modern style, clean white marble background, soft natural daylight, high key photography, minimalist plating, sharp focus.";
      aspectRatio = "4:3";
      break;
    case PhotoStyle.SOCIAL:
      stylePrompt = "Social media aesthetic, top-down flat lay view, vibrant pop colors, trendy cafe composition, smartphone photography style, sharp and shareable.";
      aspectRatio = "1:1";
      break;
  }

  const fullPrompt = `Professional food photography of ${dishName}: ${dishDescription}. ${stylePrompt} Make it look appetizing and high-end.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        responseModalities: ['Text', 'Image'] as any,
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if ((part as any).inlineData) {
        const inlineData = (part as any).inlineData;
        return `data:${inlineData.mimeType};base64,${inlineData.data}`;
      }
    }
    throw new Error("No image generated. The model may not support image generation with this configuration.");
  } catch (error) {
    console.error("Generation failed", error);
    throw error;
  }
};

export const editDishImage = async (
  base64Image: string,
  instruction: string
): Promise<string> => {
  const ai = getClient();

  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';'));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [
          { text: instruction },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          } as any,
        ],
      },
      config: {
        responseModalities: ['Text', 'Image'] as any,
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if ((part as any).inlineData) {
        const inlineData = (part as any).inlineData;
        return `data:${inlineData.mimeType};base64,${inlineData.data}`;
      }
    }
    throw new Error("No edited image returned");
  } catch (error) {
    console.error("Editing failed", error);
    throw error;
  }
};
