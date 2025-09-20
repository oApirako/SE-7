import { connect } from '../../lib/db';
import bcrypt from 'bcrypt';
// GET เพิ่ม search query
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("q") || "";

    const db = await connect();
    const [rows] = await db.execute(
      'SELECT user_id, user_name, user_email, user_type FROM user WHERE user_name LIKE ? ORDER BY user_id ASC',
      [`%${searchQuery}%`] // ใช้ LIKE สำหรับค้นหา
    );
    await db.end();

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST, PUT, DELETE เหมือนเดิม
export async function POST(req) {
  try {
    const { user_name, user_email, user_password, user_type } = await req.json();
    const hashedPassword = await bcrypt.hash(user_password, 10);

    const db = await connect();
    await db.execute(
      'INSERT INTO user (user_name, user_email, user_password, user_type) VALUES (?, ?, ?, ?)',
      [user_name, user_email, hashedPassword, user_type]
    );
    await db.end();

    return new Response(JSON.stringify({ message: 'User created' }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { user_id, user_name, user_email, user_password, user_type } = await req.json();

    const db = await connect();
    let query = 'UPDATE user SET user_name=?, user_email=?, user_type=?';
    const params = [user_name, user_email, user_type];

    if (user_password) {
      const hashedPassword = await bcrypt.hash(user_password, 10);
      query += ', user_password=?';
      params.push(hashedPassword);
    }

    query += ' WHERE user_id=?';
    params.push(user_id);

    await db.execute(query, params);
    await db.end();

    return new Response(JSON.stringify({ message: 'User updated' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { user_id } = await req.json();
    const db = await connect();
    await db.execute('DELETE FROM user WHERE user_id=?', [user_id]);
    await db.end();
    return new Response(JSON.stringify({ message: 'User deleted' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
