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

  return (
    <div className="rounded-lg border border-border bg-card shadow-md transition-shadow hover:shadow-lg w-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold font-space_mono text-foreground mb-1">
          Recent Packets
        </h2>
        <p className="text-sm text-muted-foreground mb-4 font-space_mono">
          Live feed of captured packets (latest 50)
        </p>

        <div className="overflow-auto w-full font-space_mono">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-secondary border-b border-border">
              <tr>
                <th className="text-left font-medium px-4 py-3 text-foreground">Timestamp</th>
                <th className="text-left font-medium px-4 py-3 text-foreground">Source IP</th>
                <th className="text-left font-medium px-4 py-3 text-foreground">
                  Destination IP
                </th>
                <th className="text-left font-medium px-4 py-3 text-foreground">
                  Transport Protocol
                </th>
                <th className="text-left font-medium px-4 py-2 text-foreground">
                  Application Protocol
                </th>
              </tr>
            </thead>
            <tbody>
              {packets.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-border hover:bg-accent transition-colors"
                >
                  <td className="px-4 py-3 text-left text-muted-foreground">{p.time}</td>
                  <td className="px-4 py-3 text-left font-mono text-foreground">{p.src_ip}</td>
                  <td className="px-4 py-3 text-left font-mono text-foreground">{p.dest_ip}</td>
                  <td className="px-4 py-3 text-left">
                    <span className="inline-flex items-center rounded-md bg-blue-100 dark:bg-blue-900 px-2 py-1 text-xs text-blue-800 dark:text-blue-200">
                      {p.protocol.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left font-mono text-foreground">{p.app_layer}</td>
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