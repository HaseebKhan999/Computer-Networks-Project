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
  return (
    <div className="w-full mr-10 rounded-lg border border-gray-300 bg-white shadow-md transition-shadow hover:shadow-lg">
      <Line
        data={{
          labels: packets.map((p) => p.time), // x-axis: time
          datasets: [
            {
              label: "Packets Per Second",
              data: packets.map((p) => p.count), // y-axis: count
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true },
          },
          scales: {
            x: { title: { display: true, text: "Time" } },
            y: { title: { display: true, text: "Packets" } },
          },
        }}
      />
    </div>
  );
}

export default LineChart;
