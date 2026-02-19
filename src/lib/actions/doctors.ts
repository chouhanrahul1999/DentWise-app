"use server";

import { Gender } from "@prisma/client";
import { prisma } from "../prisma";
import { generateAvatar } from "../utils";
import { revalidatePath } from "next/cache";

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

interface CreateDoctorInput {
  name: string;
  email: string;
  phone: string;
  speciality: string;
  gender: Gender;
  isActive: boolean;
}

export const createDoctor = async (input: CreateDoctorInput) => {
  try {
    if (!input.name || !input.email)
      throw new Error("Name and email are required");

    const doctor = await prisma.doctor.create({
      data: {
        ...input,
        imageUrl: generateAvatar(input.name, input.gender),
      },
    });

    revalidatePath("/admin");

    return doctor;
  } catch (e: any) {
    if (e?.code === "P2002") {
      throw new Error("Doctor with this email already exists");
    }
    console.error("Error creating doctor:", e);
    throw new Error("Failed to create doctor");
  }
};
