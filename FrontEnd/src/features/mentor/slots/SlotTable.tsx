import React from "react";
import type { IMentorSlot } from "@/types/slot.types"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
import { Pencil, Clock } from "lucide-react";

interface SlotListProps {
  slots: IMentorSlot[];
  onEdit: (slot: IMentorSlot) => void;
  onToggleActive?: (slotId: string, isActive: boolean) => void;
}

const SlotList: React.FC<SlotListProps> = ({ slots, onEdit, onToggleActive }) => {
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
                <th className="p-3 text-left font-medium">Course ID</th>
                <th className="p-3 text-left font-medium">Days</th>
                <th className="p-3 text-left font-medium">Duration</th>
                <th className="p-3 text-left font-medium">Time</th>
                <th className="p-3 text-left font-medium">Price</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {slots.map((slot) => (
                <tr
                  key={slot.courseId + slot.startTime}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-gray-800">{slot.courseId}</td>
                  <td className="p-3 text-gray-700">
                    {slot.selectedDays.join(", ")}
                  </td>
                  <td className="p-3 text-gray-700">{slot.slotDuration} min</td>
                  <td className="p-3 text-gray-700">
                    {slot.startTime} – {slot.endTime}
                  </td>
                  <td className="p-3 text-gray-700">
                    ₹{slot.pricePerSlot ?? "N/A"}
                  </td>
                  <td className="p-3">
                    {/* <Switch
                      checked={slot.isActive ?? false}
                      onCheckedChange={(checked) =>
                        onToggleActive(slot.courseId, checked)
                      }
                    /> */}
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
