"use client";

import getDoctors, { createDoctor } from "@/lib/actions/doctors";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetDoctors() {
  const result = useQuery({
    queryKey: ["getDoctors"],
    queryFn: getDoctors,
  });

  return result;
}

export const useCreateDoctor = () => {
    const result = useMutation({
        mutationFn: createDoctor,
        onSuccess: () => console.log("Doctor created successfully"),
        onError: (error) => console.error("Error creating doctor:", error),
    })

    return result;
}
