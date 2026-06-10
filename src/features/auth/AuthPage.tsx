import burgerSvg from '@/assets/burger.svg';
import MainLogo from '@/assets/logo-foody.svg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';

export default function AuthPage() {
  const [tab, setTab] = React.useState<'signin' | 'signup'>('signin');

  return (
    <div className='h-screen w-full bg-white'>
      <div className='flex h-screen w-full'>
        {/* Left - Illustration */}
        <div className='relative hidden flex-1 items-center justify-center md:flex'>
          <img
            src={burgerSvg}
            alt='Food illustration'
            className='w-full object-contain'
            draggable={false}
          />
        </div>

        {/* Right */}
        <div className='flex flex-1 items-center justify-center px-6 md:px-0'>
          <div className='flex w-full max-w-md flex-col gap-4 md:w-93.5 md:gap-5'>
            {/* Logo */}
            <div className='flex items-center gap-3 md:gap-3.75'>
              <img
                src={MainLogo}
                alt='Foody logo'
                className='h-8 w-8 md:h-10.5 md:w-10.5'
                draggable={false}
              />
              <span className='text-[24.38px] font-extrabold leading-8 text-neutral-950 md:text-[32px] md:leading-10.5'>
                Foody
              </span>
            </div>

            {/* Title */}
            <div className='flex flex-col gap-0 md:gap-1'>
              <h1 className='text-[24px] font-extrabold leading-9 text-black md:text-[28px] md:leading-9.5'>
                {tab === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className='text-[14px] leading-7 -tracking-[0.03em] text-neutral-950 md:text-[16px] md:leading-7.5'>
                {tab === 'signin'
                  ? "Good to see you again! Let's eat"
                  : 'Join us and start your culinary journey'}
              </p>
            </div>

            {/* Tabs */}
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as 'signin' | 'signup')}
            >
              <TabsList className='h-14 w-full cursor pointer rounded-full bg-neutral-100 p-1'>
                <TabsTrigger
                  value='signin'
                  className='h-full w-1/2 cursor-pointer rounded-full text-base font-semibold text-neutral-600 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm'
                >
                  Sign in
                </TabsTrigger>
                <TabsTrigger
                  value='signup'
                  className='h-full w-1/2 cursor-pointer rounded-full text-base font-semibold text-neutral-600 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm'
                >
                  Sign up
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode='wait'>
                {tab === 'signin' ? (
                  <TabsContent value='signin' className='mt-3' forceMount>
                    <SignInForm />
                  </TabsContent>
                ) : (
                  <TabsContent value='signup' className='mt-3' forceMount>
                    <SignUpForm />
                  </TabsContent>
                )}
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
