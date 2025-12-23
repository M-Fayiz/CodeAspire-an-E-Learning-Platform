import Header from "../../components/layout/landing/Header";
import HeroSection from "../../components/layout/landing/Hero";
import CoursesSection from "../../components/layout/landing/Courses";
import MockInterviewSection from "../../components/layout/landing/MockInterview";
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
        <MockInterviewSection />
        <StatsSection />
        <Footer />
      </div>
    </>
  );
};

export default Landing;
