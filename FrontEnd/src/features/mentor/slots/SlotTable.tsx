import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
import { Pencil, Clock } from "lucide-react";
import type { ISlotDTO } from "@/types/DTOS/slot.dto";

interface SlotListProps {
  slots: ISlotDTO[];
  onEdit: (slot: ISlotDTO) => void;
  onToggleActive?: (slotId: string, isActive: boolean) => void;
}

const SlotList: React.FC<SlotListProps> = ({
  slots,
  onEdit,
  onToggleActive,
}) => {


  console.log(' : : :',slots)
  if (!slots.length) {
    return (
      <Card className="bg-white border border-gray-200 text-black shadow-sm">
        <CardContent className="p-8 text-center text-gray-500">
          No slots created yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 text-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <Clock size={20} className="text-gray-600" /> Mentor Slots
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left font-medium">Course</th>
                <th className="p-3 text-left font-medium">Weekly Schedule</th>
                <th className="p-3 text-left font-medium">Duration</th>
                <th className="p-3 text-left font-medium">Price</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {slots.map((slot) => (
                <tr
                  key={slot._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-gray-800">{slot.course.title}</td>

                  {/* Weekly Schedule */}
                  <td className="p-3 text-gray-700 align-top">
                    <div className="space-y-1">
                      {slot.selectedDays
                        .filter((d) => d.active)
                        .map((daySlot, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="font-medium text-gray-800 w-20">
                              {daySlot.day}
                            </span>
                            <span className="text-gray-600 text-sm">
                              {daySlot.startTime && daySlot.endTime
                                ? `${daySlot.startTime} – ${daySlot.endTime}`
                                : "No Time Set"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </td>

                  <td className="p-3 text-gray-700">{slot.slotDuration} min</td>
                  <td className="p-3 text-gray-700">
                    ₹{slot.pricePerSlot ?? "N/A"}
                  </td>

                  <td className="p-3 text-center">
                    {slot.isActive ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-800 hover:bg-gray-100"
                      onClick={() => onEdit(slot)}
                    >
                      <Pencil size={15} className="mr-1 text-gray-600" /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlotList;
