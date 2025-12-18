import { createBrowserRouter, Navigate, Outlet } from "react-router";

import Landing from "@/pages/Landing page/Landing";

// Auth Components
import LoginPage from "../pages/Auth Page/LoginPage";
import SignupPage from "../pages/Auth Page/SignupPage";
import VerifyEmail from "../components/auth-components/verifyEmail";
import ForgotPassword from "../components/auth-components/ForgotPassword";
import ResetPassword from "../components/auth-components/ResetPassword";
import NotFound from "../pages/not-found/Not-Found";
import ErrorFallback from "../components/common/ErrorFallback";
import DynamicLayout from "../pages/Daynamic-Layout/Dynamic-Dashboard";
import AdminDashboard from "../components/layout/dynamic-layout/AdminDashboard";
import { Protected_Router } from "../components/protectedRouter/ProtectedRouter";
import ProfileManagement from "../pages/Profile Page/Profile";
import UserManagement from "../pages/Admin Page/user-management/UserMangement";
import AdminUserProfile from "../pages/Admin Page/user-management/UserProfile";
import MentorDataForm from "../components/auth-components/MentorInformation";
import CategoryManagement from "@/pages/Admin Page/category";
import CourseCreation from "@/pages/Mentor_Page/course_creation/Index";
import CourseLayout from "@/pages/Course/CourseList";
import CourseFormProvider from "@/context/courseForm.context";
import CourseManagement from "@/pages/Admin Page/Course-Managemenr/CourseManagement";
import MYCourses from "@/pages/Mentor_Page/course_creation/MyCourses";
import AdminCourseDetails from "@/pages/Admin Page/Course-Managemenr/AdminCourseDetails";
import CourseDetails from "@/pages/Course/CourseDetails";
import PaymentSuccess from "@/pages/Payment page/PaymentSuccess";
import CourseEnrolledList from "@/pages/Course/CourseEnrolledList";
import EnrolledCourseDetails from "@/pages/Course/EnrolledDetails";
import CourseDashboard from "@/pages/Mentor_Page/course_creation/CourseDashboard";
import MentorDashboard from "@/pages/Mentor_Page/mentor dashboard/MentorDashboard";
import ChatPage from "@/pages/chat page/ChatPage";
import SlotManagement from "@/pages/Mentor_Page/slot management/SlotManagement";
import SlotBooking from "@/pages/Slots/MentorSlot";
import { VideoRoom } from "@/pages/Video Session Page/VideoSession";

import LearnerBookedSlots from "@/pages/Slots/LearnersBooked";
import MentorBookedSlots from "@/pages/Slots/MentorsBooked";
import CertificatesList from "@/pages/certificate page/ListCertificatePage";
import LearnerDashboard from "@/pages/learner page/Learner-Dashboard";

function Form_Courses_Provider() {
  return (
    <CourseFormProvider>
      <Outlet />
    </CourseFormProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorFallback />,
  },
  {
    path: "/auth",
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <Navigate to="login" /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  // LEARNER ROUTES
  {
    path: "/learner",
    element: (
      <Protected_Router requiredRole={["learner"]}>
        <DynamicLayout />
      </Protected_Router>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <LearnerDashboard /> },
      { path: "profile/:id", element: <ProfileManagement /> },
      { path: "courses", element: <CourseLayout /> },
      { path: "enrolled-courses", element: <CourseEnrolledList /> },
      { path: "enrolled-courses/:id", element: <EnrolledCourseDetails /> },
      { path: "chats", element: <ChatPage /> },
      { path: "slot-booking/:courseId", element: <SlotBooking /> },
      { path: "booked-slots", element: <LearnerBookedSlots /> },
      { path: "video-session/:bookingId", element: <VideoRoom /> },
      { path: "my-certificate", element: <CertificatesList /> },
    ],
  },
  // MENTOR ROUTES
  {
    path: "/mentor",
    element: (
      <Protected_Router requiredRole={["mentor"]}>
        <DynamicLayout />
      </Protected_Router>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <MentorDashboard /> },
      { path: "profile/:id", element: <ProfileManagement /> },
      { path: "data", element: <MentorDataForm /> },
      { path: "chats", element: <ChatPage /> },
      { path: "slot-management", element: <SlotManagement /> },
      { path: "booked-slot-list", element: <MentorBookedSlots /> },
      { path: "video-session/:bookingId", element: <VideoRoom /> },
      {
        path: "courses",
        element: <Form_Courses_Provider />,
        children: [
          { path: "my-courses", element: <MYCourses /> },
          { path: "create", element: <CourseCreation /> },
          { path: "dashboard/:id", element: <CourseDashboard /> },
        ],
      },
    ],
  },
  // ADMIN ROUTES
  {
    path: "/admin",
    element: (
      <Protected_Router requiredRole={["admin"]}>
        <DynamicLayout />
      </Protected_Router>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "profile/:id", element: <ProfileManagement /> },
      { path: "users", element: <UserManagement /> },
      {
        path: "user-profile/:userId",
        element: <AdminUserProfile />,
      },
      { path: "category", element: <CategoryManagement /> },
      { path: "courses", element: <CourseManagement /> },
      { path: "courses/:id", element: <AdminCourseDetails /> },
      { path: "chats", element: <ChatPage /> },
    ],
  },
  {
    path: "/course",
    children: [
      {
        path: "create",
        element: (
          <Protected_Router requiredRole={["mentor"]}>
            <CourseCreation />
          </Protected_Router>
        ),
      },
    ],
  },

  {
    path: "/courses",
    element: <Outlet />,
    children: [
      { index: true, element: <CourseLayout /> },
      { path: ":id", element: <CourseDetails /> },
      { path: "payment-success", element: <PaymentSuccess /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
