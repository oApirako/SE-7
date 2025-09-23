import { connect } from "../../lib/db";

export async function GET(req) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const type = url.searchParams.get("type") || "";
  const year = url.searchParams.get("year") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = 10;

  let where = "WHERE article__status = 'Approved'";
  let params = [];
  if (search) {
    where += " AND article_title LIKE ?";
    params.push(`%${search}%`);
  }
  if (type) {
    where += " AND article_type = ?";
    params.push(type);
  }
  if (year) {
    where += " AND YEAR(article_date) = ?";
    params.push(year);
  }

  const offset = (page - 1) * pageSize;
  const conn = await connect();
  const [rows] = await conn.execute(
    `SELECT * FROM article ${where} ORDER BY article_date DESC LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );
  const [[{ count } = { count: 0 }]] = await conn.execute(
    `SELECT COUNT(*) as count FROM article ${where}`,
    params
  );
  await conn.end();
  return Response.json({ items: rows, total: count });
}
