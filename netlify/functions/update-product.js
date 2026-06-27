const { getPool } = require('./db-pool');

exports.handler = async function (event) {
  // Only allow authorized admin requests
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  const auth = event.headers['authorization'] || '';
  if (!ADMIN_TOKEN || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { id, product } = body;
    if (!id || !product) return { statusCode: 400, body: JSON.stringify({ error: 'id and product required' }) };

    // We'll store the full product object as JSON in the description column
    const name = product.nameEn || product.nameAr || product.name || '';
    const description = JSON.stringify(product);
    const price = product.priceAfter || product.price || 0;
    const image_url = (product.images && product.images.length > 0) ? product.images[0] : null;

    const pool = getPool();
    const res = await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, image_url=$4 WHERE id=$5 RETURNING id, name, description, price, image_url, created_at',
      [name, description, price, image_url, id]
    );

    if (res.rowCount === 0) return { statusCode: 404, body: JSON.stringify({ error: 'not found' }) };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(res.rows[0])
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'db error' }) };
  }
};