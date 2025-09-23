// app/myarticle/page.js
'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyArticlePage() {
  const [articles, setArticles] = useState([]);
  const [filters, setFilters] = useState({ startYear: "", endYear: "", type: "" });
  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    const userId = localStorage.getItem("user_id"); // ใช้ user_id จาก localStorage
    if (!userId) {
      setArticles([]);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/myarticle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...filters }),
    });

    const data = await res.json();
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("ลบผลงานนี้?")) return;

    const res = await fetch(`/api/myarticle?id=${id}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      fetchArticles(); // รีเฟรชตารางหลังลบ
    } else {
      alert(data.message);
    }
  };

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleFilter = () => fetchArticles();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Articles</h1>
      <div className="flex gap-2 mb-4">
        <Link href="/myarticle/add" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          เพิ่มผลงาน
        </Link>
        <input type="number" name="startYear" placeholder="ปีเริ่มต้น" value={filters.startYear} onChange={handleFilterChange} className="border px-2 py-1 rounded"/>
        <input type="number" name="endYear" placeholder="ปีสิ้นสุด" value={filters.endYear} onChange={handleFilterChange} className="border px-2 py-1 rounded"/>
        <select name="type" value={filters.type} onChange={handleFilterChange} className="border px-2 py-1 rounded">
          <option value="">-- ประเภทงาน --</option>
          <option value="Research">Research</option>
          <option value="Review">Review</option>
          <option value="อื่นๆ">อื่นๆ</option>
        </select>
        <button onClick={handleFilter} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
          ค้นหา
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b">Title</th>
                <th className="px-4 py-2 border-b">Category</th>
                <th className="px-4 py-2 border-b">Type</th>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.article_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{a.article_title}</td>
                  <td className="px-4 py-2 border-b">{a.article_category}</td>
                  <td className="px-4 py-2 border-b">{a.article_type}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(a.article_date).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded text-white ${
                      a.article__status === "Pending" ? "bg-yellow-500" :
                      a.article__status === "Approved" ? "bg-green-500" :
                      a.article__status === "Revision" ? "bg-blue-500" :
                      "bg-red-500"
                    }`}>
                      {a.article__status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b space-x-2">
                    <Link href={`/myarticle/${a.article_id}/edit`} className="text-blue-500 hover:underline">แก้ไข</Link>
                    <button onClick={() => handleDelete(a.article_id)} className="text-red-500 hover:underline">ลบ</button>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">ไม่มีผลงาน</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
