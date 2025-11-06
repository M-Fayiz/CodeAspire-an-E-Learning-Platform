import ManagementLayout from "@/components/layout/ManagementLayout";
import SlotBookingForm from "@/features/mentor/slots/SlotForm";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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

const SlotManagement = () => {
  const [formData, setFormData] = useState<IMentorSlot>({
    courseId: "",
    selectedDays: [],
    mentorId: "",
    slotDuration: 30,
    pricePerSlot: 0,
    startTime: "",
    endTime: "",
  });
  const [formError, setFormError] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const [slot,setSlots]=useState<IMentorSlot[]|null>(null)

    useEffect(()=>{
      (async()=>{
        const data= await SlotService.getMentorSlotList(user!.id)
        if(data){
          setSlots(data)
        }
      })()
    },[])
  const submitSlotForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    const courseData = slotSchema.safeParse(formData);

    if (!courseData.success) {
      courseData.error.issues.forEach((err) => {
        const fieldName = err.path.join(".");
        errors[fieldName] = err.message;
      });
      setFormError(errors);
      return;
    }
    formData.startTime = convertTo24Hour(formData.startTime);
    formData.endTime = convertTo24Hour(formData.endTime);

    if (formData.endTime < formData.startTime) {
      errors.startTime = "please select Valid Time Format";
      errors.endTime = "please select Valid Time Format";
      setFormError(errors);
      return;
    }

    const createdData = await SlotService.createSlots({
      ...formData,
      mentorId: user?.id,
    });
    setFormError({})
    console.log("created :", createdData);
  };

  return (
    <>
      <ManagementLayout description="mange your slot " title="slot management">
        <div className="flex flex-col gap-2.5"> 

        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus />
                Create Slot
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Slot</DialogTitle>
                <DialogDescription></DialogDescription>
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
                  <Button type="submit">Create Slot</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          {slot&&(

          <SlotList slots={slot} />
          )}
        </div>
        </div>
      </ManagementLayout>
    </>
  );
};

export default SlotManagement;
