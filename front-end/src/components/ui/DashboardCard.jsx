// DashboardCard.jsx (Updated version)
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function DashboardCard({ title, value }) {
  return (
    <Card className="flex-1 font-mono min-w-[200px]">
      <CardHeader>
        <CardTitle className="text-slate-500 dark:text-slate-400 text-left">{title}</CardTitle>
      </CardHeader>
      <CardContent className="font-bold text-3xl text-left text-foreground">{value}</CardContent>
    </Card>
  );
}

export default DashboardCard;