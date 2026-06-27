// --- Videos CRUD client using Netlify Functions
const videosTableBody = document.getElementById("videos-table-body");
if (videosTableBody) {
  const authHeader = () => {
    const token = localStorage.getItem("admin_token") || sessionStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadVideos = async () => {
    try {
      const res = await fetch('/.netlify/functions/get-videos');
      if (!res.ok) throw new Error('Failed to load videos');
      const items = await res.json();
      videosTableBody.innerHTML = items.map(vid => `
        <tr>
          <td><img src="${vid.thumbnail || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800'}" alt="" style="width:72px; height:45px; object-fit:cover; border-radius:6px; border:1px solid var(--border-color);"></td>
          <td>
            <div style="font-weight:700;">${vid.title_ar || ''}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${vid.title_en || ''}</div>
          </td>
          <td dir="ltr" style="font-size:0.8rem; color:var(--primary); font-weight:500;">${vid.url || ''}</td>
          <td>
            <div class="admin-actions-cell">
              <button class="admin-action-btn edit" onclick="editVideo('${vid.id}')" title="تعديل"><i class="fa-solid fa-pen"></i></button>
              <button class="admin-action-btn delete" onclick="deleteVideo('${vid.id}')" title="حذف"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (e) { console.error(e); }
  };

  window.deleteVideo = async (id) => {
    const confirmMsg = localStorage.getItem("lang") === "ar" ? "هل أنت متأكد من رغبتك في حذف هذا الفيديو؟" : "Are you sure you want to delete this video?";
    if (!confirm(confirmMsg)) return;
    try {
      const headers = authHeader();
      const res = await fetch(`/.netlify/functions/delete-video?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Delete failed');
      await loadVideos();
    } catch (err) { alert('Error deleting video: ' + err.message); }
  };

  loadVideos();
}
