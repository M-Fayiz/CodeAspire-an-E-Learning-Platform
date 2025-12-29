import Header from "../../components/layout/landing/Header";
import HeroSection from "../../components/layout/landing/Hero";
import CoursesSection from "../../components/layout/landing/Courses";

import StatsSection from "../../components/layout/landing/Stats";
import Footer from "../../components/layout/landing/Footer";
import FeaturesSection from "@/components/layout/landing/Feature";

const Landing = () => {
  return (
    <>
      <div className="w-full">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <CoursesSection />

        <StatsSection />
        <Footer />
      </div>
    </>
  );
};

export default Landing;
