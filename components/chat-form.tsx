'use client';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
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
  id?: string;
}

export function ChatForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasTyped, setHasTyped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmitQuestion(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;
    const questionCopy = `${question.trim()}`;
    const userMessage: Message = { role: 'user', content: questionCopy };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setQuestion('');

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <>
      <main className={cn('ring-none mx-auto flex h-svh flex-col overflow-hidden', className)} {...props}>
        <div className="flex-grow overflow-y-scroll scroll-smooth px-6 pt-12 pb-32 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-track]:bg-transparent">
          <div
            className={cn(
              'mx-auto max-w-3xl space-y-4',
              messages.length > 0 ? '' : 'flex h-full flex-col justify-center',
            )}
          >
            {messages.length > 0 ? (
              <div className="my-8 flex h-fit min-h-full scroll-m-0 flex-col gap-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    data-role={message.role}
                    className={cn(
                      'max-w-[80%] rounded-xl px-3 py-2 text-sm',
                      message.role === 'assistant'
                        ? 'assistant self-start leading-relaxed text-gray-900 dark:text-gray-300'
                        : 'self-end rounded-br-none border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-white',
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                    ) : (
                      <span>{message.content}</span>
                    )}
                  </div>
                ))}
                {/* loading assistant */}
                {isLoading && (
                  <div className="max-w-[80%] self-start rounded-xl bg-gray-100 px-3 py-2 text-sm text-black">
                    Loading...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
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
        </div>
        <section className="bg-background fixed right-0 bottom-0 left-0 p-4">
          <form
            onSubmit={handleSubmitQuestion}
            className="border-input bg-background focus-within:ring-ring/10 focus-within:ring-offset-background relative mx-auto my-6 flex max-w-3xl items-center rounded-2xl border p-5 pr-15 text-sm focus-within:ring-2 focus-within:ring-offset-0 focus-within:outline-none"
          >
            <AutoResizeTextarea
              onKeyDown={handleKeyDown}
              onChange={handleQuestionChange}
              value={question}
              placeholder={isLoading ? 'Waiting for response...' : 'Ask Anything'}
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
                    hasTyped ? 'scale-110 bg-zinc-900 dark:bg-zinc-200' : 'bg-gray-200',
                  )}
                  disabled={!question.trim() || isLoading}
                >
                  <ArrowUpIcon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      hasTyped ? 'text-white dark:text-zinc-950' : 'text-gray-500',
                    )}
                  />
                  <span className="sr-only">Submit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-lg bg-gray-900 p-2 text-xs text-white" sideOffset={12}>
                Submit
              </TooltipContent>
            </Tooltip>
          </form>
        </section>
      </main>
    </>
  );
}
