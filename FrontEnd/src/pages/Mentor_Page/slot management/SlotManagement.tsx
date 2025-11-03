import ManagementLayout from "@/components/layout/ManagementLayout"
import SlotBookingForm from "@/features/mentor/slots/SlotForm"

const SlotManagement=()=>{
    return(
        <>
        <ManagementLayout description="mange your slot "  title="slot management">
                <SlotBookingForm/>
        </ManagementLayout>
        </>
    )
}

export default SlotManagement
