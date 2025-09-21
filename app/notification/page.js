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
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">ตรวจสอบบทความ</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="ค้นหาชื่อผู้สร้าง"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="ปี"
          value={searchYear}
          onChange={e => setSearchYear(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">ประเภทบทความทั้งหมด</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button
          onClick={fetchArticles}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ค้นหา
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              {['ID', 'Title', 'Category', 'Type', 'Date', 'Link'].map(col => (
                <th key={col} className="border px-4 py-2 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">ไม่พบข้อมูล</td>
              </tr>
            ) : (
              articles.map(article => (
                <tr key={article.article_id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{article.article_id}</td>
                  <td className="border px-4 py-2">{article.article_title}</td>
                  <td className="border px-4 py-2">{article.article_category}</td>
                  <td className="border px-4 py-2">{article.article_type}</td>
                  <td className="border px-4 py-2">{article.article_date}</td>
                  <td className="border px-4 py-2">
                    <Link
                      href={`/detail/${article.article_id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
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
