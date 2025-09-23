"use client";
import { useEffect, useState } from "react";

const INSTRUCTIONS = [
  { file: "teacher.txt", show: user => user === "Teacher" },
  { file: "articles.txt", show: () => true },
  { file: "staff_conclusion.txt", show: user => user === "Staff"},
  { file: "staff_notification.txt", show: user => user === "Staff"},
  { file: "admin_useredit.txt", show: user => user === "Admin" },
  { file: "admin_history.txt", show: user => user === "Admin" },
];

export default function ManualPage() {
  // Get user_type from localStorage (set after login)
  const [userType, setUserType] = useState("Unknown");
  const [sections, setSections] = useState([]);

  // Map user_type from login API
  const mapUserType = (type) => {
    if (type === "1") return "Teacher";
    if (type === "2") return "Staff";
    if (type === "3") return "Admin";
    return "Unknown";
  };

  useEffect(() => {
    // Try to get user_type from localStorage
    const storedType = localStorage.getItem("user_type");
    setUserType(mapUserType(storedType));
  }, []);

  useEffect(() => {
    Promise.all(
      INSTRUCTIONS.map(async ({ file, show }) => {
        if (!show(userType)) return null;
        const res = await fetch(`/manual/instructions/${file}`);
        const text = await res.text();
        return text;
      })
    ).then(arr => setSections(arr.filter(Boolean)));
  }, [userType]);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">คู่มือการใช้งานระบบเผยแพร่บทความ</h1>
      <div className="mb-6">
        <label className="font-semibold mr-2">ประเภทผู้ใช้:</label>
        <span className="border p-2 rounded bg-gray-100">{userType}</span>
      </div>
      {sections.map((txt, i) => (
        <div key={i} className="mb-8">
          {/*
            To embed an image in an instruction file, use:
            ![alt](url|size)
            - alt: image alt text
            - url: image URL
            - size: multiplier for original image size (e.g., 0.5 for half size, 2 for double)
            Example:
            ![ตัวอย่าง](https://example.com/image.png|0.5)
          */}
           {txt.split(/\r?\n/).map((line, idx) => {
             // Match image line: ![alt](url|size)
             const imgMatch = line.match(/^!\[(.*)\]\((.*)\|(\d*\.?\d+)\)$/);
             if (imgMatch) {
               const [, alt, url, sizeStr] = imgMatch;
               const size = parseFloat(sizeStr) || 1;
               return <ManualImage key={idx} alt={alt} url={url} size={size} />;
             }
             return <pre key={idx} className="whitespace-pre-wrap font-sans text-base mb-1">{line}</pre>;
           })}
          {i < sections.length - 1 && <hr className="border-t my-4" />}
        </div>
      ))}
    </div>
  );
}

// Component to render an image with size multiplier
function ManualImage({ alt, url, size }) {
  const [imgDims, setImgDims] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setImgDims({ width: img.width, height: img.height });
    img.src = url;
  }, [url]);
  const w = imgDims.width ? imgDims.width * size : undefined;
  const h = imgDims.height ? imgDims.height * size : undefined;
  return (
    <div className="my-4 flex justify-center">
      <img src={url} alt={alt} width={w} height={h} style={{maxWidth:'100%',height:'auto'}} />
    </div>
  );
}
