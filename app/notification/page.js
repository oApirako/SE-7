'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NotificationPage() {
  const [articles, setArticles] = useState([]);
  const [types, setTypes] = useState([]); // enum สำหรับ dropdown
  const [searchName, setSearchName] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchType, setSearchType] = useState('');

  const fetchArticles = async () => {
    try {
      const res = await fetch(
        `/api/notification?name=${searchName}&year=${searchYear}&type=${searchType}`
      );
      const data = await res.json();
      setArticles(data.articles);
      setTypes(data.types || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">ตรวจสอบบทความ</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center bg-gray-50 p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="ค้นหาชื่อผู้สร้าง"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="number"
          placeholder="ปี"
          value={searchYear}
          onChange={e => setSearchYear(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">ประเภทบทความทั้งหมด</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button
          onClick={fetchArticles}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition shadow-sm"
        >
          ค้นหา
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {['ID', 'Title', 'Category', 'Type', 'Date', 'Status', 'Link'].map(col => (
                <th
                  key={col}
                  className="border px-4 py-3 text-left text-gray-700 font-semibold tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  ไม่พบข้อมูล
                </td>
              </tr>
            ) : (
              articles.map(article => (
                <tr
                  key={article.article_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border px-4 py-2">{article.article_id}</td>
                  <td className="border px-4 py-2 font-medium">{article.article_title}</td>
                  <td className="border px-4 py-2">{article.article_category}</td>
                  <td className="border px-4 py-2">{article.article_type}</td>
                  <td className="border px-4 py-2">
                    {new Date(article.article_date).toLocaleDateString("th-TH")}
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm font-semibold ${
                        article.article__status === "Pending" ? "bg-yellow-500" :
                        article.article__status === "Approved" ? "bg-green-500" :
                        article.article__status === "Revision" ? "bg-blue-500" :
                        "bg-red-500"
                      }`}
                    >
                      {article.article__status}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <Link
                      href={`/notification/detail/${article.article_id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition shadow-sm"
                    >
                      ดูเนื้อหา
                    </Link>
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
