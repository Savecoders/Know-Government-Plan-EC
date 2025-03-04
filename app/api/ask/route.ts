import { OpenAI } from '@langchain/openai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createVectorStore } from '@/lib/pdf-loader';
import { NextResponse } from 'next/server';
import { PromptTemplate } from '@langchain/core/prompts';

const pdfPaths = ['/path/to/your/first.pdf', '/path/to/your/second.pdf'];

// Initialize vector store
let vectorStore: any = null;

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    // Initialize vector store if not already done
    if (!vectorStore) {
      vectorStore = await createVectorStore(pdfPaths);
    }

    // Create model
    const model = new OpenAI({
      openAIApiKey: process.env.OPEN_IA_KEY,
      temperature: 0,
    });

    // Create prompt template
    const prompt = PromptTemplate.fromTemplate(`
      Answer the question based only on the following context:
      {context}

      Question: {question}

      Answer:
    `);

    // Create document chain
    const documentChain = await createStuffDocumentsChain({
      llm: model,
      prompt,
    });

    // Create retrieval chain
    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever: vectorStore.asRetriever(),
    });

    // Get answer
    const response = await retrievalChain.invoke({ ...question });

    return NextResponse.json({ answer: response.answer });
  } catch (error) {
    console.error('Error processing question:', error);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}
