
import { GoogleGenAI } from "@google/genai";
import { ThriftStore, GroundingChunk } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function createPrompt(location: string, itemType: string): string {
  return `
    You are a thrift store expert. Your task is to find the best thrift stores in "${location}" for someone looking for "${itemType}".

    Based on Google Maps data, analyze reviews and comments for thrift stores in the area.

    Provide a list of the top 3-4 stores. For each store, include its name, a short summary (2-3 sentences) explaining why it's a good choice for finding "${itemType}", and a bulleted list of key positive themes or direct quotes from reviews that support your recommendation.

    Format your entire response as a single JSON object string within a markdown code block. The JSON object should have a single key "stores" which is an array. Each object in the "stores" array should have the following structure:
    {
      "storeName": "Name of the Thrift Store",
      "summary": "A 2-3 sentence summary explaining why this store is good for finding the item.",
      "keyThemes": ["A list of key themes or short quotes from reviews.", "Another theme."]
    }

    Do not include any other text, conversation, or explanation outside of the markdown JSON code block.
  `;
}

// A simple utility to find the best match for a store name
const findBestMatch = (storeName: string, chunks: GroundingChunk[]): GroundingChunk | undefined => {
    const normalizedStoreName = storeName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let bestMatch: GroundingChunk | undefined = undefined;
    let highestScore = 0;

    chunks.forEach(chunk => {
        const normalizedChunkTitle = chunk.maps.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normalizedChunkTitle.includes(normalizedStoreName) || normalizedStoreName.includes(normalizedChunkTitle)) {
            // Simple scoring based on inclusion, could be more complex
            const score = Math.max(normalizedChunkTitle.length, normalizedStoreName.length);
            if(score > highestScore) {
                highestScore = score;
                bestMatch = chunk;
            }
        }
    });
    return bestMatch;
}


export const findThriftStores = async (location: string, itemType: string): Promise<ThriftStore[]> => {
  try {
    const prompt = createPrompt(location, itemType);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const text = response.text;
    
    // Extract JSON string from markdown code block
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("Could not parse JSON from model response.");
    }
    
    const parsedJson = JSON.parse(jsonMatch[1]);
    const storesFromAI: ThriftStore[] = parsedJson.stores || [];

    const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [];

    // Combine AI analysis with grounding data
    const combinedResults: ThriftStore[] = storesFromAI.map(store => {
      const match = findBestMatch(store.storeName, groundingChunks);
      return {
        ...store,
        mapsUrl: match?.maps.uri,
        mapsTitle: match?.maps.title,
      };
    });

    return combinedResults;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch thrift store recommendations: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching data.");
  }
};
