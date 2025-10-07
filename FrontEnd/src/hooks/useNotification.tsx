import { useSocket } from "@/context/socket.context"
// import type { INotification } from "@/types/notification.types"
import { useEffect, } from "react"
import { toast } from "sonner";



export const Notification=()=>{
     const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: { message: string }) => {
      console.log("Received notification:", data);
      toast.success(data.message);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);
  return null
}