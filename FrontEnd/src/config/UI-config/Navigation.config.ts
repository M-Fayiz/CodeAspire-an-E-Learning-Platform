import { Activity, Award, Layers, Book, BookOpen, Calendar, CreditCard, FileText, HelpCircle, Home, MessageSquare, PlusCircle, Settings, Shield, ShoppingCart, Star, Users, BarChart3 } from "lucide-react";
import React from "react";

export interface NavigationItem {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
  badge?: number;
}


export const navigationConfig = {
  admin: {
    primary: [
      { icon: Home, label: 'Dashboard', path: '/admin/dashboard', active: true },
      { icon: Users, label: 'User Management', path: '/admin/users' , },
      { icon: Book, label: 'Course Management', path: '/course/courses',  },
      { icon: Layers, label: 'Category Management', path: '/admin/category' , },
      { icon: MessageSquare, label: 'Messages', path: '/admin/messages', },
      { icon: Settings, label: 'System Settings', path: '/admin/settings',  }
    ],
    secondary: [
      { icon: FileText, label: 'Reports', path: '/admin/reports' },
      { icon: CreditCard, label: 'Billing', path: '/admin/billing' },
      { icon: Shield, label: 'Security', path: '/admin/security' },
      { icon: HelpCircle, label: 'Support', path: '/admin/support' }
    ]
  },
  learner: {
    primary: [
      { icon: Home, label: 'Dashboard', path: '/learner/dashboard', active: true },
      { icon: BookOpen, label: 'My Courses', path: '/learner/courses' },
      { icon: Calendar, label: 'Schedule', path: '/learner/schedule' },
      { icon: Award, label: 'Certificates', path: '/learner/certificates', badge: 3 },
      { icon: MessageSquare, label: 'Messages', path: '/learner/messages', badge: 2 },
      { icon: Activity, label: 'Progress', path: '/learner/progress' }
    ],
    secondary: [
      { icon: ShoppingCart, label: 'Course Store', path: '/learner/store' },
      { icon: Star, label: 'Favorites', path: '/learner/favorites' },
      { icon: Settings, label: 'Settings', path: '/learner/settings' },
      { icon: HelpCircle, label: 'Help', path: '/learner/help' }
    ]
  },
  mentor: {
    primary: [
      { icon: Home, label: 'Dashboard', path: '/mentor/dashboard',  },
      { icon: Book, label: 'My Courses', path: '/mentor/courses' },
      { icon: Users, label: 'Students', path: '/mentor/students' },
      { icon: PlusCircle, label: 'Create Course', path: '/mentor/create' },
      { icon: MessageSquare, label: 'Messages', path: '/mentor/messages', badge: 8 },
      { icon: BarChart3, label: 'Analytics', path: '/mentor/analytics' }
    ],
    secondary: [
      { icon: Calendar, label: 'Schedule', path: '/mentor/schedule' },
      { icon: CreditCard, label: 'Earnings', path: '/mentor/earnings' },
      { icon: Star, label: 'Reviews', path: '/mentor/reviews' },
      { icon: Settings, label: 'Settings', path: '/mentor/settings' },
      { icon: HelpCircle, label: 'Help', path: '/mentor/help' }
    ]
  }
};
