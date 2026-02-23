"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

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
