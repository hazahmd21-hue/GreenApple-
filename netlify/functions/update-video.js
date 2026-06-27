const { getPool } = require('./db-pool');

exports.handler = async function (event) {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  const auth = event.headers['authorization'] || '';
  if (!ADMIN_TOKEN || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { id, titleAr, titleEn, url, thumbnail } = body;
    if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'id required' }) };

    const pool = getPool();
    const res = await pool.query('UPDATE videos SET title_ar=$1, title_en=$2, url=$3, thumbnail=$4 WHERE id=$5 RETURNING id, title_ar, title_en, url, thumbnail', [titleAr || null, titleEn || null, url || null, thumbnail || null, id]);
    if (res.rowCount === 0) return { statusCode: 404, body: JSON.stringify({ error: 'not found' }) };

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(res.rows[0]) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'db error' }) };
  }
};