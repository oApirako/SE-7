'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddArticle() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Computer Science");
  const [type, setType] = useState("Research");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem("user_id"); // 👈 เอาคนที่ login อยู่
    if (!userId) {
      alert("กรุณาเข้าสู่ระบบก่อนเพิ่มผลงาน");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/myarticle/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, category, type, link })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        router.push("/myarticle");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-bold mb-6">เพิ่มผลงาน</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          className="w-full border px-3 py-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Computer Science</option>
          <option>Engineering</option>
        </select>

        <select
          className="w-full border px-3 py-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Research</option>
          <option>Review</option>
          <option>อื่นๆ</option>
        </select>

        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="Link / File Path (ถ้ามี)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          {loading ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </form>
    </div>
  );
}
