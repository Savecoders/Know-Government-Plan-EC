'use client';
import Link from 'next/link';
import { Logo } from './ui/logo';
import { CoffeeIcon, GithubIcon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useScroll, motion } from 'motion/react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Features', href: '#link' },
  { name: 'About', href: '#link' },
  { name: 'History', href: '#link' },
];

export const Navbar = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <header>
      <nav data-state={menuState && 'active'} className="fixed z-20 w-full pt-2">
        <section
          className={cn(
            'mx-auto max-w-7xl rounded-xl px-6 transition-all duration-300 lg:px-12',
            scrolled && 'bg-background/50 backdrop-blur-2xl',
          )}
        >
          <motion.div
            key={1}
            className={cn(
              'relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6',
              scrolled && 'lg:py-4',
            )}
          >
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-background mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-xl border p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="ghost" size="default">
                  <Link href="https://buymeacoffee.com/savecoders" className="flex items-center space-x-2 text-center">
                    <CoffeeIcon className="m-auto size-4 justify-center" />
                    <span>Donate coffee 🤭</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="default">
                  <Link href="#" className="flex items-center space-x-2 text-center">
                    <GithubIcon className="m-auto size-4 justify-center" />
                    <span>Repository</span>
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </nav>
    </header>
  );
};
