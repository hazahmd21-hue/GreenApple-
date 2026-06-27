const { getPool } = require('./db-pool');

exports.handler = async function (event) {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  const auth = event.headers['authorization'] || '';
  if (!ADMIN_TOKEN || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { titleAr, titleEn, url, thumbnail } = body;
    if (!titleAr && !titleEn) return { statusCode: 400, body: JSON.stringify({ error: 'title required' }) };

    const pool = getPool();
    const res = await pool.query('INSERT INTO videos (title_ar, title_en, url, thumbnail) VALUES ($1,$2,$3,$4) RETURNING id, title_ar, title_en, url, thumbnail', [titleAr || null, titleEn || null, url || null, thumbnail || null]);

    return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(res.rows[0]) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'db error' }) };
  }
};