'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UsersPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // แปลง user_type เป็นข้อความ
  const getUserTypeName = (type) => {
    switch (type) {
      case 1:
        return "Teacher";
      case 2:
        return "Staff";
      case 3:
        return "Admin";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      router.push("/login");
      return;
    }

    fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({ ...data, user_type: Number(data.user_type) });
      })
      .catch(console.error);
  }, [router]);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl mb-4">My Profile</h1>
      <div className="border p-4 rounded shadow bg-white space-y-2">
        <p><strong>ID:</strong> {user.user_id}</p>
        <p><strong>Name:</strong> {user.user_name}</p>
        <p><strong>Email:</strong> {user.user_email}</p>
        <p><strong>Type:</strong> {getUserTypeName(user.user_type)}</p>
      </div>

      {/* ปุ่มแก้ไขรหัสผ่าน / ชื่อ */}
      <Link
        href="/resetpassword"
        className="block bg-blue-500 text-white p-2 w-full mt-4 text-center rounded hover:bg-yellow-600"
      >
        Reset Password / Edit Name
      </Link>

      <button
        onClick={() => {
          localStorage.removeItem("user_id");
          localStorage.removeItem("user_type");
          window.location.href = "/login";
        }}
        className="bg-red-500 text-white p-2 w-full mt-2 hover:bg-red-600 rounded"
      >
        Logout
      </button>
    </div>
  );
}
