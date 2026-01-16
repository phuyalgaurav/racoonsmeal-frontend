'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import { getIsUserProfileCreated } from '../lib/api';

export default function ProfileGuard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      const checkProfile = async () => {
        try {
          const result = await getIsUserProfileCreated();
          // If profile does NOT exist, and we are NOT on the completion page, go there
          if (!result.profile_exists && pathname !== '/complete-profile') {
            router.push('/complete-profile');
          }
          // If profile DOES exist, and we ARE on the completion page, go to home
          else if (result.profile_exists && pathname === '/complete-profile') {
            router.push('/');
          }
        } catch (error) {
          console.error("Failed to check profile", error);
        }
      };
      
      checkProfile();
    }
  }, [user, isAuthenticated, isLoading, pathname, router]);

  return null;
}
