'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Tooltip, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { ArrowRight, ArrowUpIcon } from 'lucide-react';
import { TooltipContent } from '@radix-ui/react-tooltip';
import { AutoResizeTextarea } from './ui/autoresize-textarea';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasTyped, setHasTyped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    // Vibrate when sending a message
    // verify if the browser supports the vibration API
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

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
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Failed to process question',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Vibrate when receiving a message
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      setQuestion('');
      setIsLoading(false);
      setHasTyped(false);
    }
  };

  const handleQuestionChange = (newValue: string) => {
    if (!isLoading) {
      setQuestion(newValue);
      if (newValue.trim() !== '' && !hasTyped) {
        setHasTyped(true);
      } else if (newValue.trim() === '' && hasTyped) {
        setHasTyped(false);
      }
    }
  };

  return (
    <>
      <main
        className={cn(
          'ring-none mx-auto flex h-svh max-h-svh w-full max-w-[45rem] flex-col items-stretch border-none',
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
                    <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                  </div>
                ))}
                {/* loading assistant */}
                {isLoading && (
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
          className="border-input bg-background focus-within:ring-ring/10 focus-within:ring-offset-background relative mx-6 mb-6 flex items-center gap-3 rounded-[16px] border p-5 pr-14 text-sm focus-within:ring-2 focus-within:ring-offset-0 focus-within:outline-none"
        >
          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={handleQuestionChange}
            value={question}
            placeholder="Enter a message"
            className="placeholder:text-muted-foreground max-h-[120px] min-h-[24px] w-full flex-1 bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className={cn(
                  'absolute right-4 bottom-4 size-6 h-8 w-8 flex-shrink-0 rounded-full border-0 transition-all duration-200',
                  hasTyped ? 'light:bg-zinc-900 scale-110 dark:bg-zinc-200' : 'bg-gray-200',
                )}
                disabled={!question.trim() || isLoading}
              >
                <ArrowUpIcon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    hasTyped ? 'light:text-white dark:text-zinc-950' : 'text-gray-500',
                  )}
                />
                <span className="sr-only">Submit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Submit</TooltipContent>
          </Tooltip>
        </form>
      </main>
    </>
  );
}
