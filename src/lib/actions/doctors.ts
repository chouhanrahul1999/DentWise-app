"use server";

import { prisma } from "../prisma";

const getDoctors = async () => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        _count: { select: { appointments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return doctors.map((doctor) => ({
      ...doctor,
      appointmentCount: doctor._count.appointments,
    }));
  } catch (e) {
    console.error("Error fetching doctors:", e);
    throw new Error("Failed to fetch doctors");
  }
};

export default getDoctors;
