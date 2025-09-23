import { NextResponse } from "next/server";
import { connect } from "../../lib/db";

export async function GET(req, { params }) {
  const db = await connect();
  const [rows] = await db.execute(
    `SELECT * FROM articlehistory WHERE article_id=? ORDER BY A_id DESC`,
    [params.id]
  );
  await db.end();
  return NextResponse.json({ items: rows });
}
