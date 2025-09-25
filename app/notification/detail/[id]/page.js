'use client';
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function ArticleDetail({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchArticle = async () => {
    const res = await fetch(`/api/notification/${id}`);
    const data = await res.json();
    setArticle(data);
    setSelectedStatus(data.article__status);
    setLoading(false);
  };

  const fetchStatuses = async () => {
    const res = await fetch(`/api/notification/status`);
    const data = await res.json();
    setStatuses(data);
  };

  const handleSave = async () => {
    const user_id = localStorage.getItem("user_id");
    await fetch(`/api/notification/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        article_status: selectedStatus,
        n_comment: newComment,
        user_id
      })
    });
    alert("บันทึกเรียบร้อย");
    router.push("/notification");
  };

  useEffect(() => {
    fetchStatuses();
    fetchArticle();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">รายละเอียดบทความ</h1>

        <div className="space-y-2">
          <label className="font-semibold text-gray-700">ชื่อผู้สร้าง:</label>
          <p className="text-gray-800">{article.user_name}</p>
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-gray-700">ชื่อบทความ:</label>
          <p className="text-gray-800">{article.article_title}</p>
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Link บทความ:</label>
          <a href={article.article_link} target="_blank" className="text-blue-600 underline hover:text-blue-800 transition">
            ดูเนื้อหา
          </a>
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-gray-700">เพิ่ม comment:</label>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="พิมพ์ comment ใหม่"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-gray-700">สถานะบทความ:</label>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shadow-md transition"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
