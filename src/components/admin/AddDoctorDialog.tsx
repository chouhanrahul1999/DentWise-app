import { Gender } from "@prisma/client";
import { useState } from "react";

interface AddDoctorDilogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDoctorDialog = ({ isOpen, onClose }: AddDoctorDilogProps) => {
    const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    speciality: "",
    gender: "MALE" as Gender,
    isActive: true,
  });
  return <div>AddDoctorDialog</div>;
};

export default AddDoctorDialog;
