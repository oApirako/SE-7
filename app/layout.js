"use client";
import Link from "next/link";
import "./globals.css";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const [userType, setUserType] = useState(null);
  const [mounted, setMounted] = useState(false);

  const Teacher = 1;
  const Staff = 2;
  const Admin = 3;

  useEffect(() => {
    setMounted(true); 
    const storedUserType = localStorage.getItem("user_type");
    if (storedUserType) setUserType(Number(storedUserType));
  }, []);

  return (
    <html lang="th">
      <body className="bg-gray-50 text-gray-900">
        <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
          <div className="flex gap-6">
            <Link href="/" className="hover:text-blue-600 transition">หน้าหลัก</Link>
            <Link href="/articles" className="hover:text-blue-600 transition">บทความวิชาการ</Link>
            <Link href="/manual" className="hover:text-blue-600 transition">คู่มือ</Link>

            
            {mounted && userType === Teacher && (
              <Link href="/myarticles" className="hover:text-blue-600 transition">บทความของฉัน</Link>
            )}


            {mounted && userType === Staff && (
              <Link href="/notification" className="hover:text-blue-600 transition">ตรวจสอบบทความ</Link>
            )}
            {mounted && userType === Staff && (
              <Link href="/conclusion" className="hover:text-blue-600 transition">สรุป</Link>
            )}


            {mounted && userType === Admin && (
              <Link href="/editUser" className="hover:text-blue-600 transition">อนุมัติบัญชี</Link>
            )}
            {mounted && userType === Admin && (
              <Link href="/history" className="hover:text-blue-600 transition">ประวัติการใช้งาน</Link>
            )}
          </div>

          <div className="flex gap-4 items-center">
            <Link href="/users" className="hover:text-blue-600 transition">users</Link>
          </div>
        </nav>

        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
