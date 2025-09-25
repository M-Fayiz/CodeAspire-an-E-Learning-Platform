import React, { useState } from "react";
import { Star } from "lucide-react";

type StarRatingProps = {
  max?: number;
  onRate: (value: number) => void; 
  starRating:number
};

const StarRating: React.FC<StarRatingProps> = ({ max = 5, onRate,starRating }) => {
  const [rating, setRating] = useState(starRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value: number) => {
    setRating(value);
    onRate(value); 
  };

  return (
    <div className="flex gap-2 cursor-pointer">
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={starValue}
            size={28}
            className={`transition-colors ${
              starValue <= (hover || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => handleClick(starValue)} 
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
