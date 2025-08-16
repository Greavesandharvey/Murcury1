import { useQuery } from '@tanstack/react-query';

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      // TODO: replace with real API call when backend is ready
      // For now, return a mock user to skip authentication
      return { id: 1, name: 'Test User', email: 'test@mercuryone.com' };
    },
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  } as const;
}
