import { GraduationCap, Users, Shield, icons } from "lucide-react";

export const roleConfig = {
  learner: {
    title: "Join as Student",
    subtitle: "Master cutting-edge technologies with interactive courses",
    icon: GraduationCap,
    color: "from-blue-500 to-white-100",
    illustration: "/illustration/3d-learner.png",
    message:
      "Start your journey to become a Full-Stack Developer. Learn at your own pace with hands-on projects.",
    features: ["Interactive Courses", "Real-world Projects", "Career Support"],
  },
  mentor: {
    title: "Join as Mentor",
    subtitle: "Share your expertise and guide the next generation",
    icon: Users,
    color: "from-white to-blue-500",
    illustration: "/illustration/mentor2.png",
    message:
      "Share your knowledge and help students achieve their tech dreams. Make an impact in the developer community.",
    features: ["Teach Students", "Flexible Schedule", "Earn Income"],
  },
};

export const loginFeatur = {
  login: {
    title: "Login",
    subtitle: "Manage platform and oversee operations",
    icons: Shield,
    color: "from-sky-600 to-sky-200",
    illustration: "/illustration/login.jpeg",
    message:
      "Administrative access to manage the platform, courses, and user experiences.",
  },
};
