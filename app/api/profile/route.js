import { connect } from '../../lib/db';

export async function POST(req) {
  const { user_id } = await req.json();

  try {
    const db = await connect();
    const [rows] = await db.execute(
      'SELECT user_id, user_name, user_email, user_type FROM user WHERE user_id = ?',
      [user_id]
    );
    await db.end();

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
