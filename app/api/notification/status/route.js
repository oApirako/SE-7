// app/api/notification/status/route.js
import { connect } from "../../../lib/db";

export async function GET() {
  try {
    const conn = await connect();

    const [typeRows] = await conn.query(
      `SHOW COLUMNS FROM article LIKE 'article__status'`
    );

    const enumStr = typeRows[0].Type; // "enum('Pending','Revision','Appoved','Rejected')"
    const enumValues = enumStr
      .replace(/^enum\(|\)$/gi, "")
      .split(",")
      .map(v => v.replace(/'/g, ""));

    await conn.end();

    return new Response(JSON.stringify(enumValues), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
