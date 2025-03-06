'use client';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { Tooltip, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { ArrowUpIcon } from 'lucide-react';
import { TooltipContent } from '@radix-ui/react-tooltip';
import { AutoResizeTextarea } from './ui/autoresize-textarea';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmitQuestion(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;
    const userMessage: Message = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.answer };
      setMessages((prev) => [...prev, assistantMessage]);
      setQuestion('');
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Failed to process question',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <main
        className={cn(
          'ring-none mx-auto flex h-svh max-h-svh w-full max-w-[35rem] flex-col items-stretch border-none',
          className,
        )}
        {...props}
      >
        <div className="flex-1 content-center overflow-y-auto px-6">
          {messages.length > 0 ? (
            <>
              <div className="my-4 flex h-fit min-h-full flex-col gap-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    data-role={message.role}
                    className="max-w-[80%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=assistant]:bg-gray-100 data-[role=assistant]:text-black data-[role=user]:self-end data-[role=user]:bg-blue-500 data-[role=user]:text-white"
                  >
                    {message.content}
                  </div>
                ))}
                {/* loading assistant */}
                {loading && (
                  <div className="max-w-[80%] self-start rounded-xl bg-gray-100 px-3 py-2 text-sm text-black">
                    Loading...
                  </div>
                )}
              </div>
            </>
          ) : (
            <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
              <h1 className="text-2xl leading-none font-semibold tracking-tight">ChatBot Know Proposals Ec - 2025</h1>
              <p className="text-muted-foreground text-sm">
                This Ia learned on the basis of the official documents of the{' '}
                <span className="text-foreground">CNE 2025</span>
                <span className="text-foreground">Of the political parties in the second round</span>
              </p>
              <p className="text-muted-foreground text-sm">
                Ask questions, summarize and learn about the work plans of each political party.
              </p>
            </header>
          )}
        </div>

        <form
          onSubmit={handleSubmitQuestion}
          className="border-input bg-background focus-within:ring-ring/10 focus-within:ring-offset-background relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:ring-2 focus-within:ring-offset-0 focus-within:outline-none"
        >
          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={(v) => setQuestion(v)}
            value={question}
            placeholder="Enter a message"
            className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="absolute right-1 bottom-1 size-6 rounded-full">
                <ArrowUpIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Submit</TooltipContent>
          </Tooltip>
        </form>
      </main>
    </>
  );
}
