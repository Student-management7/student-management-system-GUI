// src/hooks/useStudentsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { getStdDetails } from '../services/studentRegistration/api/StudentRegistration';

export const useStudentsQuery = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: getStdDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
