// app/api/notification/route.js
import { connect } from "../../lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "";
    const year = searchParams.get("year") || "";
    const type = searchParams.get("type") || "";

    const conn = await connect();

    let query = `
      SELECT a.article_id, a.article_title, a.article_category, a.article_type, a.article_date, a.article_link
      FROM article a
      INNER JOIN user_article ua ON ua.article = a.article_id
      INNER JOIN user u ON u.user_id = ua.user_id
      WHERE 1=1
    `;
    const params = [];

    if (name) {
      query += " AND u.user_name LIKE ?";
      params.push(`%${name}%`);
    }
    if (year) {
      query += " AND YEAR(a.article_date) = ?";
      params.push(year);
    }
    if (type) {
      query += " AND a.article_type = ?";
      params.push(type);
    }

    query += " ORDER BY a.article_date DESC";
    const [articles] = await conn.query(query, params);

    const [typeRows] = await conn.query(
      "SHOW COLUMNS FROM article LIKE 'article_type'"
    );
    const enumStr = typeRows[0].Type; // ตัวอย่าง: "enum('Research','Review','อื่นๆ')"
    const enumValues = enumStr
      .replace(/^enum\(|\)$/gi, "")
      .split(",")
      .map(v => v.replace(/'/g, "")); // ["Research","Review","อื่นๆ"]

    await conn.end();

    // ส่งกลับทั้ง articles และ enum สำหรับ dropdown
    return new Response(
      JSON.stringify({ articles, types: enumValues }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
