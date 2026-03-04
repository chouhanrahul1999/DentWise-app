import {
  useGetAppointments,
  useUpdateAppointmentStatus,
} from "@/hooks/use-appointments";
import React from "react";
import { Badge } from "../ui/badge";

const RecentAppointments = (appointmentId: string) => {
  const { data: appointments = [] } = useGetAppointments();
  const updateAppointmentMutation = useUpdateAppointmentStatus();

  const handleToggleAppointmentStatus = (appoontmentId: string) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId);

    const newStatus =
      appointment?.status === "CONFIRMED" ? "COMPLETED" : "CONFIRMED";

    updateAppointmentMutation.mutate({ id: appointmentId, status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmed</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  return <div>RecentAppointments</div>;
};

export default RecentAppointments;
