import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Pencil } from "lucide-react";
import type { ISlotDTO } from "@/types/DTOS/slot.dto";

interface SlotListProps {
  slots: ISlotDTO[];
  onEdit: (slot: ISlotDTO) => void;
  onToggleActive?: (slotId: string, isActive: boolean) => void;
}
const SlotList: React.FC<SlotListProps> = ({ slots, onEdit }) => {
  if (!slots.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No slots created yet.
        </CardContent>
      </Card>
    );
  }
  console.log('slots :',slots)
  return (
    <>
   
      <div className="grid gap-4 sm:hidden">
        {slots.map((slot) => (
          <Card key={slot._id} className="border">
            <CardContent className="p-4 space-y-3">
              <div className="font-semibold text-gray-800">
                {slot.course.title}
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                {slot.selectedDays
                  .filter((d) => d.active)
                  .map((d, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{d.day}</span>
                      <span>
                        {d.startTime} – {d.endTime}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="flex justify-between text-sm">
                <span>Duration</span>
                <span>{slot.slotDuration} min</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Price</span>
                <span>₹{slot.pricePerSlot ?? "N/A"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    slot.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {slot.isActive ? "Active" : "Inactive"}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(slot)}
                >
                  <Pencil size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

   
      <Card className="hidden sm:block">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-left">Weekly Schedule</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {slots.map((slot) => (
                  <tr key={slot._id} className="border-b">
                    <td className="p-3">{slot.course.title}</td>

                    <td className="p-3">
                      {slot.selectedDays
                        .filter((d) => d.active)
                        .map((d, i) => (
                          <div key={i}>
                            {d.day}: {d.startTime} – {d.endTime}
                          </div>
                        ))}
                    </td>

                    <td className="p-3 text-center">{slot.slotDuration} min</td>
                    <td className="p-3 text-center">₹{slot.pricePerSlot}</td>

                    <td className="p-3 text-center">
                      {slot.isActive ? "Active" : "Inactive"}
                    </td>

                    <td className="p-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(slot)}
                      >
                        <Pencil size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SlotList;
