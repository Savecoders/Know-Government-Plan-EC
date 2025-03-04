import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from '@langchain/openai';
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

    // Create vector store with OpenAI embeddings
    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPEN_IA_KEY,
      }),
    );

    return vectorStore;
  } catch (error) {
    console.error('Error creating vector store:', error);
    throw error;
  }
}
