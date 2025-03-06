import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { ReactNode } from 'react';
import { geistMono, geistSans } from '../layout';
import { ThemeProvider } from '@/components/theme-provider';
export const metadata = {
  title: 'Assistant Know Proposals Ec 2025',
  description: 'Assistant Know Proposals Ec 2025',
  lang: 'en',
};

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <TooltipProvider delayDuration={0}>{children}</TooltipProvider>;
}
