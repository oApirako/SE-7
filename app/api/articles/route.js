import { connect } from "../../lib/db";

export async function GET(req) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const type = url.searchParams.get("type") || "";
  const year = url.searchParams.get("year") || "";
  const owner = url.searchParams.get("owner") || ""; // เพิ่ม owner
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = 10;

  let where = "WHERE a.article__status = 'Approved'";
  let params = [];

  if (search) {
    where += " AND a.article_title LIKE ?";
    params.push(`%${search}%`);
  }
  if (type) {
    where += " AND a.article_type = ?";
    params.push(type);
  }
  if (year) {
    where += " AND YEAR(a.article_date) = ?";
    params.push(year);
  }
  if (owner) {
    where += " AND u.user_name LIKE ?";
    params.push(`%${owner}%`);
  }

  const offset = (page - 1) * pageSize;
  const conn = await connect();

  const [rows] = await conn.execute(
    `SELECT a.*, u.user_name as owner_name
     FROM article a
     JOIN user_article ua ON a.article_id = ua.article
     JOIN user u ON ua.user_id = u.user_id
     ${where}
     ORDER BY a.article_date DESC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  const [[{ count } = { count: 0 }]] = await conn.execute(
    `SELECT COUNT(*) as count
     FROM article a
     JOIN user_article ua ON a.article_id = ua.article
     JOIN user u ON ua.user_id = u.user_id
     ${where}`,
    params
  );

  await conn.end();
  return Response.json({ items: rows, total: count });
}
