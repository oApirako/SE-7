// app/api/notification/[id]/route.js
import { connect } from "../../../lib/db";

export async function GET(req, { params }) {
  const { id } = params; // unwrap Next.js 15+

  try {
    const conn = await connect();

    const [rows] = await conn.query(
      `SELECT a.article_id, a.article_title, a.article_category, a.article_type, 
              a.article_date, a.article_link, a.article__status, u.user_name, ua.user_id
       FROM article a
       INNER JOIN user_article ua ON ua.article = a.article_id
       INNER JOIN user u ON u.user_id = ua.user_id
       WHERE a.article_id = ?`,
      [id]
    );

    await conn.end();

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Article not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { article_status, n_comment, user_id } = await req.json(); // user_id จาก front-end

  try {
    const conn = await connect();

    // update status ใน article
    await conn.query(
      `UPDATE article SET article__status = ? WHERE article_id = ?`,
      [article_status, id]
    );

    // insert notification (บันทึก comment พร้อม user_id ที่ทำจริง)
    const now = new Date();
    await conn.query(
      `INSERT INTO notification (n_dare, n_comment, user_id, article_id)
       VALUES (?, ?, ?, ?)`,
      [now, n_comment, user_id, id]
    );

    await conn.end();

    return new Response(JSON.stringify({ message: "Updated successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
