import { GoogleGenAI } from '@google/genai';


const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});


export async function getEmbeddings(text: string) {
  try {
    const response = await genAI.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text.replace(/\n/g, ' '),
    })

    return response.embeddings
  } catch (error) {
    console.log('Error calling Google GenAI', error)
    throw error
  }
}
