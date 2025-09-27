import { connect } from "../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userId, startYear, endYear, type } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "User ID required" }, { status: 400 });
  }

  try {
    const conn = await connect();
    let query = `
      SELECT a.*, ua.user_id 
      FROM article a 
      JOIN user_article ua ON a.article_id = ua.article 
      WHERE ua.user_id=?
    `;
    const params = [userId];

    if (startYear) { query += " AND YEAR(a.article_date) >= ?"; params.push(startYear); }
    if (endYear)   { query += " AND YEAR(a.article_date) <= ?"; params.push(endYear); }
    if (type)      { query += " AND a.article_type = ?"; params.push(type); }

    query += " ORDER BY a.article_date DESC";

    const [rows] = await conn.execute(query, params);
    await conn.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    const db = await connect();

    // ลบจาก articlehistory ก่อน
    await db.query("DELETE FROM articlehistory WHERE article_id = ?", [id]);

    // ลบความสัมพันธ์กับ user_article
    await db.query("DELETE FROM user_article WHERE article = ?", [id]);

    // ลบบทความหลัก
    const [result] = await db.query("DELETE FROM article WHERE article_id = ?", [id]);

    await db.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "ไม่พบบทความ" }, { status: 404 });
    }

    return NextResponse.json({ message: "ลบบทความและข้อมูลที่เกี่ยวข้องเรียบร้อย" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
