import Header from "../../components/layout/landing/header";
import HeroSection from "../../components/layout/landing/Hero";
import FeaturesSection from "../../components/layout/landing/feature";
import CoursesSection from "../../components/layout/landing/Courses";
import MockInterviewSection from "../../components/layout/landing/MockInterview";
import StatsSection from "../../components/layout/landing/Stats";
import Footer from "../../components/layout/landing/Footer";
// import { jwtDecode } from "jwt-decode";

const Landing = () => {
  // const params = new URLSearchParams(window.location.search);
  // const accessToken = params.get("token");
  // if (accessToken) {

  //   // console.log('jwt user',user)
  // }
  return (
    <>
      <div className="min-h-screen">
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
