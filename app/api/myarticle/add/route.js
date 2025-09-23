// app/api/myarticle/add/route.js
import { connect } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userId, title, category, type, link } = await req.json();

  if (!userId || !title) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const conn = await connect();
    // 1) insert ลง article
    const [result] = await conn.execute(
      `INSERT INTO article (article_title, article_category, article_type, article_link, article_date, article__status)
       VALUES (?, ?, ?, ?, NOW(), 'Pending')`,
      [title, category, type, link || null]
    );

    const articleId = result.insertId;

    // 2) ผูกกับ user ใน user_article
    await conn.execute(
      `INSERT INTO user_article (user_id, article) VALUES (?, ?)`,
      [userId, articleId]
    );

    await conn.end();
    return NextResponse.json({ message: "บันทึกผลงานเรียบร้อย" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
