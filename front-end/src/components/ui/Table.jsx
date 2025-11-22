// Table.jsx
import { useEffect, useState } from "react";

function Table() {
  const [packets, setPackets] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:8000/api/packets/recent/", { method: "POST" })
        .then((res) => res.json())
        .then((data) => setPackets((prev) => [...data, ...prev].slice(0, 50)))
        .catch((err) => console.error(err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Transport Protocol Badge Styling
  const getTransportBadge = (protocol) => {
    const proto = protocol.toUpperCase();
    if (proto === "TCP") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700";
    } else if (proto === "UDP") {
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-700";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600";
  };

  // Application Protocol Badge Styling
  const getAppBadge = (appLayer) => {
    const app = appLayer.toUpperCase();
    
    if (app === "HTTPS") {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-300 dark:border-green-700";
    } else if (app === "HTTP") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700";
    } else if (app === "DNS") {
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700";
    } else if (app === "FTP") {
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-700";
    } else if (app === "SSH") {
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700";
    } else if (app === "SMTP" || app === "EMAIL") {
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border border-pink-300 dark:border-pink-700";
    } else if (app === "NONE" || app === "UNKNOWN" || app === "") {
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-300 dark:border-gray-600";
    }
    // Default for other protocols
    return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200 border border-violet-300 dark:border-violet-700";
  };

  return (
    <div className="rounded-xl border-2 border-border bg-card shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(99,_102,_241,_0.15)] w-full backdrop-blur-sm">
      <div className="p-6">
        <h2 className="text-2xl font-extrabold font-space_mono text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-1 animate-gradient-x">
          Recent Packets
        </h2>
        <p className="text-sm text-muted-foreground mb-6 font-space_mono font-semibold">
          Live feed of captured packets (latest 50)
        </p>

        <div className="overflow-auto w-full font-space_mono rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-b-2 border-border">
              <tr>
                <th className="text-center font-bold px-4 py-4 text-cyan-700 dark:text-cyan-400 text-base">
                  <span className="flex items-center justify-center gap-2">
                    ⏰ Timestamp
                  </span>
                </th>
                <th className="text-center font-bold px-4 py-4 text-blue-700 dark:text-blue-400 text-base">
                  <span className="flex items-center justify-center gap-2">
                    📤 Source IP
                  </span>
                </th>
                <th className="text-center font-bold px-4 py-4 text-purple-700 dark:text-purple-400 text-base">
                  <span className="flex items-center justify-center gap-2">
                    📥 Destination IP
                  </span>
                </th>
                <th className="text-center font-bold px-4 py-4 text-orange-700 dark:text-orange-400 text-base">
                  <span className="flex items-center justify-center gap-2">
                    🔌 Transport Protocol
                  </span>
                </th>
                <th className="text-center font-bold px-4 py-4 text-green-700 dark:text-green-400 text-base">
                  <span className="flex items-center justify-center gap-2">
                    🌐 Application Protocol
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {packets.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-border hover:bg-accent transition-all duration-200 hover:scale-[1.01]"
                >
                  <td className="px-4 py-3 text-center text-cyan-600 dark:text-cyan-400 font-semibold">
                    {p.time}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-blue-600 dark:text-blue-400 font-semibold">
                    {p.src_ip}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-purple-600 dark:text-purple-400 font-semibold">
                    {p.dest_ip}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold ${getTransportBadge(p.protocol)}`}>
                      {p.protocol.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold ${getAppBadge(p.app_layer)}`}>
                      {p.app_layer.toUpperCase() || "NONE"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;