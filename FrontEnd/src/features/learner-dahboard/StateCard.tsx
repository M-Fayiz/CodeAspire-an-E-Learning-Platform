import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardContent className="p-4 sm:p-5 md:p-6">
        <p className="text-xs sm:text-sm text-gray-500">
          {title}
        </p>

        <h2 className="mt-1 sm:mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          {value}
        </h2>
      </CardContent>
    </Card>
  );
};


export default StatsCard;
