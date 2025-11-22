import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function DashboardCard({ title, value }) {
  // Different gradient for each card based on title
  const getGradientClass = (title) => {
    if (title.includes("Packets Per Second")) {
      return "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-500";
    } else if (title.includes("UDP")) {
      return "bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-500";
    } else if (title.includes("TCP")) {
      return "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-500";
    }
    return "bg-gradient-to-r from-purple-500 to-pink-500";
  };

  // Matching color for the number based on card type
  const getNumberColor = (title) => {
    if (title.includes("Packets Per Second")) {
      return "text-blue-600 dark:text-blue-400";
    } else if (title.includes("UDP")) {
      return "text-orange-600 dark:text-orange-400";
    } else if (title.includes("TCP")) {
      return "text-green-600 dark:text-green-400";
    }
    return "text-foreground";
  };

  return (
    <Card className="flex-1 font-mono min-w-[200px] hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader>
        <CardTitle 
          className={`text-left text-lg font-extrabold text-transparent bg-clip-text ${getGradientClass(title)} animate-gradient-x`}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={`text-left ${getNumberColor(title)}`}>
        <span className="text-5xl font-bold tracking-tight" style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>
          {value}
        </span>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;