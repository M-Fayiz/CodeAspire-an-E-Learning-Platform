import { Target, Users, Globe, Star } from "lucide-react";

const StatsSection: React.FC = () => {
  const stats = [
    { number: "50,000+", label: "Students Enrolled", icon: Users },
    { number: "95%", label: "Job Placement Rate", icon: Target },
    { number: "500+", label: "Partner Companies", icon: Globe },
    { number: "4.9/5", label: "Average Rating", icon: Star },
  ];

  return (
    <section className="py-20 bg-white-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4  text-gray-700 ">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Join a community of successful developers who have transformed their
            careers with CodeAspire.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-500 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
