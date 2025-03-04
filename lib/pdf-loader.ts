import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

export async function createVectorStore(pdfPaths: string[]) {
  try {
    const docs = [];

    // Load PDFs from paths
    for (const path of pdfPaths) {
      const loader = new PDFLoader(path);
      const pdf = await loader.load();
      docs.push(...pdf);
    }

    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        modelName: 'embedding-001',
        maxRetries: 2,
      }),
    );

    return vectorStore;
  } catch (error) {
    console.error('Error creating vector store:', error);
    throw error;
  }
}
