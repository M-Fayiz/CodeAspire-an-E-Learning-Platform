import { BookOpen, Users, Award, Clock } from "lucide-react";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Interactive Courses",
      description:
        "Learn by doing with hands-on projects, coding challenges, and real-world scenarios.",
    },

    {
      icon: Users,
      title: "Mentor Support",
      description:
        "Join thousands of learners, share knowledge, and grow together in our vibrant community.",
    },
    {
      icon: Award,
      title: "Industry Certificates",
      description:
        "Earn recognized certificates that showcase your skills to potential employers.",
    },
    {
      icon: Clock,
      title: "Flexible Learning",
      description:
        "Study at your own pace with lifetime access to all course materials and updates.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose CodeAspire?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine cutting-edge technology with proven teaching methods to
            give you the best learning experience possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center">
                <div
                  className={`w-16 h-16 bg-gradient-to-r  rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
