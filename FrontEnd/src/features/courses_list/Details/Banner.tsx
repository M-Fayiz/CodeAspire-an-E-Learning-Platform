import React from "react";


interface BannerProps {
  title: string;
  description: string;
  imageUrl: string;
}


import { OrderService } from "@/service/order.service";
import { useAuth } from "@/context/auth.context";
import { toast } from "sonner";
import { Link } from "react-router";
import { Badge } from "@/components/ui/shadcn-io/ThemeBadge";

interface BannerProps {
  courseId: string;
  title: string;
  description: string;
  imageUrl: string;
  isEnrolled?: boolean;
}

const Banner: React.FC<BannerProps> = ({
  title,
  description,
  imageUrl,
  isEnrolled,
  courseId,
}) => {
  const { user } = useAuth();

  const handlePaymentPage = async () => {
    try {
      const result = await OrderService.createPayment(courseId, user!.id);

      if (result) {
        window.location.href = result.checkoutURL;
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="relative w-full py-5 px-6 md:px-16 lg:px-24">
      <Badge label={}/>


  <div className="flex flex-col md:flex-row justify-between items-center relative gap-10">
    <div className="relative flex-1 p-5">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-snug">
        {title}
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        {description}
        {
          "Another productive way to use this tool to begin a daily writing routine. One way is to generate a random paragraph with the intention to try to rewrite it while still keeping the original meaning"
        }
      </p>

      {isEnrolled ? (
        <Link
          to={`/learner/enrolled-courses`}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          Continue learning
        </Link>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handlePaymentPage}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            Enroll Now
          </button>
          <button className="border border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold px-6 py-3 rounded-lg transition">
            See Curriculum
          </button>
        </div>
      )}
    </div>

    <div className="relative flex-1 max-w-md">
      <img
        src={imageUrl}
        alt="Course preview"
        className="w-full object-cover rounded-lg shadow-lg relative z-10"
      />
    </div>
  </div>
</div>

  );
};

export default Banner;
