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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
  });
  
  const [error, setError] = useState<Record<string, string[]> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [raccoonMessage, setRaccoonMessage] = useState("Fresh meat for the grinder? Just kidding!");
  const [raccoonMood, setRaccoonMood] = useState('smirk');

  const router = useRouter();
  const { register } = useAuth();
  
  // Emotion map
  const emotions: {[key: string]: string} = {
      welcome: '/racoon-welcome.png',
      smirk: '/racoon-smirk.png',
      sus: '/racoons-sus.png',
      angry: '/racoon-angry.png',
      sad: '/racoon-sad.png'
  };

  useEffect(() => {
    const isBasicValid = 
        formData.username.length > 0 && 
        formData.email.length > 0 && 
        formData.password.length > 0 &&
        formData.password2.length > 0;
    
    if (isBasicValid) {
        if (formData.password === formData.password2) {
            setFormValid(true);
            setRaccoonMessage("Everything looks perfect! Let's cook!");
            setRaccoonMood('welcome');
        } else {
            setFormValid(false);
            setRaccoonMessage("Passwords don't match, chef!");
            setRaccoonMood('angry');
        }
    } else {
        setFormValid(false);
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFocus = (field: string) => {
      switch(field) {
          case 'username': 
              setRaccoonMessage("Pick a cool chef name!"); 
              setRaccoonMood('welcome');
              break;
          case 'email': 
              setRaccoonMessage("Where do I send the recipes?"); 
              setRaccoonMood('smirk');
              break;
          case 'password': 
              setRaccoonMessage("Make it hard to guess!"); 
              setRaccoonMood('sus');
              break;
          case 'password2': 
              setRaccoonMessage("Just to be sure..."); 
              setRaccoonMood('sus');
              break;
          case 'date_of_birth': 
              setRaccoonMessage("When was this chef born?"); 
              setRaccoonMood('smirk');
              break;
          default: 
              setRaccoonMessage("Fill it up!");
              setRaccoonMood('welcome');
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password2) {
      setError({ non_field_errors: ['Passwords do not match'] });
      setRaccoonMessage("The passwords are fighting each other!");
      setRaccoonMood('angry');
      return;
    }

    setIsLoading(true);
    setRaccoonMessage("Printing your name tag...");
    setRaccoonMood('smirk');

    try {
      await register(formData);
      router.push('/');
    } catch (err) {
      setRaccoonMessage("Something smells burnt...");
      setRaccoonMood('angry');
      if (err instanceof AxiosError && err.response?.data) {
        setError(err.response.data);
      } else {
        setError({ non_field_errors: ['Registration failed. Please try again.'] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to safely get error messages
  const getFieldError = (fieldName: string) => {
    if (!error) return null;
    const fieldError = error[fieldName];
    if (Array.isArray(fieldError) && fieldError.length > 0) {
      return fieldError[0];
    }
    return null;
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-8">
       <div className="relative w-full max-w-2xl mt-12">
         {/* Raccoon Avatar & Speech Bubble */}
         <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center w-full">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-lg border-2 border-main mb-4 relative z-20 max-w-70 text-center animate-bounce-slight">
               <p className="font-header font-bold text-main leading-tight">{raccoonMessage}</p>
               <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-main rotate-45"></div>
            </div>
            
            <div className="relative h-32 w-32 flex justify-center items-end">
                {/* Background Circle */}
                <div className="absolute bottom-0 w-24 h-24 rounded-full border-4 border-main bg-[#795548] z-0 shadow-xl"></div>
                {/* Pop-out Image */}
                <div className="absolute bottom-0 z-10 w-32 h-32 animate-speaking">
                     <Image 
                        src={emotions[raccoonMood] || '/racoon-smirk.png'}
                        alt="Chef Raccoon" 
                        fill
                        className="object-cover object-bottom"
                        unoptimized
                     />
                </div>
            </div>
         </div>

      <div className="bg-[#FFF8E1] border-[3px] border-main rounded-4xl shadow-[8px_8px_0px_0px_rgba(74,59,50,0.2)] p-8 pt-16 space-y-6 relative">
        <div className="text-center space-y-2 mt-4">
          <h2 className="text-3xl font-bold font-header text-main tracking-tight">
            New Chef Registration
          </h2>
          <p className="text-main/70 font-medium font-body">
            Join the kitchen crew!
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error?.non_field_errors && (
             <div className="bg-red/10 border-2 border-red border-dashed p-3 rounded-xl transform -rotate-1">
                <p className="text-sm text-red font-bold font-body text-center">⚠️ {error.non_field_errors.join(', ')}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Username */}
            <div className="col-span-1 md:col-span-2">
              <Input
                label="Username *"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                onFocus={() => handleFocus('username')}
                className="bg-white border-2"
              />
              {getFieldError('username') && (
                <p className="mt-1 text-sm text-red font-bold font-body">{getFieldError('username')}</p>
              )}
            </div>

            {/* Email */}
            <div className="col-span-1 md:col-span-2">
              <Input
                label="Email *"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                className="bg-white border-2"
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red font-bold font-body">{getFieldError('email')}</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <Input
                label="First Name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                onFocus={() => handleFocus('first_name')}
                 className="bg-white border-2"
              />
            </div>

            {/* Last Name */}
            <div>
              <Input
                label="Last Name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                onFocus={() => handleFocus('last_name')}
                 className="bg-white border-2"
              />
            </div>

             {/* Date of Birth */}
             <div className="col-span-1 md:col-span-2">
              <Input
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                onFocus={() => handleFocus('date_of_birth')}
                 className="bg-white border-2"
              />
                {getFieldError('date_of_birth') && (
                <p className="mt-1 text-sm text-red font-bold font-body">{getFieldError('date_of_birth')}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Input
                label="Password *"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                 className="bg-white border-2"
              />
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red font-bold font-body">{getFieldError('password')}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Input
                label="Confirm Password *"
                name="password2"
                type="password"
                required
                value={formData.password2}
                onChange={handleChange}
                onFocus={() => handleFocus('password2')}
                 className="bg-white border-2"
              />
            </div>
          </div>

          <div className="pt-4">
             <Button
                type="submit"
                disabled={isLoading}
                variant={formValid ? 'success' : 'primary'}
                className={`w-full text-lg transition-all duration-300 ${formValid ? 'scale-105 shadow-xl' : 'opacity-90'}`}
              >
                {isLoading ? 'Hiring Chef...' : (formValid ? 'Complete Registration' : 'Fill all details')}
              </Button>
          </div>

          <div className="text-center text-sm font-medium font-body">
            <span className="text-main/70">
              Already have an apron?{' '}
            </span>
            <Link
              href="/login"
              className="font-bold text-sidebar hover:text-sidebar/80 hover:underline"
            >
              Log in instead
            </Link>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
