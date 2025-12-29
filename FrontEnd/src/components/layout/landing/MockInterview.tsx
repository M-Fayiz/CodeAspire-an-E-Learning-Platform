import { CheckCircle, Users } from "lucide-react";

const MockInterviewSection: React.FC = () => {
  return (
    <section
      id="interviews"
      className="py-20 bg-gradient-to-r from-orange-600 to-amber-600 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ace Your Next Interview
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              Practice with real industry professionals and get personalized
              feedback to boost your confidence and land your dream job.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "1-on-1 sessions with senior engineers",
                "Real interview questions from top companies",
                "Detailed feedback and improvement tips",
                "Flexible scheduling that fits your timeline",
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>

            <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Book Your Mock Interview
            </button>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Mock Interview Session</div>
                    <div className="text-sm text-orange-200">
                      with Alex Johnson, Senior SWE @ Google
                    </div>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-orange-200 mb-2">
                    Current Question:
                  </div>
                  <div className="font-medium">
                    "Implement a function to reverse a linked list"
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">45:32</div>
                    <div className="text-sm text-orange-200">
                      Time Remaining
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">3/5</div>
                    <div className="text-sm text-orange-200">
                      Questions Done
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MockInterviewSection;
