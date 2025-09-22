"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setMessage("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: email, user_password: password }),
      });

      const data = await res.json();

      if (res.ok) {
        // เก็บ user_id และ user_type ลง localStorage
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_type", data.user_type);

        // reload หน้าเพื่อให้ layout อ่านค่าใหม่
        window.location.href = "/"; 
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white p-2 w-full mt-2 hover:bg-blue-600"
        onClick={handleLogin}
      >
        Login
      </button>

      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
}
