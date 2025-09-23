import React, { useEffect, useRef, useState } from "react";
// import ColorThief from "colorthief";

interface BannerProps {
  title: string;
  description: string;
  imageUrl: string;
}

import { Play } from "lucide-react";
// import { useNavigate } from "react-router";
import { OrderService } from "@/service/client-API/order.service";
import { useAuth } from "@/context/auth.context";
import { toast } from "sonner";

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
    // navigate(`/courses/checkout/${courseId}`);
    console.log("enrolled status :", isEnrolled);
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
    <div className="relative w-full  rounded-4xl bg-gradient-to-br from-blue-200 via-violet-50  to-blue-50  py-5 px-6 md:px-16 lg:px-24">
      <div className="flex flex-col md:flex-row justify-between items-center relative gap-10">
        <div className="relative flex-1 p-5">
          <div className="absolute top-10  left-10 w-60 h-60 bg-blue-200 rounded-full blur-3xl -z-10"></div>

          <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-6 leading-snug">
            {title}
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            {description}
            {
              "Another productive way to use this tool to begin a daily writing routine. One way is to generate a random paragraph with the intention to try to rewrite it while still keeping the original meaning"
            }
          </p>
          {isEnrolled && (
            <button
              // onClick={handlePaymentPage}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
            >
              Continue learing
            </button>
          )}
          {!isEnrolled && (
            <div className="flex gap-2">
              <button
                onClick={handlePaymentPage}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
              >
                Enroll Now
              </button>
              <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition">
                See Curriculum
              </button>
            </div>
          )}
        </div>

        <div className="relative flex-1 max-w-md">
          <img
            src={imageUrl}
            alt="Course preview"
            className="w-full object-cover rounded-lg shadow-lg"
          />
          {!isEnrolled && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-5 shadow-lg transition">
                <Play className="w-8 h-8 text-blue-500 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
