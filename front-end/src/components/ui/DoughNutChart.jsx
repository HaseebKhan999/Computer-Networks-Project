import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "../../contexts/ThemeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughNutChart() {
  const { isDarkMode } = useTheme();
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

  // Dynamic colors based on theme - more vibrant and modern
  const textColor = isDarkMode ? "#e5e5e5" : "#1f2937";
  
  // Enhanced color palette - more vibrant
  const backgroundColors = [
    "#3b82f6", // TCP - Bright Blue
    "#f97316", // UDP - Bright Orange
    "#10b981", // HTTPS - Emerald Green
    "#06b6d4", // DNS - Cyan
    "#eab308", // HTTP - Yellow
    "#ef4444", // Unknown - Red
  ];

  // Darker borders for better separation
  const borderColors = [
    "#2563eb", // TCP
    "#ea580c", // UDP
    "#059669", // HTTPS
    "#0891b2", // DNS
    "#ca8a04", // HTTP
    "#dc2626", // Unknown
  ];

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
        backgroundColor: backgroundColors,
        borderColor: isDarkMode ? "#1f2937" : "#ffffff",
        borderWidth: 3,
        hoverOffset: 15,
        hoverBorderWidth: 4,
        hoverBorderColor: isDarkMode ? "#ffffff" : "#000000",
      },
    ],
  };

  const options = {
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: textColor,
          font: {
            family: "Space_Mono",
            size: 13,
            weight: 'bold',
          },
          padding: 18,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.95)",
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
        borderWidth: 2,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div className="w-[450px] h-[450px] py-8 mx-auto rounded-xl border-2 border-border bg-card shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(168,_85,_247,_0.15)] hover:scale-[1.01] backdrop-blur-sm">
      <div className="h-[320px] flex items-center justify-center px-4">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="text-center px-6 font-space_mono pt-4">
        <h1 className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 animate-gradient-x">
          Protocol Distribution
        </h1>
        <h6 className="text-sm text-muted-foreground font-semibold mt-1">
          Live Protocol Share
        </h6>
      </div>
    </div>
  );
}

export default DoughNutChart;