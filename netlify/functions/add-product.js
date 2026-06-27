const { getPool } = require('./db-pool');

exports.handler = async function (event) {
  // تحقق من توكن الأدمن
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  const auth = event.headers['authorization'] || '';
  if (!ADMIN_TOKEN || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { name, description, price, image_url } = payload;
    if (!name) return { statusCode: 400, body: JSON.stringify({ error: 'name required' }) };

    const pool = getPool();
    const result = await pool.query(
      'INSERT INTO products (name, description, price, image_url) VALUES ($1,$2,$3,$4) RETURNING id, name, description, price, image_url, created_at',
      [name, description || null, price || 0, image_url || null]
    );

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.rows[0])
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'db error' }) };
  }
};