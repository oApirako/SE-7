import { connect } from '../../lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  const { user_email, user_password } = await req.json();

  try {
    const db = await connect();
    const [rows] = await db.execute(
      'SELECT * FROM user WHERE user_email = ?',
      [user_email]
    );

    if (rows.length === 0) {
      await db.end();
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const user = rows[0];
    const match = await bcrypt.compare(user_password, user.user_password);

    if (!match) {
      await db.end();
      return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });
    }

    // บันทึกเวลาการ login
    const now = new Date(); // เวลาปัจจุบัน
    await db.execute(
      'INSERT INTO userlog (u_date, user_id) VALUES (?, ?)',
      [now, user.user_id]
    );

    await db.end();

    // ส่ง user_id และ user_type กลับ
    return new Response(
      JSON.stringify({ 
        message: 'Login success', 
        user_id: user.user_id,
        user_type: user.user_type,
        user_name: user.user_name
      }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
