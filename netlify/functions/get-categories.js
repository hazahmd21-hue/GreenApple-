const { getPool } = require('./db-pool');

exports.handler = async function (event) {
  try {
    const pool = getPool();
    const res = await pool.query('SELECT id, name_ar, name_en, created_at FROM categories ORDER BY id DESC');
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(res.rows) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'db error' }) };
  }
};