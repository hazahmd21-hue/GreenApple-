// --- Categories CRUD: use Netlify Functions for read/write
const tableBody = document.getElementById("categories-table-body");
const modal = document.getElementById("cat-modal");
const form = document.getElementById("cat-form");

const openModalBtn = document.getElementById("open-cat-modal-btn");
const closeModalBtn = document.getElementById("close-cat-modal-btn");

if (tableBody) {
  const authHeader = () => {
    const token = localStorage.getItem("admin_token") || sessionStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadCategories = async () => {
    try {
      const res = await fetch('/.netlify/functions/get-categories');
      if (!res.ok) throw new Error('Failed to load categories');
      const cats = await res.json();
      tableBody.innerHTML = cats.map(cat => `
        <tr>
          <td dir="ltr" style="font-weight:600;">${cat.id}</td>
          <td style="font-weight:700;">${cat.name_ar || ''}</td>
          <td>${cat.name_en || ''}</td>
          <td>
            <div class="admin-actions-cell">
              <button class="admin-action-btn edit" onclick="editCategory('${cat.id}', '${(cat.name_ar||'').replace(/'/g,"\\'")}', '${(cat.name_en||'').replace(/'/g,"\\'")}')" title="تعديل"><i class="fa-solid fa-pen"></i></button>
              <button class="admin-action-btn delete" onclick="deleteCategory('${cat.id}')" title="حذف"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (e) { console.error(e); }
  };

  openModalBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("cat-id").value = "";
    document.getElementById("cat-modal-title").innerHTML = `<span class="lang-ar">إضافة قسم جديد</span><span class="lang-en">Add New Category</span>`;
    modal.classList.add("active");
  });

  closeModalBtn.addEventListener("click", () => modal.classList.remove("active"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("cat-id").value;
    const nameAr = document.getElementById("cat-name-ar").value.trim();
    const nameEn = document.getElementById("cat-name-en").value.trim();

    try {
      const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeader());
      if (id) {
        // update
        await fetch('/.netlify/functions/update-category', { method: 'PUT', headers, body: JSON.stringify({ id, nameAr, nameEn }) });
      } else {
        await fetch('/.netlify/functions/add-category', { method: 'POST', headers, body: JSON.stringify({ nameAr, nameEn }) });
      }
      modal.classList.remove('active');
      await loadCategories();
    } catch (err) { alert('Error saving category: ' + err.message); }
  });

  window.editCategory = (id, nameAr, nameEn) => {
    document.getElementById("cat-id").value = id;
    document.getElementById("cat-name-ar").value = nameAr;
    document.getElementById("cat-name-en").value = nameEn;
    document.getElementById("cat-modal-title").innerHTML = `<span class="lang-ar">تعديل القسم</span><span class="lang-en">Edit Category</span>`;
    modal.classList.add("active");
  };

  window.deleteCategory = async (id) => {
    const confirmMsg = localStorage.getItem("lang") === "ar" ? "هل أنت متأكد من رغبتك في حذف هذا القسم؟ قد يؤثر ذلك على المنتجات المشمولة." : "Are you sure you want to delete this category?";
    if (!confirm(confirmMsg)) return;
    try {
      const headers = authHeader();
      const res = await fetch(`/.netlify/functions/delete-category?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Delete failed');
      await loadCategories();
    } catch (err) { alert('Error deleting category: ' + err.message); }
  };

  // initial
  loadCategories();
}
