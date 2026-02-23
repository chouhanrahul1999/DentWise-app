"use server";

import { Gender } from "@prisma/client";
import { prisma } from "../prisma";
import { generateAvatar } from "../utils";
import { revalidatePath } from "next/cache";
import { th } from "date-fns/locale";

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

interface updateDoctorInput extends Partial<CreateDoctorInput> {
  id: string;
}

export const updateDoctor = async (input: updateDoctorInput) => {
  try {
    if (!input.name || !input.email)
      throw new Error("Name and email are required");

    const currentDoctor = await prisma.doctor.findUnique({
      where: { id: input.id },
      select: { email: true },
    });

    if (!currentDoctor) throw new Error("Doctor not found");

    if(input.email !== currentDoctor.email) {
        const existingDoctor = await prisma.doctor.findUnique({
            where: { email: input.email },
          });

        if (existingDoctor) {
            throw new Error("Doctor with this email already exists");
        }
    }

    const doctor = await prisma.doctor.update({
      where: { id: input.id },
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        speciality: input.speciality,
        gender: input.gender,
        isActive: input.isActive,
      },
    });

    return doctor;
  } catch (e) {
    console.error("Error updating doctor:", e);
    throw new Error("Failed to update doctor");
  }
};

export async function getAvailableDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { appointments: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return doctors.map((doctor) => ({
      ...doctor,
      appointmentCount: doctor._count.appointments,
    }));
  } catch (error) {
    console.error("Error fetching available doctors:", error);
    throw new Error("Failed to fetch available doctors");
  }
}
