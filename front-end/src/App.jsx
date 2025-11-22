// App.jsx
import React, { useEffect, useState } from "react";
import "./App.css";
import DashboardCard from "./components/ui/DashboardCard";
import LineChart from "./components/ui/LineChart";
import Table from "./components/ui/Table";
import DoughNutChart from "./components/ui/DoughNutChart";

function App() {
  const [packets, setPackets] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:8000/api/packets/", { method: "POST" })
        .then((res) => res.json())
        .then((data) => setPackets((prev) => [...prev.slice(-119), data]));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Top Nav */}
      <div className="h-[60px] w-full fixed top-0 left-0 flex items-center border-b border-gray-200 bg-white z-20">
        <h1 className="px-4 font-space_mono text-[22px] text-black">NetMon</h1>
      </div>

      {/* Content */}
      <div className="mt-16 -mx-64  space-y-6">
        {/* Dashboard Cards */}
        <div className="flex flex-row gap-6 w-full">
          <DashboardCard title="Packets" value="123,456" />
          <DashboardCard title="Packets Per Second" value="42" />
          <DashboardCard title="UDP Packets" value="20" />
          <DashboardCard title="TCP Packets" value="21" />
        </div>

        {/* Line Chart */}
        <div className="w-full -mx-10  ">
          <div className="flex flex-row max-w-[3200px] ">
            
          <LineChart packets={packets} />
          <DoughNutChart />
          </div>
        </div>

        {/* Table */}
        <div className="flex justify-start items-start ml-0 pl-0">
          <Table />
        </div>
      </div>
    </div>
  );
}

export default App;
