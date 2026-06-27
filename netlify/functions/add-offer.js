const { getPool } = require('./db-pool');

exports.handler = async function (event) {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  const auth = event.headers['authorization'] || '';
  if (!ADMIN_TOKEN || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { titleAr, titleEn, descAr, descEn, banner, startDate, endDate, status } = body;
    if (!titleAr && !titleEn) return { statusCode: 400, body: JSON.stringify({ error: 'title required' }) };

    const pool = getPool();
    const res = await pool.query(
      'INSERT INTO offers (title_ar, title_en, description_ar, description_en, banner, start_date, end_date, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, title_ar, title_en, banner, start_date, end_date, status',
      [titleAr || null, titleEn || null, descAr || null, descEn || null, banner || null, startDate || null, endDate || null, status || 'inactive']
    );

    return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(res.rows[0]) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'db error' }) };
  }
};