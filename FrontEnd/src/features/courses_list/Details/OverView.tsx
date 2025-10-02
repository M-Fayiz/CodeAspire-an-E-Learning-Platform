

const CourseOverview = () => {
  return (
    <section className=" py-10 px-6 md:px-12 p-5  rounded-xl ">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Learning Objectives
      </h2>

      <ul className="space-y-3 mb-10 list-disc list-inside text-grey-500 leading-relaxed">
        {`"Acquire technical skills, including HTML, CSS, JavaScript, and relevant programming languages
    Develop and complete web development projects and interactive applications
    Enhance problem-solving abilities, including debugging and troubleshooting code.
    Master both front-end and back-end development concepts.
    Apply industry best practices, such  responsive design and accessibility"`}
      </ul>

      {/* Course Overview */}
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Course Overview</h2>
      <ul className="space-y-4 text-gray-600">
        {`"Introduction to Web Technologies",
    "Hands-on projects to build your portfolio"`}
      </ul>
    </section>
  );
};

export default CourseOverview;
