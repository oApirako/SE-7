"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const [userType, setUserType] = useState(null);
  const [mounted, setMounted] = useState(false);

  const Teacher = 1;
  const Staff = 2;
  const Admin = 3;

  const pathname = usePathname(); // ใช้ตรวจหน้า

  useEffect(() => {
    setMounted(true); 
    const storedUserType = localStorage.getItem("user_type");
    if (storedUserType) setUserType(Number(storedUserType));
  }, []);

  const linkClass = (href) =>
    `hover:text-blue-600 transition-colors relative font-medium ${
      pathname === href ? "text-blue-600 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-600" : ""
    }`;

  return (
    <html lang="th">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="flex flex-wrap items-center justify-between px-6 py-4 bg-white shadow-md rounded-b-lg">
          <div className="flex flex-wrap gap-6 text-gray-700">
            <Link href="/" className={linkClass("/")}>หน้าหลัก</Link>
            <Link href="/articles" className={linkClass("/articles")}>บทความวิชาการ</Link>
            <Link href="/manual" className={linkClass("/manual")}>คู่มือ</Link>

            {mounted && userType === Teacher && (
              <Link href="/myarticle" className={linkClass("/myarticle")}>บทความของฉัน</Link>
            )}

            {mounted && userType === Staff && (
              <>
                <Link href="/notification" className={linkClass("/notification")}>ตรวจสอบบทความ</Link>
                <Link href="/conclusion" className={linkClass("/conclusion")}>สรุป</Link>
              </>
            )}

            {mounted && userType === Admin && (
              <>
                <Link href="/editUser" className={linkClass("/editUser")}>อนุมัติบัญชี</Link>
                <Link href="/history" className={linkClass("/history")}>ประวัติการใช้งาน</Link>
              </>
            )}
          </div>

          <div className="flex gap-4 items-center mt-2 sm:mt-0">
            <Link href="/users" className={`bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors font-medium ${pathname === "/users" ? "text-blue-600 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-600" : ""}`}>
              Users
            </Link>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 lg:p-12">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-inner mt-auto py-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
