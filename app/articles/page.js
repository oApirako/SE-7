"use client";
import { useState, useEffect } from "react";

const ARTICLE_TYPES = ["Research", "Review", "อื่นๆ"];

function getYears() {
  const y = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => String(y - i));
}

export default function ArticlesPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      ...(search && { search }),
      ...(type && { type }),
      ...(year && { year }),
      page,
    });
    fetch(`/api/articles?${params}`)
      .then((r) => r.json())
      .then((j) => {
        setItems(j.items);
        setTotal(j.total);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [search, type, year, page]);

  const pages = Math.ceil(total / 10);

  return (
    <div className="flex max-w-6xl mx-auto p-6 gap-6">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 p-4 rounded border">
        <div className="mb-6">
          <label className="block font-semibold mb-2">ประเภทบทความ</label>
          <select className="border p-2 w-full" value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
            <option value="">ทั้งหมด</option>
            {ARTICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-2">ปีที่เผยแพร่</label>
          <select className="border p-2 w-full" value={year} onChange={e => { setYear(e.target.value); setPage(1); }}>
            <option value="">ทั้งหมด</option>
            {getYears().map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mb-6">
          <label className="block font-semibold mb-2">ค้นหาด้วยชื่อเรื่อง</label>
          <input
            className="border p-2 w-full"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="ค้นหาบทความ..."
          />
        </div>
        <h1 className="text-2xl font-semibold mb-4">
          บทความที่อนุมัติแล้ว
          <span className="ml-2 text-base font-normal text-gray-600">({total} รายการ)</span>
        </h1>
        {loading ? (
          <div>กำลังโหลด...</div>
        ) : items.length === 0 ? (
          <div>ไม่พบบทความ</div>
        ) : (
          <div>
            <div className="flex flex-col gap-6 mb-4">
              {items.map((a, i) => (
                <div key={a.article_id} className="flex flex-col border rounded-lg shadow-sm p-4 bg-white w-full">
                  <div className="mb-2 text-sm text-gray-500">#{(page - 1) * 10 + i + 1}</div>
                  <div className="font-bold text-lg mb-1">{a.article_title}</div>
                  <div className="mb-1 text-gray-700">ประเภท: {a.article_type}</div>
                  <div className="mb-1 text-gray-700">วันที่: {a.article_date ? new Date(a.article_date).toLocaleDateString() : "-"}</div>
                  <div className="mb-2 text-gray-700">สถานะ: {a.article__status}</div>
                  <div className="mb-2 text-gray-700">{a.article_link ? <span>ลิงก์: <a href={a.article_link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{a.article_link}</a></span> : null}</div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {pages > 1 && (
              <div className="flex gap-2 justify-center">
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded border ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white"}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
