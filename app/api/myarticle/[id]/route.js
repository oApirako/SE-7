// app/api/myarticle/[id]/route.js
import { connect } from "../../../lib/db";
import { NextResponse } from "next/server";

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

// PUT: อัปเดตบทความ + comment + เปลี่ยนสถานะ Appoved/Rejected → Revision
export async function PUT(req, { params }) {
  try {
    const { title, category, type, link, comment } = await req.json();

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
      [title || "", category || "", type || "", link || "", status, params.id]
    );

    // บันทึก comment
    if (comment && comment.trim() !== "") {
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

// GET ENUM: ดึงค่า enum ของ status
export async function GET_ENUM(req) {
  try {
    const db = await connect();
    const [rows] = await db.query(
      `SHOW COLUMNS FROM ARTICLE LIKE 'article__status'`
    );
    await db.end();

    if (rows.length === 0) return NextResponse.json([]);

    const typeStr = rows[0].Type; // enum('Pending','Revision','Appoved','Rejected')
    const enumValues = typeStr
      .replace(/^enum\(|\)$/gi, "")
      .split(",")
      .map(v => v.replace(/'/g, ""));
    return NextResponse.json(enumValues);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}
