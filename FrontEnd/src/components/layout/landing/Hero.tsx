import { useState, useEffect } from "react";
import { ArrowRight, Play, Star } from "lucide-react";

const HeroSection: React.FC = () => {
  const [currentText, setCurrentText] = useState(0);
  const texts = [
    "Software Engineer",
    "Full-Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

 return (
  <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-gray-50 overflow-hidden">
    {/* Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Section */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-6">
            🚀 Launch Your Tech Career Today
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Become a{" "}
            <span className="bg-gradient-to-r from-[#FF7A00] to-[#FF3D00] bg-clip-text text-transparent">
              {texts[currentText]}
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Master cutting-edge technologies with interactive courses,
            real-world projects, and mock interviews. Your dream tech job
            is just one click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="group bg-gradient-to-r from-[#FF7A00] to-[#FF3D00] text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center">
              Start Learning Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="group flex items-center justify-center px-8 py-4 border-2 border-gray-400 rounded-full text-lg font-semibold text-gray-800 hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all duration-300">
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center lg:justify-start mt-8 space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Job Success</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative">
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            {/* Terminal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm text-white-500">Live Coding Session</span>
            </div>

            {/* Terminal */}
            <div className="bg-black rounded-lg p-4 font-mono text-sm">
              <div className="text-orange-400">$ npm create react-app my-project</div>
              <div className="text-gray-300 mt-2">Creating a new React app...</div>
              <div className="text-amber-400 mt-1">✨ Success! Your app is ready.</div>
            </div>

            {/* Instructor Info */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FF7A00] to-[#FF3D00] rounded-full"></div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Sarah Chen</div>
                  <div className="text-xs text-gray-500">Senior Instructor</div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          {/* <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#FF7A00] to-orange-300 text-white px-4 py-2 rounded-full text-sm font-semibold animate-bounce">
            Live Now!
          </div> */}
          {/* <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-[#FF3D00] to-orange-300 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
            1,234 Online
          </div> */}
        </div>
      </div>
    </div>
  </section>
);

};

export default HeroSection;
