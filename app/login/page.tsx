'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [raccoonMessage, setRaccoonMessage] = useState("Halt! Who goes there?");
  const [raccoonMood, setRaccoonMood] = useState('welcome'); // welcome, smirk, sus, angry, sad
  
  const router = useRouter();
  const { login } = useAuth();

  // Emotion map
  const emotions: {[key: string]: string} = {
      welcome: '/racoon-welcome.png',
      smirk: '/racoon-smirk.png',
      sus: '/racoons-sus.png',
      angry: '/racoon-angry.png',
      sad: '/racoon-sad.png'
  };

  useEffect(() => {
    if (username.length > 0 && password.length > 0) {
      setFormValid(true);
      setRaccoonMessage("Ooh! Looks tasty! Come in!");
      setRaccoonMood('welcome');
    } else {
      setFormValid(false);
    }
  }, [username, password]);

  const handleFocus = (field: string) => {
    if (field === 'username') {
        setRaccoonMessage("Tell me your name...");
        setRaccoonMood('smirk');
    }
    if (field === 'password') {
        setRaccoonMessage("Shh... what's the secret?");
        setRaccoonMood('sus');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setRaccoonMessage("Checking the guest list...");
    setRaccoonMood('smirk');

    try {
      await login({ username, password });
      setRaccoonMood('welcome');
      router.push('/');
    } catch (err) {
      setRaccoonMessage("Hey! You're not on the list!");
      setRaccoonMood('angry');
      if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data;
        if (data.detail) {
          setError(data.detail);
        } else {
          setError('Invalid credentials');
        }
      } else {
        setError('Login failed. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="relative w-full max-w-md">
         {/* Raccoon Avatar & Speech Bubble */}
         <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-lg border-2 border-main mb-4 relative z-20 max-w-50 text-center animate-bounce-slight">
               <p className="font-header font-bold text-main leading-tight">{raccoonMessage}</p>
               {/* Bubble arrow */}
               <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-main rotate-45"></div>
            </div>
            
            <div className="relative h-32 w-32 flex justify-center items-end">
                {/* Background Circle */}
                <div className="absolute bottom-0 w-24 h-24 rounded-full border-4 border-main bg-[#795548] z-0 shadow-xl"></div>
                {/* Pop-out Image */}
                <div className="absolute bottom-0 z-10 w-32 h-32 animate-speaking">
                    <Image 
                        src={emotions[raccoonMood] || '/racoon-welcome.png'}
                        alt="Chef Raccoon" 
                        fill
                        className="object-cover object-bottom"
                        unoptimized
                    />
                </div>
            </div>
         </div>

        {/* Main Card */}
        <div className="bg-[#FFF8E1] border-[3px] border-main rounded-4xl shadow-[8px_8px_0px_0px_rgba(74,59,50,0.2)] p-8 pt-20 space-y-6 relative overflow-visible">
          
          <div className="text-center space-y-1">
            <h2 className="text-3xl text-main font-black font-header">
              Kitchen Login
            </h2>
            <p className="text-main/60 font-bold font-body text-sm">
              Show your badge, Chef!
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red/10 border-2 border-red border-dashed p-3 rounded-xl transform rotate-1">
                <p className="text-sm text-red font-bold font-body text-center">⚠️ {error}</p>
              </div>
            )}
            
            <div className="space-y-4">
                <Input
                  label="Username"
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => handleFocus('username')}
                  placeholder="Who are you?"
                  className="bg-white border-2"
                />
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus('password')}
                  placeholder="The secret ingredient is..."
                  className="bg-white border-2"
                />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                variant={formValid ? 'success' : 'primary'}
                className={`w-full text-lg transition-all duration-300 ${formValid ? 'scale-105 shadow-xl' : 'opacity-90'}`}
              >
                {isLoading ? 'Checking List...' : (formValid ? 'Enter Kitchen' : 'Fill details')}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-main font-body font-bold">
                No badge?{' '}
                <Link href="/register" className="text-sidebar decoration-wavy underline hover:text-sidebar/80">
                  Get recruit training!
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
