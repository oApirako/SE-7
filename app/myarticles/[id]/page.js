"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ArticleDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const res = await fetch(`/api/myarticles/${id}`, { headers: { "x-user-id": userId } });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error);
        setData(j);
      } catch (e) { setErr(e.message); }
    })();
  }, [id]);

  const onSave = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const res = await fetch(`/api/myarticles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify(data),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      router.push("/myarticles");
    } catch (e) { alert(e.message); }
  };

  if (err) return <div>{err}</div>;
  if (!data) return <div>กำลังโหลด...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl">ดู/แก้ไขบทความ</h1>
      <input className="border p-2 w-full" value={data.article_title} onChange={e=>setData({...data, article_title:e.target.value})}/>
      <select className="border p-2 w-full" value={data.article__status} onChange={e=>setData({...data, article__status:e.target.value})}>
        <option>Pending</option>
        <option>Revision</option>
        <option>Approved</option>
        <option>Rejected</option>
      </select>
      <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded">บันทึก</button>
    </div>
  );
}
