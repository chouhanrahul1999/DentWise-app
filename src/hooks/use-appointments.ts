"use client";

import { getAppointments, getBookedTimeSlots } from "@/lib/actions/appointments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAppointments = () => {
  const result = useQuery({
    queryKey: ["getAppointments"],
    queryFn: getAppointments,
  });

  return result;
};

export function useBookedTimeSlots(doctorId: string, date: string) {
  return useQuery({
    queryKey: ["getBookedTimeSlots"],
    queryFn: () => getBookedTimeSlots(doctorId!, date),
    enabled: !!doctorId && !!date, // only run query if both doctorId and date are provided
  });
}

