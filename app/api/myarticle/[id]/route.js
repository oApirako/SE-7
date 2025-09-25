// app/api/myarticle/[id]/route.js
import { connect } from "../../../lib/db";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// GET: ดึงข้อมูลบทความ
export async function GET(req, { params }) {
  try {
    const db = await connect();
    const [rows] = await db.query(
      "SELECT * FROM ARTICLE WHERE article_id = ?",
      [params.id]
    );
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ message: "ไม่พบข้อมูล" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

// PUT: อัปเดตบทความ + comment + อัปโหลดไฟล์ใหม่
export async function PUT(req, { params }) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") || "";
    const category = formData.get("category") || "";
    const type = formData.get("type") || "";
    const comment = formData.get("comment") || "";
    const file = formData.get("file"); // ถ้ามีไฟล์ใหม่
    let link = formData.get("link") || ""; // ไฟล์เดิม

    // อัปโหลดไฟล์ใหม่ถ้ามี
    if (file && file.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const filename = `${Date.now()}_${file.name}`;
      const filepath = path.join(uploadsDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filepath, buffer);

      link = `/uploads/${filename}`; // เก็บ path ใหม่
    }

    const db = await connect();
    const [rows] = await db.query(
      "SELECT article__status FROM ARTICLE WHERE article_id = ?",
      [params.id]
    );

    if (rows.length === 0) {
      await db.end();
      return NextResponse.json({ message: "ไม่พบข้อมูล" }, { status: 404 });
    }

    let status = rows[0].article__status;
    if (status === "Approved" || status === "Rejected") {
      status = "Revision";
    }

    // อัปเดตบทความ
    await db.query(
      `UPDATE ARTICLE
       SET article_title = ?, 
           article_category = ?, 
           article_type = ?, 
           article_link = ?, 
           article__status = ?, 
           article_date = NOW()
       WHERE article_id = ?`,
      [title, category, type, link, status, params.id]
    );

    // บันทึก comment
    if (comment.trim() !== "") {
      await db.query(
        `INSERT INTO ARTICLEHISTORY (A_date, A_comment, article_id)
         VALUES (NOW(), ?, ?)`,
        [comment, params.id]
      );
    }

    await db.end();
    return NextResponse.json({ message: "อัปเดตบทความเรียบร้อย" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
