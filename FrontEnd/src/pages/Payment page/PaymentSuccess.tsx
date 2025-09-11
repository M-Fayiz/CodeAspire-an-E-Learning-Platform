import React from "react";
import { CheckCircle, Download, Calendar, Mail } from "lucide-react";
import { Link } from "react-router";

interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  thumbnail: string;
}

interface PaymentSuccessProps {
  transactionId?: string;
  amount?: number;
  course?: Course;
  purchaseDate?: string;
  email?: string;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  transactionId = "TXN-12345678",
  amount = 149.99,
  course = {
    id: "course-001",
    title: "Complete Web Development Bootcamp",
    instructor: "Sarah Johnson",
    duration: "40 hours",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
  },
  purchaseDate = new Date().toLocaleDateString(),
  email = "student@example.com",
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your purchase. You now have access to your course.
          </p>
          <div className="inline-flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            Transaction ID: {transactionId}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Course Details
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full sm:w-32 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-2">by {course.instructor}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {course.duration}
                </span>
                <span className="font-semibold text-gray-900">
                  ${amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Purchase Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Course Price:</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">$0.00</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Paid:</span>
              <span>${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Purchase Date:</span>
              <span>{purchaseDate}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Receipt sent to:</span>
              <span>{email}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to={"/learner/enrolled-courses"}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Start Learning
            </Link>
            <button className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
              Download Receipt
            </button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Check your email for course access instructions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Your course is now available in your dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <Download className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Download course materials and resources</span>
            </li>
          </ul>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Need help?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
