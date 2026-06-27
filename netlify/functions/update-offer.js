const { getPool } = require('./db-pool');

exports.handler = async function (event) {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  const auth = event.headers['authorization'] || '';
  if (!ADMIN_TOKEN || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { id, titleAr, titleEn, descAr, descEn, banner, startDate, endDate, status } = body;
    if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'id required' }) };

    const pool = getPool();
    const res = await pool.query(
      'UPDATE offers SET title_ar=$1, title_en=$2, description_ar=$3, description_en=$4, banner=$5, start_date=$6, end_date=$7, status=$8 WHERE id=$9 RETURNING id, title_ar, title_en, banner, start_date, end_date, status',
      [titleAr || null, titleEn || null, descAr || null, descEn || null, banner || null, startDate || null, endDate || null, status || 'inactive', id]
    );
    if (res.rowCount === 0) return { statusCode: 404, body: JSON.stringify({ error: 'not found' }) };

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(res.rows[0]) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'db error' }) };
  }
};