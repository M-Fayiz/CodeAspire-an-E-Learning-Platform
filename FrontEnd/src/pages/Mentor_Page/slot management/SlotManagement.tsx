import ManagementLayout from "@/components/layout/ManagementLayout";
import SlotBookingForm from "@/features/mentor/slots/SlotForm";
import {
  Calendar,
  Calendar1,
  Calendar1Icon,
  LucideCalendar1,
  Plus,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { IMentorSlot } from "../../../types/slot.types";
import { SlotService } from "@/service/mentor/slot.service";
import { useAuth } from "@/context/auth.context";
import slotSchema from "@/schema/slot.schema";
import { convertTo24Hour } from "@/utility/generateTimes.util";
import SlotList from "@/features/mentor/slots/SlotTable";
import { toast } from "sonner";
import type { ISlotDTO } from "@/types/DTOS/slot.dto";
import PaginationRounded from "@/components/ui/Pagination";
import { useSearchPagination } from "@/hooks/useSearchQuery";
import useDebounce from "@/hooks/useDebounce";

const SlotManagement = () => {
  const [formData, setFormData] = useState<IMentorSlot>({
    _id: "",
    courseId: "",
    selectedDays: [
      { day: "Sunday", startTime: "", endTime: "", active: false },
      { day: "Monday", startTime: "", endTime: "", active: false },
      { day: "Tuesday", startTime: "", endTime: "", active: false },
      { day: "Wednesday", startTime: "", endTime: "", active: false },
      { day: "Thursday", startTime: "", endTime: "", active: false },
      { day: "Friday", startTime: "", endTime: "", active: false },
      { day: "Saturday", startTime: "", endTime: "", active: false },
    ],
    mentorId: "",
    slotDuration: 30,
    pricePerSlot: 0,
  });
  const [totalPage, setTotalPage] = useState(1);

  const [formError, setFormError] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const [slot, setSlots] = useState<ISlotDTO[]>([]);
  const { page, search, setPage, setSearch, filter, setFilter } =
    useSearchPagination();
  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debounced = useDebounce(searchInput, 50);
  useEffect(() => {
    setSearch(debounced);
  }, [debounced]);

  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      const data = await SlotService.getMentorSlotList(
        user.id,
        page,
        search,
        filter,
      );
      if (data) setSlots(data.mappedSlots);

      setTotalPage(data.totalPage);
    })();
  }, [user?.id, page, search, filter]);

  //Submit slot form
  const submitSlotForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError({});
    const errors: Record<string, string> = {};

    const courseData = slotSchema.safeParse(formData);

    if (!courseData.success) {
      courseData.error.issues.forEach((err) => {
        const fieldName = err.path.join(".");
        errors[fieldName] = err.message;
      });
      console.log(errors);
      setFormError(errors);
      return;
    }

    const updatedTime = formData.selectedDays.map((slot) => {
      if (slot.startTime && slot.endTime) {
        return {
          ...slot,
          startTime: convertTo24Hour(slot.startTime),
          endTime: convertTo24Hour(slot.endTime),
        };
      }
      return slot;
    });

    const activeDays = updatedTime.filter((d) => d.active);

    if (activeDays.length === 0) {
      errors.selectedDays = "Please enable at least one day.";
    }

    activeDays.forEach((day) => {
      if (!day.startTime || !day.endTime) {
        errors[day.day] = `${day.day}: both start and end times are required.`;
      } else if (day.startTime >= day.endTime) {
        errors[day.day] = `${day.day}: start time must be before end time.`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    try {
      const payload = {
        ...formData,
        mentorId: user?.id,
        selectedDays: updatedTime,
      };

      if (formData._id) {
        const updatedData = await SlotService.updateSlot(payload, formData._id);
        setSlots((prev) =>
          prev.map((slot) =>
            slot._id === updatedData._id ? { ...slot, ...updatedData } : slot,
          ),
        );
        resetForm();
        toast.success("Slot updated successfully!");
      } else {
        const createdData = await SlotService.createSlots(payload);

        setSlots((prev) => [...prev, createdData]);
        resetForm();
        toast.success("Slot created successfully!");
      }

      setIsOpen(false);

      setFormError({});
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const onEdit = (slot: ISlotDTO) => {
    setFormData({
      _id: slot._id,
      courseId: slot.course._id,
      mentorId: slot.mentorId,
      selectedDays: slot.selectedDays,
      slotDuration: slot.slotDuration,
      pricePerSlot: slot.pricePerSlot,
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      _id: "",
      courseId: "",
      selectedDays: [
        { day: "Sunday", startTime: "", endTime: "", active: false },
        { day: "Monday", startTime: "", endTime: "", active: false },
        { day: "Tuesday", startTime: "", endTime: "", active: false },
        { day: "Wednesday", startTime: "", endTime: "", active: false },
        { day: "Thursday", startTime: "", endTime: "", active: false },
        { day: "Friday", startTime: "", endTime: "", active: false },
        { day: "Saturday", startTime: "", endTime: "", active: false },
      ],
      mentorId: user?.id || "",
      slotDuration: 30,
      pricePerSlot: 0,
    });
    setFormError({});
  };

  return (
    <>
      <ManagementLayout
        icon={<Calendar size={40} />}
        description="Manage your slot"
        title="Slot Management"
      >
        <div className="flex flex-col gap-4">
          {/* 🔹 Top Action Bar */}
          <div className="flex items-center justify-between">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Slot
                </Button>
              </DialogTrigger>

              <DialogContent className="!max-w-[90vw] !w-[70vw] md:!max-w-[1200px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Create New Slot</DialogTitle>
                </DialogHeader>

                <form onSubmit={submitSlotForm}>
                  <div className="grid gap-4">
                    <SlotBookingForm
                      formData={formData}
                      setFormData={setFormData}
                      formError={formError}
                    />
                  </div>

                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">
                      {formData._id ? "Update Slot" : "Create Slot"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <div className="flex items-center gap-3">
              {/* 🔹 Day Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-10 rounded-md border bg-white px-3 text-sm outline-none"
              >
                <option value="">All Days</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>

              {/* 🔹 Search */}
              <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 shadow-sm">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search slots..."
                  className="w-64 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div>{slot && <SlotList slots={slot} onEdit={onEdit} />}</div>
        </div>

        <PaginationRounded
          currentPage={page}
          totalPages={totalPage}
          onPageChange={(_, value) => setPage(value)}
        />
      </ManagementLayout>
    </>
  );
};

export default SlotManagement;
