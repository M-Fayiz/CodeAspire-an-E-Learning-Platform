
import { Clock } from 'lucide-react';

const MentorApprovalCard = () => {
  return (
    <div className=" mx-auto p-6 bg-white min-h-screen flex items-center justify-center">
      <div className="md:min-w-sm  bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted</h2>
          <p className="text-gray-600">Your request has been saved</p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            Please wait until approval
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row md:gap-3 justify-center items-center space-y-3 text-sm text-gray-500">
          <div className="flex items-center justify-center p-2 gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Request submitted successfully</span>
          </div>
          <div className="flex items-center justify-center p-2 gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Awaiting admin approval</span>
          </div>
          <div className="flex items-center justify-center p-2 gap-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <span>You'll be notified once approved</span>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default MentorApprovalCard;