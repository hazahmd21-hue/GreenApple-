# Netlify functions for GreenApple (products CRUD)

This commit adds Netlify Functions that provide a simple CRUD API for products stored in a PostgreSQL database (Netlify Postgres). It does NOT include any database credentials — those must be configured in Netlify environment variables.

Files added:
- netlify/functions/db-pool.js       # Postgres pool helper (reads DATABASE_URL)
- netlify/functions/get-products.js # GET list of products
- netlify/functions/add-product.js  # POST add product (requires ADMIN_TOKEN)
- netlify/functions/delete-product.js # DELETE product by id (requires ADMIN_TOKEN)
- schema/products.sql               # SQL to create products table
- netlify.toml
- package.json

Setup steps (summary):
1. In your Netlify site settings -> Environment, add these variables:
   - DATABASE_URL = (your owner connection string, e.g. postgresql://netlifydb_owner:...)
   - ADMIN_TOKEN = (a secret token used by admin UI)

2. Deploy (Netlify will install dependencies). You can test functions at:
   - /.netlify/functions/get-products
   - /.netlify/functions/add-product
   - /.netlify/functions/delete-product?id=1

   For add/delete include header: Authorization: Bearer <ADMIN_TOKEN>

3. Create the products table by running `schema/products.sql` in Netlify SQL editor (use the owner connection string).

Security notes:
- Rotate any credentials that were accidentally leaked.
- Do NOT commit DATABASE_URL or ADMIN_TOKEN into the repository.
- Consider creating a limited-privilege DB user for admin actions.

If you want, I can also:
- Add a simple admin HTML page in this repo that calls these functions (requires embedding ADMIN token — better to protect it behind server-side session). 
- Create a GitHub PR instead of pushing directly to main.
