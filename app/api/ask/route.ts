import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createVectorStore } from '@/lib/pdf-loader';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { NextResponse } from 'next/server';
import { PromptTemplate } from '@langchain/core/prompts';

interface QuestionRequest {
  question: string;
}

const pdfPaths = ['data/pt_adn.pdf', 'data/pt_r5.pdf'];

// Initialize vector store
let vectorStore: any = null;
export async function POST(req: Request) {
  try {
    const { question } = (await req.json()) as QuestionRequest;

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Initialize vector store if not already done
    if (!vectorStore) {
      vectorStore = await createVectorStore(pdfPaths);
    }

    // Create Gemini model with Langchain
    const model = new ChatGoogleGenerativeAI({
      modelName: 'gemini-2.0-flash-lite',
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.7,
      maxRetries: 3,
    });

    // Create prompt template
    const prompt = PromptTemplate.fromTemplate(
      `
      You are a helpful AI assistant who answers questions based on the provided PDF documents about the political parties' work plan.
      Use only the context provided to answer the question. If you don't know the answer or can't find it in the context, say so.
      and respond with a helpful message in spanish.

      Context: {context}
      Question: {input}

      Answer: Let me answer based on the provided context.
    `.trim(),
    );

    // Create document chain
    const documentChain = await createStuffDocumentsChain({
      llm: model,
      prompt,
      outputParser: new StringOutputParser(),
    });

    // Create retrieval chain
    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever: vectorStore.asRetriever(),
    });

    console.log('Processing question:', question);

    const response = await retrievalChain.invoke({
      input: question,
    });

    return NextResponse.json({ answer: response.answer });
  } catch (error) {
    console.error('Error processing question:', error);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}
