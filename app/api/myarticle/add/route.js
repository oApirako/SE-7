// app/api/myarticle/add/route.js
import { connect } from "../../../lib/db";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId");
    const title = formData.get("title");
    const category = formData.get("category");
    const type = formData.get("type");
    const file = formData.get("file"); // File object

    if (!userId || !title) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    let filePath = null;

    if (file && file.name) {
      const fileName = `${Date.now()}_${file.name}`;
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      // สร้างโฟลเดอร์ถ้าไม่มี
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const savePath = path.join(uploadsDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(savePath, buffer);

      filePath = `/uploads/${fileName}`;
    }

    const conn = await connect();

    // 1) insert ลง article
    const [result] = await conn.execute(
      `INSERT INTO article 
        (article_title, article_category, article_type, article_link, article_date, article__status)
       VALUES (?, ?, ?, ?, NOW(), 'Pending')`,
      [title, category, type, filePath]
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
