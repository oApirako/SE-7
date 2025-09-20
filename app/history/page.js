"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // ฟังก์ชันแปลง user_type
  const mapUserType = (type) => {
    if (type === "1") return "Teacher";
    if (type === "2") return "Staff";
    if (type === "3") return "Admin";
    return "Unknown";
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4">User Login History</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ลำดับ</th>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">User Name</th>
            <th className="border px-4 py-2">User Type</th>
            <th className="border px-4 py-2">Login Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.u_id}>
              <td className="border px-4 py-2">{log.u_id}</td>
              <td className="border px-4 py-2">{log.user_id}</td>
              <td className="border px-4 py-2">{log.user_name}</td>
              <td className="border px-4 py-2">{mapUserType(log.user_type)}</td>
              <td className="border px-4 py-2">{new Date(log.u_date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
