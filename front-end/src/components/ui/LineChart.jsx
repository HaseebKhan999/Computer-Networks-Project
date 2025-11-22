import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useTheme } from "../../contexts/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function LineChart({ packets }) {
  const { isDarkMode } = useTheme();

  // Dynamic colors based on theme
  const textColor = isDarkMode ? "#e5e5e5" : "#1f2937";
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";
  const lineColor = isDarkMode ? "rgba(59, 130, 246, 1)" : "rgba(249, 115, 22, 1)"; // Blue in dark, Orange in light
  const gradientStart = isDarkMode ? "rgba(59, 130, 246, 0.4)" : "rgba(249, 115, 22, 0.3)";
  const gradientEnd = isDarkMode ? "rgba(59, 130, 246, 0.05)" : "rgba(249, 115, 22, 0.05)";

  // Create gradient for area fill
  const createGradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, gradientStart);
    gradient.addColorStop(1, gradientEnd);
    return gradient;
  };

  return (
    <div className="w-full mr-10 rounded-xl border-2 border-border bg-card shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] hover:scale-[1.01] p-6 backdrop-blur-sm">
      <Line
        data={{
          labels: packets.map((p) => p.time),
          datasets: [
            {
              label: "Packets Per Second",
              data: packets.map((p) => p.count),
              borderColor: lineColor,
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx } = chart;
                return createGradient(ctx);
              },
              tension: 0.4, // Smooth curves
              borderWidth: 3,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: lineColor,
              pointHoverBorderColor: "#ffffff",
              pointHoverBorderWidth: 2,
              fill: true,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                color: textColor,
                font: {
                  family: "Space_Mono",
                  size: 14,
                  weight: 'bold',
                },
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle',
              },
            },
            tooltip: {
              backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.95)",
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: lineColor,
              borderWidth: 2,
              padding: 12,
              displayColors: true,
              titleFont: {
                size: 13,
                weight: 'bold',
              },
              bodyFont: {
                size: 12,
              },
              cornerRadius: 8,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Time",
                color: textColor,
                font: {
                  family: "Space_Mono",
                  size: 14,
                  weight: 'bold',
                },
                padding: { top: 10 },
              },
              ticks: {
                color: textColor,
                font: {
                  size: 12,
                  weight: '600',
                },
                maxRotation: 45,
                minRotation: 45,
              },
              grid: {
                color: gridColor,
                lineWidth: 1,
              },
              border: {
                width: 2,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
              },
            },
            y: {
              title: {
                display: true,
                text: "Packets",
                color: textColor,
                font: {
                  family: "Space_Mono",
                  size: 14,
                  weight: 'bold',
                },
                padding: { bottom: 10 },
              },
              ticks: {
                color: textColor,
                font: {
                  size: 12,
                  weight: '600',
                },
              },
              grid: {
                color: gridColor,
                lineWidth: 1,
              },
              border: {
                width: 2,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
              },
            },
          },
        }}
      />
    </div>
  );
}

export default LineChart;