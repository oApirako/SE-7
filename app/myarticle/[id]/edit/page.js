'use client';
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditArticlePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [link, setLink] = useState("");      // ลิงก์ไฟล์เดิม
  const [newFile, setNewFile] = useState(null); // ไฟล์ใหม่
  const [comment, setComment] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef(); // ref สำหรับ input ไฟล์

  // ดึง enum ของ category, type
  useEffect(() => {
    const fetchEnums = async () => {
      const fetchEnum = async (field) => {
        const res = await fetch(`/api/myarticle/enum?field=${field}`);
        if (!res.ok) return [];
        return res.json();
      };
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
      })
      .catch(() => {
        alert("ไม่พบข้อมูล");
        router.push("/myarticle");
      });
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("comment", comment);
      if (newFile) formData.append("file", newFile);
      else formData.append("link", link);

      const res = await fetch(`/api/myarticle/${id}`, {
        method: "PUT",
        body: formData
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
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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

        {/* ปุ่มเลือกไฟล์ */}
        <div>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => fileInputRef.current.click()}
          >
            เลือกไฟล์
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {newFile ? (
            <div className="text-sm text-gray-700 truncate mt-1">{newFile.name}</div>
          ) : link ? (
            <div className="text-sm text-gray-700 truncate mt-1">
              ไฟล์เดิม: <a href={link} target="_blank" className="text-blue-600 underline">{link.split("/").pop()}</a>
            </div>
          ) : null}
        </div>

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
