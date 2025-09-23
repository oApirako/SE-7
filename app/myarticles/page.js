"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

export default function MyArticlesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchJsonSafe = async (url, options = {}) => {
    const res = await fetch(url, { cache: "no-store", ...options });
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      throw new Error(`API returned non-JSON (${res.status}). ${text.slice(0,120)}...`);
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  };

  const load = useCallback(async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) throw new Error("กรุณาเข้าสู่ระบบก่อน");
      const data = await fetchJsonSafe("/api/myarticles", {
        headers: { "x-user-id": userId },
      });
      setItems(data.items || []);
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm("ยืนยันลบ?")) return;
    try {
      const userId = localStorage.getItem("user_id");
      await fetchJsonSafe(`/api/myarticles/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      setItems((prev) => prev.filter((x) => x.article_id !== id));
    } catch (e) {
      alert(e.message || String(e));
    }
  };

  if (loading) return <div className="p-6">กำลังโหลด...</div>;
  if (err) return <div className="p-6 text-red-600 whitespace-pre-wrap">{err}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">📄 My Articles</h1>
        <Link
          href="/myarticles/new"
          className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          ➕ เพิ่มบทความ
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">#</th>
              <th className="p-2 border">ชื่อเรื่อง</th>
              <th className="p-2 border">ประเภท</th>
              <th className="p-2 border">วันที่</th>
              <th className="p-2 border">สถานะ</th>
              <th className="p-2 border">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">ไม่มีบทความ</td>
              </tr>
            ) : (
              items.map((a, i) => (
                <tr key={a.article_id} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{i + 1}</td>
                  <td className="p-2 border">{a.article_title}</td>
                  <td className="p-2 border">{a.article_type}</td>
                  <td className="p-2 border">
                    {a.article_date ? new Date(a.article_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-2 border">{a.article__status}</td>
                  <td className="p-2 border text-center space-x-2">
                    <Link
                      href={`/myarticles/${a.article_id}`}
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      ดู
                    </Link>
                    <Link
                      href={`/myarticles/${a.article_id}/history`}
                      className="px-2 py-1 bg-gray-600 text-white rounded"
                    >
                      ประวัติ
                    </Link>
                    <button
                      onClick={() => handleDelete(a.article_id)}
                      className="px-2 py-1 bg-red-600 text-white rounded"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
