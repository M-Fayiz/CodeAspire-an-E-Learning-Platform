import type { UserRoleType } from "@/types/auth.types";
import {
  Award,
  Layers,
  Book,
  BookOpen,
  Home,
  MessageSquare,
  Users,
  CalendarDays,
  History,
} from "lucide-react";
import React from "react";

export interface NavigationItem {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
  badge?: number;
}

const navigationConfig: Record<UserRoleType, NavigationItem[]> = {
  admin: [
    {
      icon: Home,
      label: "Dashboard",
      path: "/admin/dashboard",
      active: true,
    },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: Book, label: "Course Management", path: "/admin/courses" },
    { icon: Layers, label: "Category Management", path: "/admin/category" },
    { icon: MessageSquare, label: "Messages", path: "/admin/chats" },
    { icon: History, label: "Transaction History", path: "/admin/transactions" },
  ],

  learner: [
    {
      icon: Home,
      label: "Dashboard",
      path: "/learner/dashboard",
      active: true,
    },
    {
      icon: BookOpen,
      label: "My Courses",
      path: "/learner/enrolled-courses",
    },

    {
      icon: Award,
      label: "Certificates",
      path: "/learner/my-certificate",
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/learner/chats",
    },

    { icon: CalendarDays, label: "Slots", path: "/learner/booked-slots" },
  ],

  mentor: [
    { icon: Home, label: "Dashboard", path: "/mentor/dashboard" },
    { icon: Book, label: "My Courses", path: "/mentor/courses" },

    {
      icon: CalendarDays,
      label: "Slots Management",
      path: "/mentor/slot-management",
    },
    {
      icon: CalendarDays,
      label: "Booked Slots",
      path: "/mentor/booked-slot-list",
    },

    {
      icon: MessageSquare,
      label: "Messages",
      path: "/mentor/chats",
    },
     { icon: History, label: "Transaction History", path: "/mentor/transactions" },
  ],
};

export default navigationConfig;
