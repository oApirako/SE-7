// app/api/resetpassword/route.js
import { connect } from "../../lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { user_id, user_name, user_password } = await req.json();
  try {
    const db = await connect();
    let query = "UPDATE user SET user_name = ?";
    const params = [user_name];

    if (user_password) {
      const hashed = await bcrypt.hash(user_password, 10);
      query += ", user_password = ?";
      params.push(hashed);
    }
    query += " WHERE user_id = ?";
    params.push(user_id);

    await db.execute(query, params);
    await db.end();

    return new Response(JSON.stringify({ message: "Updated successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
