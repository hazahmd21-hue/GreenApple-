const { getPool } = require('./db-pool');

exports.handler = async function (event) {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  const auth = event.headers['authorization'] || '';
  if (!ADMIN_TOKEN || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { nameAr, nameEn } = body;
    if (!nameAr && !nameEn) return { statusCode: 400, body: JSON.stringify({ error: 'name required' }) };

    const pool = getPool();
    const res = await pool.query('INSERT INTO categories (name_ar, name_en) VALUES ($1,$2) RETURNING id, name_ar, name_en, created_at', [nameAr || null, nameEn || null]);

    return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(res.rows[0]) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'db error' }) };
  }
};