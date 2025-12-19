import {
  Award,
  Layers,
  Book,
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  MessageSquare,
  Settings,
  Shield,
  ShoppingCart,
  Users,
  CalendarDays,
  // BarChart3,
} from "lucide-react";
import React from "react";

export interface NavigationItem {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
  badge?: number;
}

const navigationConfig = {
  admin: {
    primary: [
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
      { icon: Settings, label: "System Settings", path: "/admin/settings" },
    ],
    secondary: [
      { icon: FileText, label: "Reports", path: "/admin/reports" },
      { icon: CreditCard, label: "Billing", path: "/admin/billing" },
      { icon: Shield, label: "Security", path: "/admin/security" },
      { icon: HelpCircle, label: "Support", path: "/admin/support" },
    ],
  },
  learner: {
    primary: [
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
      // { icon: Calendar, label: "Schedule", path: "/learner/schedule" },
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
    secondary: [
      { icon: ShoppingCart, label: "Course Store", path: "/learner/store" },
    ],
  },
  mentor: {
    primary: [
      { icon: Home, label: "Dashboard", path: "/mentor/dashboard" },
      { icon: Book, label: "My Courses", path: "/mentor/courses/my-courses" },
      { icon: Users, label: "Students", path: "/mentor/students" },
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
      // {
      //   icon: PlusCircle,
      //   label: "Create Course",
      //   path: "/mentor/courses/create",
      // },
      {
        icon: MessageSquare,
        label: "Messages",
        path: "/mentor/chats",
       
      },
      // { icon: BarChart3, label: "Analytics", path: "/mentor/analytics" },
    ],
    secondary: [
      // { icon: Calendar, label: "Schedule", path: "/mentor/schedule" },
      // { icon: CreditCard, label: "Earnings", path: "/mentor/earnings" },
      // { icon: Star, label: "Reviews", path: "/mentor/reviews" },
      // { icon: Settings, label: "Settings", path: "/mentor/settings" },
      // { icon: HelpCircle, label: "Help", path: "/mentor/help" },
    ],
  },
};

export default navigationConfig;
