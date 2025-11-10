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
import {  useEffect, useState } from "react";
import type { IMentorSlot } from "../../../types/slot.types";
import { SlotService } from "@/service/mentor/slot.service";
import { useAuth } from "@/context/auth.context";
import slotSchema from "@/schema/slot.schema";
import { convertTo12Hour, convertTo24Hour } from "@/utility/generateTimes.util";
import SlotList from "@/features/mentor/slots/SlotTable";
import { toast } from "sonner";

const SlotManagement = () => {
  const [formData, setFormData] = useState<IMentorSlot>({
    _id:'',
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
  const [slot,setSlots]=useState<IMentorSlot[]>([])
  const [isOpen,setIsOpen]=useState(false)

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
    
        const start24 = convertTo24Hour(formData.startTime);
    const end24 = convertTo24Hour(formData.endTime);

    if (end24 < start24) {
      errors.startTime = "Please select a valid time range.";
      errors.endTime = "Please select a valid time range.";
      setFormError(errors);
      return;
    }
    
        
    if(formData._id){
      try {
        const updatedData=await SlotService.updateSlot({...formData,
        startTime: start24,
        endTime: end24,
        mentorId: user?.id,
      },formData._id)
        setFormError({})
       setSlots((prev) =>
          prev.map((slot) =>
            slot._id === updatedData._id ? { ...slot, ...updatedData } : slot
          )
        );
        setIsOpen(false)
        resetForm()
        return
      } catch (error) {
        if(error instanceof Error){
        toast.error(error.message)
      }
      }
      
      
    }


    try {
       const { _id, ...createData } = formData;
      const createdData = await SlotService.createSlots({
        ...createData,
        startTime: start24,
        endTime: end24,
        mentorId: user?.id,
      });
      setFormError({})
      resetForm()
      setIsOpen(false)
     setSlots((prev) => [...prev, createdData]);

    } catch (error) {
      if(error instanceof Error){
        toast.error(error.message)
      }
    }
  };
  const onEdit=(slot:IMentorSlot)=>{
    
    setFormData({
      _id:slot._id,
      courseId:slot.courseId,
      mentorId:slot.mentorId,
      selectedDays:slot.selectedDays,
      slotDuration:slot.slotDuration,
      pricePerSlot:slot.pricePerSlot,
      startTime:convertTo12Hour(slot.startTime),
      endTime:convertTo12Hour(slot.endTime)
    })
    setIsOpen(true)
  }

  const resetForm = () => {
  setFormData({
    _id: '',
    courseId: "",
    selectedDays: [],
    mentorId: user?.id || "",
    slotDuration: 30,
    pricePerSlot: 0,
    startTime: "",
    endTime: "",
  });
  setFormError({});
};


  return (
    <>
      <ManagementLayout description="mange your slot " title="slot management">
        <div className="flex flex-col gap-2.5"> 
        <div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                  <Button type="submit">
  {formData._id ? "Update Slot" : "Create Slot"}
</Button>

                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          {slot&&(
          <SlotList slots={slot} onEdit={onEdit} />
          )}
        </div>
        </div>
      </ManagementLayout>
    </>
  );
};

export default SlotManagement;
