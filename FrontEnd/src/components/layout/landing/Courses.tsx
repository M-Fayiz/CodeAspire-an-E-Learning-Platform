import { Star } from "lucide-react";



const CoursesSection: React.FC = () => {
  const courses = [
    {
      title: "Full-Stack Web Development",
      description: "Master React, Node.js, MongoDB, and modern web technologies",
      duration: "12 weeks",
      level: "Beginner to Advanced",
      students: "15,420",
      rating: 4.9,
      image: "🌐",
      tags: ["React", "Node.js", "MongoDB", "JavaScript"]
    },
    {
      title: "Python & Data Science",
      description: "Learn Python programming and dive into data analysis and machine learning",
      duration: "10 weeks",
      level: "Beginner",
      students: "12,380",
      rating: 4.8,
      image: "🐍",
      tags: ["Python", "Pandas", "NumPy", "Machine Learning"]
    },
    {
      title: "DevOps & Cloud Computing",
      description: "Master AWS, Docker, Kubernetes, and modern deployment strategies",
      duration: "8 weeks",
      level: "Intermediate",
      students: "8,920",
      rating: 4.9,
      image: "☁️",
      tags: ["AWS", "Docker", "Kubernetes", "CI/CD"]
    }
  ];

  return (
    <section id="courses" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Popular Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Carefully crafted curricula designed by industry experts to help you land your dream job.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="p-8">
                <div className="text-6xl mb-4 text-center">{course.image}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h3>
                <p className="text-gray-600 mb-6">{course.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <span>📅 {course.duration}</span>
                  <span>👥 {course.students} students</span>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-2 text-sm font-semibold">{course.rating}</span>
                  </div>
                  <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    {course.level}
                  </span>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 group-hover:from-purple-600 group-hover:to-blue-600">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
};


export default CoursesSection