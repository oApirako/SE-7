import { NextResponse } from "next/server";
import { connect } from "../../../lib/db";

export async function GET(req, { params }) {
  const db = await connect();
  const [rows] = await db.execute(`SELECT * FROM article WHERE article_id=?`, [params.id]);
  await db.end();
  return NextResponse.json(rows[0] || {});
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const db = await connect();
    await db.execute(
      `UPDATE article SET article_title=?, article__status=? WHERE article_id=?`,
      [body.article_title, body.article__status, params.id]
    );
    await db.end();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const db = await connect();
  await db.execute(`DELETE FROM article WHERE article_id=?`, [params.id]);
  await db.end();
  return NextResponse.json({ ok: true });
}
