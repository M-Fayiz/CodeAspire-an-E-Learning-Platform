import { Types } from "mongoose";
import { INotification } from "../types/notification.types";

export const NotificationTemplates = {
  courseApproval: (userId: Types.ObjectId, title: string): INotification => ({
    title: `Course Approval`,
    message: `Your course "${title}" has been approved by the authority.`,
    type: "success",
    isRead: false,
    userId,
    link: "/mentor/",
    createdAt: new Date(),
  }),
  courseRejection: (
    userId: Types.ObjectId,
    title: string,
    feedback: string,
  ): INotification => ({
    title: `Course Rejection`,
    message: `Your course "${title}" has been rejected by the authority. \n due to ${feedback}`,
    type: "error",
    isRead: false,
    userId,
    link: `/mentor/courses/my-courses`,
    createdAt: new Date(),
  }),
  mentorRequest: (
    userId: Types.ObjectId,
    userName: string,
    mentorId: Types.ObjectId,
  ): INotification => ({
    userId,
    message: `${userName} has requested mentor approval.`,
    title: "New Mentor Request",
    type: "info",
    isRead: false,
    link: `/admin/user-profile/${mentorId}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  mentorApproval: (mentorId: Types.ObjectId): INotification => ({
    userId: mentorId,
    message: `we approved your mentor request. You can now create courses.`,
    title: "Mentor Request Approved",
    type: "success",
    isRead: false,
    link: `/mentor/courses/create`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  mentorReject: (mentorId: Types.ObjectId, message: string): INotification => ({
    userId: mentorId,
    message: `we rejected  your mentor request due to ${message}`,
    title: "Mentor Request rejected",
    type: "error",
    isRead: false,
    link: ``,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  JoinNowSession: (userId: Types.ObjectId, ): INotification => ({
    userId: userId,
    message: `Your session  is live now. please join the session.`,
    title: "Join Now - Live Session Started",
    type: "info",
    isRead: false,
    link: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),

};
