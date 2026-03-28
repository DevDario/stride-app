import { useEffect } from 'react';
import { useHomeStore } from '../store/homeStore';

const mockFetchUser = async () => {
  return new Promise<{ name: string; role: string }>((resolve) => {
    setTimeout(() => {
      resolve({ name: 'Dario', role: 'Developer' });
    }, 1000);
  });
};

export const useHomeViewModel = () => {
  const { user, isLoading, setUser, setIsLoading } = useHomeStore();

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userData = await mockFetchUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  return {
    greeting: 'Welcome to Flit App!',
    user,
    isLoading,
    fetchUser,
  };
};
