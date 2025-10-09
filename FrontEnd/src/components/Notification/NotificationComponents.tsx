import   { useState } from "react";
import NotificationItem from "./NotificationItem";

import Taps from "../common/Taps";
import { BellRing ,CheckCheck} from "lucide-react";

import { useNotificationContext } from "@/context/notification.context";
import { Link } from "react-router";





const NotificationDropdown= () => {

const [activeTap,setActiveTap]=useState('Latest')
 

  const {  unreadNotifications, markAsRead,readNotifications } = useNotificationContext();


      const handleTaps = (tap: string) => setActiveTap(tap);
  return (
    <div className="absolute -right-22 md:-right-40 p-4  mt-2 w-70 md:w-120 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
      <div className="max-h-120 overflow-y-auto divide-y divide-gray-100">
        <div className="flex gap-2.5 p-3 ">
          <Taps Click={handleTaps} activeTap={activeTap} label='Latest' tap="Latest" icon={<BellRing className="w-4" />}  />
          <Taps Click={handleTaps} activeTap={activeTap} label='Marked as Read' tap="Marked as Read" icon={<CheckCheck className="w-4" />}  />
        </div>
        {activeTap=='Latest'&&(

        <div>

        {unreadNotifications  ? (
          unreadNotifications.map((notification,ind) => (
            <div 
            key={notification._id}
             onClick={()=>markAsRead(notification._id)}
             >
                <Link to={notification.link as string}>
              <NotificationItem notification={notification} />
            </Link>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 p-4 text-center">
            No new notifications
          </p>
        )}
        </div>
        )}
        {activeTap=='Marked as Read'&&(

        <div>

        {readNotifications  ? (
          readNotifications.map((notification) => (
          <div
            key={notification._id}
            onClick={() => markAsRead(notification._id)}
          >
            
              <NotificationItem notification={notification} />
            
          </div>
        ))

        ) : (
          <p className="text-sm text-gray-500 p-4 text-center">
            No new notifications
          </p>
        )}
        </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
