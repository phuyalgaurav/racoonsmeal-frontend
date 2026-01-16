'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { createUserProfile, CreateUserProfileData, getIsUserProfileCreated } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function CompleteProfilePage() {
  const { user, isAuthenticated, refreshUser, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState<Omit<CreateUserProfileData, 'profile_picture'>>({
    bio: 'Newbie here',
    age: 18,
    gender: 'male',
    height_cm: 170,
    weight_kg: 70,
    activity_level: 'light',
    goal: 'maintain',
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already has profile or not logged in
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      const checkProfile = async () => {
        if (user?.username) {
          try {
            const { profile_exists } = await getIsUserProfileCreated();
            if (profile_exists) {
              router.push('/');
            }
          } catch (err) {
            console.error('Error checking profile status:', err);
          }
        }
      };
      checkProfile();
    }
  }, [user, isAuthenticated, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.username) return;

    setLoading(true);
    setError(null);

    try {
      await createUserProfile(user.username, {
        ...formData,
        profile_picture: profilePic
      });
      await refreshUser();
      router.push('/');
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-fl-brown font-bold text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-panel w-full max-w-2xl bg-fl-card text-fl-brown transform transition-all my-8">
        <div className="p-8">
          <h2 className="text-3xl font-extrabold text-fl-brown mb-6 text-center">Complete Your Profile</h2>
          <p className="text-fl-brown/80 text-center mb-8">
            Tell us a bit about yourself to get started with Racoonsmeal!
          </p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-fl-brown font-bold mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-[var(--color-shadow)] bg-white text-fl-brown focus:outline-none focus:ring-2 focus:ring-fl-blue"
                  rows={3}
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-fl-brown font-bold mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 rounded-xl border border-[var(--color-shadow)] bg-white text-fl-brown focus:outline-none focus:ring-2 focus:ring-fl-blue"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-fl-brown font-bold mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-[var(--color-shadow)] bg-white text-fl-brown focus:outline-none focus:ring-2 focus:ring-fl-blue"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Height */}
              <div>
                <label className="block text-fl-brown font-bold mb-2">Height (cm)</label>
                <input
                  type="number"
                  name="height_cm"
                  value={formData.height_cm}
                  onChange={handleChange}
                  required
                  step="0.1"
                  className="w-full px-4 py-2 rounded-xl border border-[var(--color-shadow)] bg-white text-fl-brown focus:outline-none focus:ring-2 focus:ring-fl-blue"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-fl-brown font-bold mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  required
                  step="0.1"
                  className="w-full px-4 py-2 rounded-xl border border-[var(--color-shadow)] bg-white text-fl-brown focus:outline-none focus:ring-2 focus:ring-fl-blue"
                />
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-fl-brown font-bold mb-2">Activity Level</label>
                <select
                  name="activity_level"
                  value={formData.activity_level}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-[var(--color-shadow)] bg-white text-fl-brown focus:outline-none focus:ring-2 focus:ring-fl-blue"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-fl-brown font-bold mb-2">Goal</label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-[var(--color-shadow)] bg-white text-fl-brown focus:outline-none focus:ring-2 focus:ring-fl-blue"
                >
                  <option value="maintain">Maintain</option>
                  <option value="cut">Cut</option>
                  <option value="gain">Gain</option>
                </select>
              </div>

              {/* Profile Picture */}
              <div className="md:col-span-2">
                <label className="block text-fl-brown font-bold mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-fl-brown file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-fl-blue file:text-white hover:file:bg-fl-blue-dark"
                />
              </div>

            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`btn-chunky bg-fl-green hover:bg-[#7CB342] text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ '--color-shadow': '#689F38' } as React.CSSProperties}
              >
                {loading ? 'Creating...' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
