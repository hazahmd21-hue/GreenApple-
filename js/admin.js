/**
 * Green Apple - Premium Smartphone Store
 * Admin Control Panel Script
 *
 * Modified to use Netlify Functions for products CRUD:
 * - GET  /.netlify/functions/get-products
 * - POST /.netlify/functions/add-product
 * - PUT  /.netlify/functions/update-product
 * - DELETE /.netlify/functions/delete-product?id=...
 */

let cachedProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  // 1. Session Guard Checks
  checkAdminSession();

  // 2. Bind Common Actions
  const logoutBtn = document.getElementById("admin-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("admin_token");
      sessionStorage.removeItem("admin_token");
      window.location.href = "login.html";
    });
  }

  // Route-Specific Admin Controllers
  const path = window.location.pathname;
  if (path.includes("login.html")) {
    initLoginController();
  } else if (path.includes("dashboard.html")) {
    initDashboardStats();
  } else if (path.includes("categories.html")) {
    initCategoriesCRUD();
  } else if (path.includes("products.html")) {
    initProductsCRUD();
  } else if (path.includes("offers.html")) {
    initOffersCRUD();
  } else if (path.includes("videos.html")) {
    initVideosCRUD();
  }
});

/* ==========================================================================
   1. SESSION GUARD SECURITY
   ========================================================================== */
function checkAdminSession() {
  const token = localStorage.getItem("admin_token") || sessionStorage.getItem("admin_token");
  const isLoginPage = window.location.pathname.includes("login.html");

  if (!token && !isLoginPage) {
    // Redirect unauthorized to login screen
    window.location.href = "login.html";
  } else if (token && isLoginPage) {
    // Already authenticated, redirect to stats page
    window.location.href = "dashboard.html";
  }
}

/* ==========================================================================
   2. LOGIN CONTROLLER
   ========================================================================== */
function initLoginController() {
  const form = document.getElementById("admin-login-form");
  const errorAlert = document.getElementById("login-error-alert");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorAlert.style.display = "none";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const rememberMe = document.getElementById("remember-me").checked;

    try {
      const res = await apiRequest("/auth/login", "POST", { username, password });
      
      if (res && res.success) {
        if (rememberMe) {
          localStorage.setItem("admin_token", res.token);
        } else {
          sessionStorage.setItem("admin_token", res.token);
        }
        window.location.href = "dashboard.html";
      } else {
        throw new Error();
      }
    } catch (err) {
      errorAlert.style.display = "block";
    }
  });
}

/* ==========================================================================
   3. DASHBOARD STATS CONTROLLER
   ========================================================================== */
async function initDashboardStats() {
  try {
    const stats = await apiRequest("/stats");
    
    document.getElementById("stat-categories").textContent = stats.categories || 0;
    document.getElementById("stat-products").textContent = stats.products || 0;
    document.getElementById("stat-offers").textContent = stats.offers || 0;
    document.getElementById("stat-videos").textContent = stats.videos || 0;
    document.getElementById("stat-views").textContent = stats.views || 0;
  } catch (err) {
    console.error("Failed to load dashboard statistics:", err);
  }
}

/* ==========================================================================
   4. CATEGORIES CRUD CONTROLLER
   ========================================================================== */
async function initCategoriesCRUD() {
  const tableBody = document.getElementById("categories-table-body");
  const modal = document.getElementById("cat-modal");
  const form = document.getElementById("cat-form");
  
  const openModalBtn = document.getElementById("open-cat-modal-btn");
  const closeModalBtn = document.getElementById("close-cat-modal-btn");
  
  if (!tableBody) return;

  const loadCategories = async () => {
    try {
      const categories = await apiRequest("/categories");
      tableBody.innerHTML = categories.map(cat => `
        <tr>
          <td dir="ltr" style="font-weight:600;">${cat.id}</td>
          <td style="font-weight:700;">${cat.nameAr}</td>
          <td>${cat.nameEn}</td>
          <td>
            <div class="admin-actions-cell">
              <button class="admin-action-btn edit" onclick="editCategory('${cat.id}', '${cat.nameAr}', '${cat.nameEn}')" title="تعديل"><i class="fa-solid fa-pen"></i></button>
              <button class="admin-action-btn delete" onclick="deleteCategory('${cat.id}')" title="حذف"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join("");
    } catch (e) {
      console.error(e);
    }
  };

  // Bind modal triggers
  openModalBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("cat-id").value = "";
    document.getElementById("cat-modal-title").innerHTML = `<span class="lang-ar">إضافة قسم جديد</span><span class="lang-en">Add New Category</span>`;
    modal.classList.add("active");
  });

  closeModalBtn.addEventListener("click", () => modal.classList.remove("active"));

  // Form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("cat-id").value;
    const nameAr = document.getElementById("cat-name-ar").value.trim();
    const nameEn = document.getElementById("cat-name-en").value.trim();

    const data = { nameAr, nameEn };
    
    try {
      if (id) {
        // Edit Mode
        await apiRequest("/categories", "PUT", { id, ...data });
      } else {
        // Create Mode
        await apiRequest("/categories", "POST", data);
      }
      modal.classList.remove("active");
      loadCategories();
    } catch (err) {
      alert("Error saving category: " + err.message);
    }
  });

  // Global triggers inside window for inline edit/delete calls
  window.editCategory = (id, nameAr, nameEn) => {
    document.getElementById("cat-id").value = id;
    document.getElementById("cat-name-ar").value = nameAr;
    document.getElementById("cat-name-en").value = nameEn;
    document.getElementById("cat-modal-title").innerHTML = `<span class="lang-ar">تعديل القسم</span><span class="lang-en">Edit Category</span>`;
    modal.classList.add("active");
  };

  window.deleteCategory = async (id) => {
    const confirmMsg = localStorage.getItem("lang") === "ar" ? 
                       "هل أنت متأكد من رغبتك في حذف هذا القسم؟ قد يؤثر ذلك على المنتجات المشمولة." : 
                       "Are you sure you want to delete this category?";
    
    if (confirm(confirmMsg)) {
      try {
        await apiRequest(`/categories/${id}`, "DELETE");
        loadCategories();
      } catch (err) {
        alert("Error deleting category: " + err.message);
      }
    }
  };

  // Initial load
  loadCategories();
}

/* ==========================================================================
   5. PRODUCTS CRUD CONTROLLER (modified to use Netlify Functions)
   ========================================================================== */
async function initProductsCRUD() {
  const tableBody = document.getElementById("products-table-body");
  const modal = document.getElementById("prod-modal");
  const form = document.getElementById("prod-form");
  const catSelect = document.getElementById("prod-category");
  
  const openModalBtn = document.getElementById("open-prod-modal-btn");
  const closeModalBtn = document.getElementById("close-prod-modal-btn");

  const dragArea = document.getElementById("drag-drop-area");
  const fileInput = document.getElementById("prod-file-input");
  const previewsContainer = document.getElementById("image-previews");
  const urlInput = document.getElementById("prod-image-url");
  const addUrlBtn = document.getElementById("add-url-img-btn");

  if (!tableBody) return;

  let uploadedImages = [];

  const authHeader = () => {
    const token = localStorage.getItem("admin_token") || sessionStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadCategoriesDropdown = async () => {
    try {
      const categories = await apiRequest("/categories");
      catSelect.innerHTML = categories.map(cat => `<option value="${cat.nameAr}">${cat.nameAr} / ${cat.nameEn}</option>`).join("");
    } catch (e) {
      console.error(e);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch('/.netlify/functions/get-products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const rows = await res.json();

      // Map DB rows to the admin product shape. We store the full product object inside `description` as JSON when saving.
      const products = rows.map(r => {
        let payload = {};
        try { payload = r.description ? JSON.parse(r.description) : {}; } catch (e) { payload = {}; }
        return {
          id: r.id,
          nameAr: payload.nameAr || payload.name || r.name || '',
          nameEn: payload.nameEn || payload.name || r.name || '',
          descAr: payload.descAr || payload.description || '',
          descEn: payload.descEn || '',
          priceBefore: payload.priceBefore || 0,
          priceAfter: payload.priceAfter || r.price || 0,
          category: payload.category || '',
          availability: payload.availability || 'in-stock',
          sku: payload.sku || '',
          code: payload.code || '',
          tags: payload.tags || '',
          featured: !!payload.featured,
          images: payload.images || (r.image_url ? [r.image_url] : [])
        };
      });

      cachedProducts = products;

      tableBody.innerHTML = products.map(prod => {
        const cover = prod.images && prod.images.length > 0 ? prod.images[0] : "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800";
        const isFeatured = prod.featured ? 
                           `<span style="color:var(--primary); font-size:1.2rem;"><i class="fa-solid fa-circle-check"></i></span>` : 
                           `<span style="color:var(--text-muted);"><i class="fa-solid fa-circle-minus"></i></span>`;
        const availabilityText = prod.availability === "in-stock" ? 
                                 `<span class="status-badge in-stock">متوفر</span>` : 
                                 `<span class="status-badge out-of-stock">نفذت</span>`;
        
        return `
          <tr>
            <td><img src="${cover}" alt="" style="width:48px; height:48px; object-fit:contain; border-radius:8px; background:rgba(255,255,255,0.02); border:1px solid var(--border-color);"></td>
            <td dir="ltr" style="font-weight:600; font-size:0.85rem;">${prod.code || '-'}</td>
            <td>
              <div style="font-weight:700;">${prod.nameAr}</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">${prod.nameEn}</div>
            </td>
            <td style="font-weight:800; color:var(--accent);">$${prod.priceAfter}</td>
            <td>${prod.category}</td>
            <td>${availabilityText}</td>
            <td style="text-align:center;">${isFeatured}</td>
            <td>
              <div class="admin-actions-cell">
                <button class="admin-action-btn edit" onclick="editProduct('${prod.id}')" title="تعديل"><i class="fa-solid fa-pen"></i></button>
                <button class="admin-action-btn delete" onclick="deleteProduct('${prod.id}')" title="حذف"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    } catch (e) {
      console.error(e);
    }
  };

  // Image Preview Renderer
  const renderPreviews = () => {
    previewsContainer.innerHTML = uploadedImages.map((img, i) => `
      <div class="image-preview-wrapper">
        <img src="${img}" alt="">
        <span class="image-preview-delete" onclick="removeUploadedImage(${i})">&times;</span>
      </div>
    `).join("");
  };

  window.removeUploadedImage = (index) => {
    uploadedImages.splice(index, 1);
    renderPreviews();
  };

  // Image URL addition
  addUrlBtn.addEventListener("click", () => {
    const url = urlInput.value.trim();
    if (url) {
      uploadedImages.push(url);
      urlInput.value = "";
      renderPreviews();
    }
  });

  // Local File uploads (drag-drop)
  dragArea.addEventListener("click", () => fileInput.click());
  
  dragArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragArea.style.borderColor = "var(--primary)";
  });
  dragArea.addEventListener("dragleave", () => {
    dragArea.style.borderColor = "var(--border-color)";
  });
  dragArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dragArea.style.borderColor = "var(--border-color)";
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
  });

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedImages.push(e.target.result); // Base64 encoding
          renderPreviews();
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Open modal config
  openModalBtn.addEventListener("click", () => {
    form.reset();
    uploadedImages = [];
    renderPreviews();
    document.getElementById("prod-id").value = "";
    document.getElementById("prod-modal-title").innerHTML = `<span class="lang-ar">إضافة منتج جديد</span><span class="lang-en">Add New Product</span>`;
    modal.classList.add("active");
  });

  closeModalBtn.addEventListener("click", () => modal.classList.remove("active"));

  // Form Submit CRUD
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("prod-id").value;

    const data = {
      nameAr: document.getElementById("prod-name-ar").value.trim(),
      nameEn: document.getElementById("prod-name-en").value.trim(),
      descAr: document.getElementById("prod-desc-ar").value.trim(),
      descEn: document.getElementById("prod-desc-en").value.trim(),
      priceBefore: parseFloat(document.getElementById("prod-price-before").value) || 0,
      priceAfter: parseFloat(document.getElementById("prod-price-after").value) || 0,
      category: document.getElementById("prod-category").value,
      availability: document.getElementById("prod-availability").value,
      sku: document.getElementById("prod-sku").value.trim(),
      code: document.getElementById("prod-code").value.trim(),
      tags: document.getElementById("prod-tags").value.trim(),
      featured: document.getElementById("prod-featured").checked,
      images: uploadedImages
    };

    try {
      const headers = Object.assign({'Content-Type': 'application/json'}, authHeader());

      if (id) {
        // Update existing product via update-product function
        await fetch('/.netlify/functions/update-product', {
          method: 'PUT',
          headers,
          body: JSON.stringify({ id, product: data })
        });
      } else {
        // Create new product, store full product object as JSON in `description` column
        await fetch('/.netlify/functions/add-product', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: data.nameEn || data.nameAr || "",
            description: JSON.stringify(data),
            price: data.priceAfter || 0,
            image_url: data.images && data.images.length > 0 ? data.images[0] : null
          })
        });
      }

      modal.classList.remove("active");
      await loadProducts();
    } catch (err) {
      alert("Error saving product: " + err.message);
    }
  });

  // Global edit call
  window.editProduct = async (id) => {
    try {
      // Find product from cached list
      const prod = cachedProducts.find(p => String(p.id) === String(id));
      if (!prod) {
        alert('Product not found');
        return;
      }

      document.getElementById("prod-id").value = prod.id;
      document.getElementById("prod-name-ar").value = prod.nameAr;
      document.getElementById("prod-name-en").value = prod.nameEn;
      document.getElementById("prod-desc-ar").value = prod.descAr || "";
      document.getElementById("prod-desc-en").value = prod.descEn || "";
      document.getElementById("prod-price-before").value = prod.priceBefore || "";
      document.getElementById("prod-price-after").value = prod.priceAfter;
      document.getElementById("prod-category").value = prod.category;
      document.getElementById("prod-availability").value = prod.availability;
      document.getElementById("prod-sku").value = prod.sku || "";
      document.getElementById("prod-code").value = prod.code || "";
      document.getElementById("prod-tags").value = prod.tags || "";
      document.getElementById("prod-featured").checked = !!prod.featured;
      
      uploadedImages = [...(prod.images || [])];
      renderPreviews();

      document.getElementById("prod-modal-title").innerHTML = `<span class="lang-ar">تعديل المنتج</span><span class="lang-en">Edit Product</span>`;
      modal.classList.add("active");
    } catch (err) {
      alert("Error loading product: " + err.message);
    }
  };

  window.deleteProduct = async (id) => {
    const confirmMsg = localStorage.getItem("lang") === "ar" ? 
                       "هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً؟" : 
                       "Are you sure you want to delete this product?";

    if (confirm(confirmMsg)) {
      try {
        const headers = authHeader();
        const res = await fetch(`/.netlify/functions/delete-product?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers
        });
        if (!res.ok) throw new Error('Delete failed');
        await loadProducts();
      } catch (err) {
        alert("Error deleting product: " + err.message);
      }
    }
  };

  // Initial Boot
  await loadCategoriesDropdown();
  await loadProducts();
}

/* ==========================================================================
   6. OFFERS CRUD CONTROLLER
   ========================================================================== */
async function initOffersCRUD() {
  const tableBody = document.getElementById("offers-table-body");
  const modal = document.getElementById("off-modal");
  const form = document.getElementById("off-form");
  
  const openModalBtn = document.getElementById("open-off-modal-btn");
  const closeModalBtn = document.getElementById("close-off-modal-btn");

  const dragArea = document.getElementById("off-drag-drop");
  const fileInput = document.getElementById("off-file-input");
  const previewsContainer = document.getElementById("off-image-preview-container");
  const urlInput = document.getElementById("off-banner-url");

  if (!tableBody) return;

  let bannerImage = "";

  const loadOffers = async () => {
    try {
      const offers = await apiRequest("/offers");
      tableBody.innerHTML = offers.map(off => {
        const isCampaignActive = off.status === "active" ? 
                                 `<span class="status-badge in-stock">نشط</span>` : 
                                 `<span class="status-badge out-of-stock">معطل</span>`;
        return `
          <tr>
            <td>
              <div style="font-weight:700;">${off.titleAr}</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">${off.titleEn}</div>
            </td>
            <td style="font-weight:500; font-size:0.85rem;">${off.startDate}</td>
            <td style="font-weight:500; font-size:0.85rem; color:var(--accent);">${off.endDate}</td>
            <td>${isCampaignActive}</td>
            <td>
              <div class="admin-actions-cell">
                <button class="admin-action-btn edit" onclick="editOffer('${off.id}')" title="تعديل"><i class="fa-solid fa-pen"></i></button>
                <button class="admin-action-btn delete" onclick="deleteOffer('${off.id}')" title="حذف"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    } catch (e) {
      console.error(e);
    }
  };

  const renderBannerPreview = () => {
    if (bannerImage) {
      previewsContainer.innerHTML = `
        <div class="image-preview-wrapper" style="width:100%; aspect-ratio:3; border-radius:10px;">
          <img src="${bannerImage}" alt="" style="object-fit:cover;">
          <span class="image-preview-delete" onclick="removeBanner()">&times;</span>
        </div>
      `;
    } else {
      previewsContainer.innerHTML = "";
    }
  };

  window.removeBanner = () => {
    bannerImage = "";
    urlInput.value = "";
    renderBannerPreview();
  };

  urlInput.addEventListener("input", (e) => {
    bannerImage = e.target.value.trim();
    renderBannerPreview();
  });

  dragArea.addEventListener("click", () => fileInput.click());
  dragArea.addEventListener("dragover", (e) => e.preventDefault());
  dragArea.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          bannerImage = ev.target.result;
          renderBannerPreview();
        };
        reader.readAsDataURL(file);
      }
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        bannerImage = ev.target.result;
        renderBannerPreview();
      };
      reader.readAsDataURL(file);
    }
  });

  openModalBtn.addEventListener("click", () => {
    form.reset();
    bannerImage = "";
    renderBannerPreview();
    document.getElementById("off-id").value = "";
    document.getElementById("off-modal-title").innerHTML = `<span class="lang-ar">إضافة عرض جديد</span><span class="lang-en">Create New Offer</span>`;
    modal.classList.add("active");
  });

  closeModalBtn.addEventListener("click", () => modal.classList.remove("active"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("off-id").value;

    const data = {
      titleAr: document.getElementById("off-title-ar").value.trim(),
      titleEn: document.getElementById("off-title-en").value.trim(),
      descAr: document.getElementById("off-desc-ar").value.trim(),
      descEn: document.getElementById("off-desc-en").value.trim(),
      banner: bannerImage,
      startDate: document.getElementById("off-start-date").value,
      endDate: document.getElementById("off-end-date").value,
      status: document.getElementById("off-status").value
    };

    try {
      if (id) {
        await apiRequest("/offers", "PUT", { id, ...data });
      } else {
        await apiRequest("/offers", "POST", data);
      }
      modal.classList.remove("active");
      loadOffers();
    } catch (err) {
      alert("Error saving offer campaign: " + err.message);
    }
  });

  window.editOffer = async (id) => {
    try {
      const off = await apiRequest(`/offers/${id}`);
      if (!off) return;

      document.getElementById("off-id").value = off.id;
      document.getElementById("off-title-ar").value = off.titleAr;
      document.getElementById("off-title-en").value = off.titleEn;
      document.getElementById("off-desc-ar").value = off.descAr || "";
      document.getElementById("off-desc-en").value = off.descEn || "";
      document.getElementById("off-banner-url").value = off.banner;
      document.getElementById("off-start-date").value = off.startDate;
      document.getElementById("off-end-date").value = off.endDate;
      document.getElementById("off-status").value = off.status;
      
      bannerImage = off.banner;
      renderBannerPreview();

      document.getElementById("off-modal-title").innerHTML = `<span class="lang-ar">تعديل العرض</span><span class="lang-en">Edit Offer Campaign</span>`;
      modal.classList.add("active");
    } catch (err) {
      alert("Error loading campaign: " + err.message);
    }
  };

  window.deleteOffer = async (id) => {
    const confirmMsg = localStorage.getItem("lang") === "ar" ? 
                       "هل أنت متأكد من رغبتك في حذف هذا العرض الترويجي؟" : 
                       "Are you sure you want to delete this offer?";

    if (confirm(confirmMsg)) {
      try {
        await apiRequest(`/offers/${id}`, "DELETE");
        loadOffers();
      } catch (err) {
        alert("Error deleting offer: " + err.message);
      }
    }
  };

  // Run initial boot
  loadOffers();
}

/* ==========================================================================
   7. VIDEOS CRUD CONTROLLER
   ========================================================================== */
async function initVideosCRUD() {
  const tableBody = document.getElementById("videos-table-body");
  const modal = document.getElementById("vid-modal");
  const form = document.getElementById("vid-form");

  const openModalBtn = document.getElementById("open-vid-modal-btn");
  const closeModalBtn = document.getElementById("close-vid-modal-btn");

  const dragArea = document.getElementById("vid-drag-drop");
  const fileInput = document.getElementById("vid-file-input");
  const previewsContainer = document.getElementById("vid-image-preview-container");
  const urlInput = document.getElementById("vid-thumbnail");

  if (!tableBody) return;

  let coverImage = "";

  const loadVideos = async () => {
    try {
      const videos = await apiRequest("/videos");
      tableBody.innerHTML = videos.map(vid => {
        const cover = vid.thumbnail || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800";
        return `
          <tr>
            <td><img src="${cover}" alt="" style="width:72px; height:45px; object-fit:cover; border-radius:6px; border:1px solid var(--border-color);"></td>
            <td>
              <div style="font-weight:700;">${vid.titleAr}</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">${vid.titleEn}</div>
            </td>
            <td dir="ltr" style="font-size:0.8rem; color:var(--primary); font-weight:500;">${vid.url}</td>
            <td>
              <div class="admin-actions-cell">
                <button class="admin-action-btn edit" onclick="editVideo('${vid.id}')" title="تعديل"><i class="fa-solid fa-pen"></i></button>
                <button class="admin-action-btn delete" onclick="deleteVideo('${vid.id}')" title="حذف"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    } catch (e) {
      console.error(e);
    }
  };

  const renderCoverPreview = () => {
    if (coverImage) {
      previewsContainer.innerHTML = `
        <div class="image-preview-wrapper" style="width:120px; height:75px; border-radius:8px;">
          <img src="${coverImage}" alt="">
          <span class="image-preview-delete" onclick="removeCover()">&times;</span>
        </div>
      `;
    } else {
      previewsContainer.innerHTML = "";
    }
  };

  window.removeCover = () => {
    coverImage = "";
    urlInput.value = "";
    renderCoverPreview();
  };

  urlInput.addEventListener("input", (e) => {
    coverImage = e.target.value.trim();
    renderCoverPreview();
  });

  dragArea.addEventListener("click", () => fileInput.click());
  dragArea.addEventListener("dragover", (e) => e.preventDefault());
  dragArea.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          coverImage = ev.target.result;
          renderCoverPreview();
        };
        reader.readAsDataURL(file);
      }
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        coverImage = ev.target.result;
        renderCoverPreview();
      };
      reader.readAsDataURL(file);
    }
  });

  openModalBtn.addEventListener("click", () => {
    form.reset();
    coverImage = "";
    renderCoverPreview();
    document.getElementById("vid-id").value = "";
    document.getElementById("vid-modal-title").innerHTML = `<span class="lang-ar">إضافة فيديو جديد</span><span class="lang-en">Add New Video Review</span>`;
    modal.classList.add("active");
  });

  closeModalBtn.addEventListener("click", () => modal.classList.remove("active"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("vid-id").value;

    const data = {
      titleAr: document.getElementById("vid-title-ar").value.trim(),
      titleEn: document.getElementById("vid-title-en").value.trim(),
      url: document.getElementById("vid-url").value.trim(),
      thumbnail: coverImage
    };

    try {
      if (id) {
        await apiRequest("/videos", "PUT", { id, ...data });
      } else {
        await apiRequest("/videos", "POST", data);
      }
      modal.classList.remove("active");
      loadVideos();
    } catch (err) {
      alert("Error saving video review: " + err.message);
    }
  });

  window.editVideo = async (id) => {
    try {
      const vid = await apiRequest(`/videos/${id}`);
      if (!vid) return;

      document.getElementById("vid-id").value = vid.id;
      document.getElementById("vid-title-ar").value = vid.titleAr;
      document.getElementById("vid-title-en").value = vid.titleEn;
      document.getElementById("vid-url").value = vid.url;
      document.getElementById("vid-thumbnail").value = vid.thumbnail || "";
      
      coverImage = vid.thumbnail || "";
      renderCoverPreview();

      document.getElementById("vid-modal-title").innerHTML = `<span class="lang-ar">تعديل الفيديو</span><span class="lang-en">Edit Video Review</span>`;
      modal.classList.add("active");
    } catch (err) {
      alert("Error loading video details: " + err.message);
    }
  };

  window.deleteVideo = async (id) => {
    const confirmMsg = localStorage.getItem("lang") === "ar" ? 
                       "هل أنت متأكد من رغبتك في حذف هذا الفيديو؟" : 
                       "Are you sure you want to delete this video?";

    if (confirm(confirmMsg)) {
      try {
        await apiRequest(`/videos/${id}`, "DELETE");
        loadVideos();
      } catch (err) {
        alert("Error deleting video: " + err.message);
      }
    }
  };

  // Initial Boot
  loadVideos();
}
