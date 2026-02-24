"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { AppointmentStatus } from "@prisma/client";

function transformAppointment(appointment: any) {
  return {
    ...appointment,
    patientName:
      `${appointment.user.firstName || ""} ${appointment.user.lastName || ""}`.trim(),
    patientEmail: appointment.user.email,
    doctorName: appointment.doctor.name,
    doctorImageUrl: appointment.doctor.imageUrl || "",
    date: appointment.date.toISOString().split("T")[0],
  };
}

export const getAppointments = async () => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        doctor: { select: { name: true, imageUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return appointments;
  } catch (e) {
    console.error("Error fetching appointments:", e);
    throw new Error("Failed to fetch appointments");
  }
};

export const getUserAppointmets = async () => {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("User not authenticated");

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user) throw new Error("User not found");

    const appointments = await prisma.appointment.findMany({
      where: { userId: user.id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        doctor: { select: { name: true, imageUrl: true } },
      },
      orderBy: [{ date: "asc" }, { createdAt: "desc" }],
    });

    return appointments.map(transformAppointment);
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
};

export const getUserAppointmentStats = async () => {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("User not authenticated");

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user) throw new Error("User not found");

    const [totalCount, completedCount] = await Promise.all([
      prisma.appointment.count({
        where: { userId: user.id },
      }),
      prisma.appointment.count({
        where: {
          userId: user.id,
          status: "COMPLETED",
        },
      }),
    ]);

    return {
      toalAppointments: totalCount,
      completedAppointments: completedCount,
    };
  } catch (error) {
    console.error("Error fetching appointment stats:", error);
    return { totalAppointments: 0, completedAppointments: 0 };
  }
};

export async function getBookedTimeSlots(doctorId: string, date: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: new Date(date),
        status: {
          in: ["CONFIRMED", "COMPLETED"], // consider both confirmed and completed appointments as blocking
        },
      },
      select: { time: true },
    });

    return appointments.map((appointment) => appointment.time);
  } catch (error) {
    console.error("Error fetching booked time slots:", error);
    return []; // return empty array if there's an error
  }
}
