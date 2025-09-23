'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const validatePassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);

export default function ResetPasswordPage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

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
        setUser(data);
        setName(data.user_name);
      })
      .catch(console.error);
  }, [router]);

  const handleSave = async () => {
    setMessage("");

    if (password1 !== password2) {
      setMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }
    if (password1 && !validatePassword(password1)) {
      setMessage("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรและมีตัวอักษร + สัญลักษณ์พิเศษ");
      return;
    }

    try {
      const res = await fetch("/api/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          user_name: name,
          user_password: password1 || undefined, // ไม่เปลี่ยนถ้าเว้นว่าง
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("แก้ไขเรียบร้อย");
        router.push("/"); // กลับหน้า homepage
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Reset Password / Edit Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Name</label>
          <input
            className="border p-2 w-full rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold">New Password</label>
          <input
            type="password"
            className="border p-2 w-full rounded"
            placeholder="เว้นว่างถ้าไม่เปลี่ยน"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold">Confirm Password</label>
          <input
            type="password"
            className="border p-2 w-full rounded"
            placeholder="เว้นว่างถ้าไม่เปลี่ยน"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        {message && <p className="text-red-500">{message}</p>}

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          บันทึก
        </button>

        
      </div>
    </div>
  );
}
