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
} from "chart.js";
import { useTheme } from "../../contexts/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ packets }) {
  const { isDarkMode } = useTheme();

  // Dynamic colors based on theme
  const textColor = isDarkMode ? "#e5e5e5" : "#333333";
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const borderColor = isDarkMode ? "rgba(75, 192, 192, 1)" : "rgba(75, 192, 192, 1)";
  const backgroundColor = isDarkMode ? "rgba(75, 192, 192, 0.3)" : "rgba(75, 192, 192, 0.2)";

  return (
    <div className="w-full mr-10 rounded-lg border border-border bg-card shadow-md transition-shadow hover:shadow-lg p-4">
      <Line
        data={{
          labels: packets.map((p) => p.time), // x-axis: time
          datasets: [
            {
              label: "Packets Per Second",
              data: packets.map((p) => p.count), // y-axis: count
              borderColor: borderColor,
              backgroundColor: backgroundColor,
              tension: 0.3, // Smooth line
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: true,
              labels: {
                color: textColor,
                font: {
                  family: "Space_Mono",
                },
              },
            },
            tooltip: {
              backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: gridColor,
              borderWidth: 1,
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
                },
              },
              ticks: {
                color: textColor,
              },
              grid: {
                color: gridColor,
              },
            },
            y: {
              title: {
                display: true,
                text: "Packets",
                color: textColor,
                font: {
                  family: "Space_Mono",
                },
              },
              ticks: {
                color: textColor,
              },
              grid: {
                color: gridColor,
              },
            },
          },
        }}
      />
    </div>
  );
}

export default LineChart;