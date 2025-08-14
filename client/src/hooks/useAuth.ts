import { useQuery } from '@tanstack/react-query';

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      // TODO: replace with real API call when backend is ready
      return undefined;
    },
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  } as const;
}
