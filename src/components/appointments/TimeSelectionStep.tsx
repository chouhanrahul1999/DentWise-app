import { useBookedTimeSlots } from "@/hooks/use-appointments";
import { APPOINTMENT_TYPES, getAvailableTimeSlots, getNext5Days } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface TimeSelectionStepProps {
  selectedDentistId: string;
  selectedDate: string;
  selectedTime: string;
  selectedType: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onTypeChange: (type: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const TimeSelectionStep = ({
  onBack,
  onContinue,
  onDateChange,
  onTimeChange,
  onTypeChange,
  selectedDate,
  selectedDentistId,
  selectedTime,
  selectedType,
}: TimeSelectionStepProps) => {
  const { data: bookedTimeSlots = [] } = useBookedTimeSlots(
    selectedDentistId,
    selectedDate,
  );

  const availableDates = getNext5Days();
  const availableTimeSlots = getAvailableTimeSlots();

  const handleDateSelect = (date: string) => {
    onDateChange(date);
    // reset time when the date changes
    onTimeChange("");
  };
  return <div className="space-y-6">
    <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h2 className="text-2xl font-semibold">Select Date & Time</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appointment Type</h3>
          <div className="space-y-3">
            {APPOINTMENT_TYPES.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  selectedType === type.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onTypeChange(type.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{type.name}</h4>
                      <p className="text-sm text-muted-foreground">{type.duration}</p>
                    </div>
                    <span className="font-semibold text-primary">{type.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>
      </div>
  </div>;
};

export default TimeSelectionStep;
