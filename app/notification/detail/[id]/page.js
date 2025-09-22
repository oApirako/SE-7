'use client';
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function ArticleDetail({ params }) {
  const { id } = use(params);
  const router = useRouter(); // ใช้สำหรับ navigation
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
    const user_id = localStorage.getItem("user_id"); // ดึงจาก login
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
    // กลับไปหน้า notification
    router.push("/notification");
  };

  useEffect(() => {
    fetchStatuses();
    fetchArticle();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white min-h-screen max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">รายละเอียดบทความ</h1>
      <form className="space-y-4">
        <div>
          <label className="font-semibold">ชื่อผู้สร้าง:</label>
          <p>{article.user_name}</p>
        </div>
        <div>
          <label className="font-semibold">ชื่อบทความ:</label>
          <p>{article.article_title}</p>
        </div>
        <div>
          <label className="font-semibold">Link บทความ:</label>
          <a href={article.article_link} target="_blank" className="text-blue-600 underline">ดูเนื้อหา</a>
        </div>
        <div>
          <label className="font-semibold">เพิ่ม comment:</label>
          <textarea value={newComment} onChange={e => setNewComment(e.target.value)} className="border p-2 rounded w-full" placeholder="พิมพ์ comment ใหม่"/>
        </div>
        <div>
          <label className="font-semibold">สถานะบทความ:</label>
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="border p-2 rounded w-full">
            {statuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <button type="button" onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">บันทึก</button>
      </form>
    </div>
  );
}
