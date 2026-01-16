'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../components/ui/Button';
import { Card, RecipeCard } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

interface Meal {
  id: number;
  title: string;
  description: string;
  image: string;
}

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { addToast } = useToast();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [landingMessage, setLandingMessage] = useState("Welcome to Flavortown!");
  
  useEffect(() => {
    if (!isAuthenticated) {
      const messages = [
        "Hungry? Join the trash panda squad!",
        "Find the best shiny red apples!",
        "Midnight snack experts unite!",
        "One man's trash is our treasure!",
        "Welcome to Flavortown!"
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLandingMessage(messages[i]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const dummyMeals: Meal[] = [
      { id: 1, title: 'Trash Can Nachos', description: 'Just like Momma Raccoon used to make!', image: 'https://images.unsplash.com/photo-1568031813264-d394c5d474b9?auto=format&fit=crop&q=80&w=400' },
      { id: 2, title: 'Midnight Pizza', description: 'Found behind the Italian place. Still warm.', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=400' },
      { id: 3, title: 'Shiny Apple', description: 'A pristine red apple. Very rare loot.', image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&q=80&w=400' },
      { id: 4, title: 'Mystery Bagel', description: 'Everything owl. Or everything else.', image: 'https://images.unsplash.com/photo-1585478684894-a929b8782f9c?auto=format&fit=crop&q=80&w=400' },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-bold text-xl text-main">
        Loading...
      </div>
    );
  }

  // --- LANDING PAGE (Not Logged In) ---
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
             {/* Decorative patterns could go here */}
        </div>

        <div className="relative w-full max-w-2xl mt-16">
          {/* Raccoon Avatar & Speech Bubble */}
          <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="bg-white px-6 py-4 rounded-3xl shadow-xl border-4 border-main mb-4 relative z-20 max-w-xs text-center animate-bounce-slight">
               <p className="font-header font-bold text-main text-lg leading-tight">{landingMessage}</p>
               {/* Bubble arrow */}
               <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-b-4 border-r-4 border-main rotate-45"></div>
            </div>
            
            <div className="relative h-40 w-40 flex justify-center items-end">
                {/* Background Circle */}
                <div className="absolute bottom-0 w-32 h-32 rounded-full border-4 border-main bg-[#795548] z-0 shadow-2xl"></div>
                {/* Pop-out Image */}
                <div className="absolute bottom-0 z-10 w-40 h-40 animate-speaking filter drop-shadow-xl hover:scale-110 transition-transform duration-300">
                    <Image 
                      src="/racoon-welcome.png"
                      alt="Raccoon Chef" 
                      fill
                      className="object-contain object-bottom"
                      priority
                    />
                </div>
            </div>
          </div>

          <div className="w-full p-12 pt-24 text-center space-y-8 bg-[#FFFBF0] rounded-[3rem] relative z-10 border-4 border-main shadow-[8px_8px_0px_0px_#4A3B32]">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none rounded-[3rem]" 
                 style={{ 
                   backgroundImage: 'radial-gradient(circle at 50% 50%, #4A3B32 1px, transparent 1px)', 
                   backgroundSize: '24px 24px' 
                 }}>
            </div>
            
            <h1 className="text-6xl font-header font-black text-main mb-2 tracking-tight drop-shadow-sm transform -rotate-2">
              Racoonsmeal
            </h1>
            <p className="text-2xl text-main/90 mb-8 max-w-lg mx-auto font-body font-bold leading-relaxed">
              Create random meals plans, share meal plans with everyone, track your eating habits!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/login" className="w-full sm:w-auto transform hover:-translate-y-1 transition-transform">
                <Button size="lg" className="w-full px-10 py-6 text-xl font-black shadow-lg bg-main text-white hover:bg-main/90 border-2 border-transparent rounded-2xl">Login</Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto transform hover:-translate-y-1 transition-transform">
                <Button size="lg" variant="secondary" className="w-full px-10 py-6 text-xl font-black shadow-lg bg-white border-2 border-main text-main hover:bg-gray-50 rounded-2xl">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD (Logged In) ---
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <Card className="mb-8 flex flex-col md:flex-row justify-between items-center bg-card">
        <div>
          <h1 className="text-3xl font-header font-bold text-main mb-2">
            Welcome back, Chef {user?.username}!
          </h1>
          <p className="text-main/70 font-body text-lg">
            Ready to cook something amazing today?
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
            <Button variant="primary" size="lg" onClick={() => setIsCreateModalOpen(true)}>
                + New Meal Plan
            </Button>
        </div>
      </Card>

      {/* Stats/Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-50 border-sidebar/30">
              <h3 className="text-xl font-header text-sidebar mb-1">Weekly Streak</h3>
              <p className="text-4xl font-black text-sidebar font-header">🔥 3 Days</p>
          </Card>
          <Card className="bg-red-50 border-red/30">
              <h3 className="text-xl font-header text-red mb-1">Points Needed</h3>
              <p className="text-4xl font-black text-red font-header">⭐ 450 XP</p>
          </Card>
          <Card className="bg-green-50 border-green/30">
              <h3 className="text-xl font-header text-green mb-1">Meals Cooked</h3>
              <p className="text-4xl font-black text-green font-header">🥗 12</p>
          </Card>
      </div>

      {/* Feed Section */}
      <div className="mb-6 flex items-center gap-4">
          <h2 className="text-2xl font-header text-main">Fresh from the Kitchen</h2>
          <div className="h-1 bg-main grow rounded-full opacity-10"></div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dummyMeals.map((meal) => (
            <RecipeCard 
                key={meal.id}
                title={meal.title}
                description={meal.description}
                imageUrl={meal.image}
                onLike={() => addToast(`You liked ${meal.title}!`, 'success')}
                onEdit={() => {
                    setSelectedMeal(meal);
                    setIsEditModalOpen(true);
                }}
            />
        ))}
      </div>

      {/* Modals */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Meal"
      >
        <div className="space-y-4">
            <Input label="Meal Name" placeholder="e.g., Spicy Raccoon Stew" />
            <Input label="Description" placeholder="What's in it?" />
            <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                    addToast('Meal Created Successfully!', 'success');
                    setIsCreateModalOpen(false);
                }}>Create Meal</Button>
            </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit: ${selectedMeal?.title}`}
      >
         <p className="mb-4">Editing functionality coming soon!</p>
         <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}
