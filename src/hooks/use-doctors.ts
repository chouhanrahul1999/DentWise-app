"use client";

import getDoctors, { createDoctor, updateDoctor } from "@/lib/actions/doctors";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function useGetDoctors() {
  const result = useQuery({
    queryKey: ["getDoctors"],
    queryFn: getDoctors,
  });

  return result;
}

export const useCreateDoctor = () => {
  const queryClien = useQueryClient();
  const result = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClien.invalidateQueries({ queryKey: ["getDoctors"] });
    },
    onError: (error) => console.error("Error creating doctor:", error),
  });

  return result;
};

export const useUpdateDoctor = () => {
  const queryClien = useQueryClient();

  const result = useMutation({
    mutationFn: updateDoctor,
    onSuccess: () => {
      queryClien.invalidateQueries({ queryKey: ["getDoctors"] });
    },
    onError: (error) => console.error("Error update doctor:", error),
  });

  return result;
};

