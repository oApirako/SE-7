import { NextResponse } from "next/server";
import { connect } from "../../lib/db";

export async function GET(req) {
  try {
    const userId = req.headers.get("x-user-id");
    const db = await connect();
    const [rows] = await db.execute(
      `SELECT a.* FROM user_article ua
       JOIN article a ON a.article_id = ua.article
       WHERE ua.user_id = ? AND ua.is_owner='1'`,
      [userId]
    );
    await db.end();
    return NextResponse.json({ items: rows });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = req.headers.get("x-user-id");
    const body = await req.json();
    const { article_title, article_category, article_link, article_type, article_date } = body;
    const db = await connect();
    const [ins] = await db.execute(
      `INSERT INTO article (article_title, article_category, article_link, article_type, article_date, article__status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [article_title, article_category, article_link, article_type, article_date]
    );
    const articleId = ins.insertId;
    await db.execute(`INSERT INTO user_article (user_id, article, is_owner) VALUES (?, ?, '1')`, [userId, articleId]);
    await db.end();
    return NextResponse.json({ article_id: articleId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
