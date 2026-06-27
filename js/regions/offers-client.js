// --- Offers CRUD client using Netlify Functions
const offersTableBody = document.getElementById("offers-table-body");
if (offersTableBody) {
  const authHeader = () => {
    const token = localStorage.getItem("admin_token") || sessionStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadOffers = async () => {
    try {
      const res = await fetch('/.netlify/functions/get-offers');
      if (!res.ok) throw new Error('Failed to load offers');
      const items = await res.json();
      offersTableBody.innerHTML = items.map(off => `
        <tr>
          <td>
            <div style="font-weight:700;">${off.title_ar || ''}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${off.title_en || ''}</div>
          </td>
          <td style="font-weight:500; font-size:0.85rem;">${off.start_date || ''}</td>
          <td style="font-weight:500; font-size:0.85rem; color:var(--accent);">${off.end_date || ''}</td>
          <td>${off.status === 'active' ? '<span class="status-badge in-stock">نشط</span>' : '<span class="status-badge out-of-stock">معطل</span>'}</td>
          <td>
            <div class="admin-actions-cell">
              <button class="admin-action-btn edit" onclick="editOffer('${off.id}')" title="تعديل"><i class="fa-solid fa-pen"></i></button>
              <button class="admin-action-btn delete" onclick="deleteOffer('${off.id}')" title="حذف"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (e) { console.error(e); }
  };

  // form bindings exist in admin.js main but submission will call functions
  window.deleteOffer = async (id) => {
    const confirmMsg = localStorage.getItem("lang") === "ar" ? "هل أنت متأكد من رغبتك في حذف هذا العرض الترويجي؟" : "Are you sure you want to delete this offer?";
    if (!confirm(confirmMsg)) return;
    try {
      const headers = authHeader();
      const res = await fetch(`/.netlify/functions/delete-offer?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Delete failed');
      await loadOffers();
    } catch (err) { alert('Error deleting offer: ' + err.message); }
  };

  loadOffers();
}
