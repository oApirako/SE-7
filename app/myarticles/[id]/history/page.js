"use client";
import { useEffect, useState } from "react";

export default function ArticleHistory({ params }) {
  const { id } = params;
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const res = await fetch(`/api/myarticles/${id}/history`, { headers: { "x-user-id": userId } });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error);
        setItems(j.items || []);
      } catch (e) { setErr(e.message); }
    })();
  }, [id]);

  if (err) return <div>{err}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl">ประวัติ บทความ #{id}</h1>
      <ul className="list-disc pl-6">
        {items.map(h => (
          <li key={h.A_id}>{h.A_date} – {h.A_action} – {h.A_comment}</li>
        ))}
      </ul>
    </div>
  );
}
