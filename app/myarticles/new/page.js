"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArticlePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    article_title: "",
    article_category: "Computer Science",
    article_link: "",
    article_type: "Research",
    article_date: "",
  });
  const [err, setErr] = useState("");

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const userId = localStorage.getItem("user_id");
      const res = await fetch("/api/myarticles", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "สร้างไม่สำเร็จ");
      router.push("/myarticles");
    } catch (e2) {
      setErr(e2.message || String(e2));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">➕ เพิ่มบทความ</h1>
      {err && <div className="mb-3 text-red-600">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border p-2 w-full" name="article_title" placeholder="ชื่อเรื่อง" value={form.article_title} onChange={onChange} required />
        <select className="border p-2 w-full" name="article_category" value={form.article_category} onChange={onChange}>
          <option>Computer Science</option>
          <option>Engineering</option>
        </select>
        <input className="border p-2 w-full" name="article_link" placeholder="ลิงก์ (ถ้ามี)" value={form.article_link} onChange={onChange} />
        <select className="border p-2 w-full" name="article_type" value={form.article_type} onChange={onChange}>
          <option>Research</option>
          <option>Review</option>
          <option>อื่นๆ</option>
        </select>
        <input className="border p-2 w-full" name="article_date" type="date" value={form.article_date} onChange={onChange} required />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded" type="submit">บันทึก</button>
          <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => history.back()}>ยกเลิก</button>
        </div>
      </form>
    </div>
  );
}
