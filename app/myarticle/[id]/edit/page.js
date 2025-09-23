
'use client';
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditArticlePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [link, setLink] = useState("");
  const [comment, setComment] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);
  const [status, setStatus] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const router = useRouter();
  const { id } = useParams();

  // ดึง enum ของ status, category, type
  useEffect(() => {
    const fetchEnums = async () => {
      const fetchEnum = async (field) => {
        const res = await fetch(`/api/myarticle/enum?field=${field}`);
        if (!res.ok) return [];
        return res.json();
      };
      setStatusOptions(await fetchEnum("article__status"));
      setCategoryOptions(await fetchEnum("article_category"));
      setTypeOptions(await fetchEnum("article_type"));
    };
    fetchEnums();
  }, []);

  // ดึงข้อมูลบทความ
  useEffect(() => {
    fetch(`/api/myarticle/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject("Not found"))
      .then(data => {
        setTitle(data.article_title || "");
        setCategory(data.article_category || "");
        setType(data.article_type || "");
        setLink(data.article_link || "");
        setStatus(data.article__status || "Pending");
      })
      .catch(() => {
        alert("ไม่พบข้อมูล");
        router.push("/myarticle");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/myarticle/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, type, link, comment })
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
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-bold mb-6">แก้ไขผลงาน</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
        />

        <select
          className="w-full border px-3 py-2 rounded"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="w-full border px-3 py-2 rounded"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <input
          className="w-full border px-3 py-2 rounded"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="Link (ถ้ามี)"
        />

        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          บันทึกการแก้ไข
        </button>
      </form>
    </div>
  );
}
