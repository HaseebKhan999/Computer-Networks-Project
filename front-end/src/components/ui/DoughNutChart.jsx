import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughNutChart() {
  const [counts, setCounts] = useState({
    TCP: 0,
    UDP: 0,
    HTTPS: 0,
    DNS: 0,
    HTTP: 0,
    Unknown: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:8000/api/packets/recent/", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          const newCounts = {
            TCP: 0,
            UDP: 0,
            HTTPS: 0,
            DNS: 0,
            HTTP: 0,
            Unknown: 0,
          };

          data.forEach((pkt) => {
            // Count transport layer
            const proto = pkt.protocol.toUpperCase();
            if (proto === "TCP") newCounts.TCP++;
            else if (proto === "UDP") newCounts.UDP++;

            // Count application layer
            const app = pkt.app_layer.toUpperCase();
            if (newCounts[app] !== undefined) newCounts[app]++;
            else newCounts.Unknown++;
          });

          setCounts(newCounts);
        })
        .catch((err) => console.error(err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: ["TCP", "UDP", "HTTPS", "DNS", "HTTP", "Unknown"],
    datasets: [
      {
        label: "Packets",
        data: [
          counts.TCP,
          counts.UDP,
          counts.HTTPS,
          counts.DNS,
          counts.HTTP,
          counts.Unknown,
        ],
        backgroundColor: [
          "#3b82f6", // TCP - Blue
          "#f97316", // UDP - Orange
          "#4ade80", // HTTPS - Green
          "#60a5fa", // DNS - Light Blue
          "#facc15", // HTTP - Yellow
          "#f87171", // Unknown - Red
        ],
        borderColor: [
          "#3b82f6",
          "#f97316",
          "#4ade80",
          "#60a5fa",
          "#facc15",
          "#f87171",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-[400px] h-[450px] py-10 mx-auto rounded-lg border border-gray-300 bg-white shadow-md transition-shadow hover:shadow-lg">
      <Doughnut data={chartData}  options={{cutout:'70%'}}/>
      <div className="text-left pb-10 pl-6 font-space_mono pt-8">
        <h1 className="font-bold">Protocol Distribution</h1>
        <h6 className="text-sm">Live Protocol Share</h6>
      </div>
    </div>
  );
}

export default DoughNutChart;
