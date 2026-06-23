/**
 * Green Apple - Premium Smartphone Store
 * Main Frontend Script
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize DB and Core Systems
  initLocalStorageDb();
  initThemeSystem();
  initLangSystem();
  initNavbarMobile();
  initScrollEffects();

  // Route-Specific Controllers
  const currentPath = window.location.pathname;
  if (currentPath.includes("products.html")) {
    initCatalogController();
  } else if (currentPath.includes("offers.html")) {
    initOffersController();
  } else if (currentPath.includes("about.html")) {
    // About page loads features from static HTML, but we can do setup if needed
  } else if (currentPath.includes("contact.html")) {
    // Contact page contains static form/map
  } else {
    // Default to Home Controller (index.html or root /)
    initHomeController();
  }

  // Lightbox initialization
  initLightbox();

  // Hide loading screen with a clean fade
  const loader = document.getElementById("loading-screen");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
    }, 400);
  }
});

/* ==========================================================================
   1. DATABASE SYSTEM (LOCAL STORAGE & SERVER API FALLBACK)
   ========================================================================== */
const API_BASE = '/api';

// Seed Database Mock Data
function initLocalStorageDb() {
  if (!localStorage.getItem("green_apple_initialized")) {
    localStorage.setItem("green_apple_categories", JSON.stringify([
      { id: "cat-1", nameAr: "الجوالات", nameEn: "Phones" },
      { id: "cat-2", nameAr: "الآيفونات", nameEn: "iPhones" },
      { id: "cat-3", nameAr: "الآيباد والتابلت", nameEn: "iPads & Tablets" },
      { id: "cat-4", nameAr: "الساعات الذكية", nameEn: "Smart Watches" },
      { id: "cat-5", nameAr: "السماعات", nameEn: "Headphones" },
      { id: "cat-6", nameAr: "الإكسسوارات والشواحن", nameEn: "Accessories & Chargers" },
      { id: "cat-7", nameAr: "العروض الخاصة", nameEn: "Special Offers" }
    ]));
    
    localStorage.setItem("green_apple_products", JSON.stringify([
      {
        id: "prod-1",
        nameAr: "آيفون 15 برو ماكس 256 جيجا - تيتانيوم طبيعي",
        nameEn: "iPhone 15 Pro Max 256GB - Natural Titanium",
        descAr: "الهاتف الأكثر قوة ومتانة على الإطلاق، مع تصميم من التيتانيوم القوي وخفيف الوزن وشريحة A17 Pro الثورية ونظام كاميرا متطور بمعدل تقريب 5x.",
        descEn: "The most powerful and durable iPhone ever, featuring a strong and lightweight titanium design, revolutionary A17 Pro chip, and advanced 5x Telephoto camera system.",
        priceBefore: 1399,
        priceAfter: 1199,
        category: "الآيفونات",
        availability: "in-stock",
        featured: true,
        sku: "IPH15PM-NT-256",
        code: "GA-1001",
        tags: "iPhone, Apple, Pro Max",
        images: [
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800",
          "https://images.unsplash.com/photo-1695048065007-ee9544749b39?q=80&w=800"
        ],
        rating: 4.9,
        views: 1240
      },
      {
        id: "prod-2",
        nameAr: "سماعات أبل إيربودز برو 2 (منفذ USB-C)",
        nameEn: "Apple AirPods Pro 2nd Gen (USB-C)",
        descAr: "إلغاء الضوضاء النشط بمعدل ضعفين، وشفافية الصوت التكيفية، وتتبع الصوت ثلاثي الأبعاد المخصص، علبة شحن MagSafe مع منفذ Type-C.",
        descEn: "Up to 2x more Active Noise Cancellation, Adaptive Audio transparency, and Personalized Spatial Audio. MagSafe Charging Case with USB-C.",
        priceBefore: 249,
        priceAfter: 199,
        category: "السماعات",
        availability: "in-stock",
        featured: true,
        sku: "AIRPODSP2-USBC",
        code: "GA-2002",
        tags: "AirPods, Apple, Audio",
        images: [
          "https://images.unsplash.com/photo-1588449668365-d15e397f6787?q=80&w=800",
          "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800"
        ],
        rating: 4.8,
        views: 890
      },
      {
        id: "prod-3",
        nameAr: "ساعة أبل الجيل التاسع 45 ملم - أسود",
        nameEn: "Apple Watch Series 9 45mm - Midnight",
        descAr: "شاشة أكثر سطوعاً، ومعالج S9 الثوري، وحركة الضغط المزدوج السحرية للتفاعل من دون لمس الشاشة، بالإضافة لميزات تتبع اللياقة والصحة.",
        descEn: "Brighter display, revolutionary S9 chip, and magical double tap gesture to interact without touching the screen, along with advanced fitness tracking.",
        priceBefore: 429,
        priceAfter: 379,
        category: "الساعات الذكية",
        availability: "in-stock",
        featured: false,
        sku: "AW9-45-MN",
        code: "GA-3003",
        tags: "Apple Watch, Series 9",
        images: [
          "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=800"
        ],
        rating: 4.7,
        views: 450
      },
      {
        id: "prod-4",
        nameAr: "شاحن أبل الأصلي 20 واط منفذ USB-C",
        nameEn: "Apple 20W USB-C Power Adapter - Original",
        descAr: "شاحن جداري أصلي بقوة 20 واط، يدعم الشحن السريع لأجهزة الآيفون والآيباد بكفاءة وأمان تام.",
        descEn: "Original 20W wall adapter. Fast charging for your iPhones and iPads with maximum safety and efficiency.",
        priceBefore: 29,
        priceAfter: 19,
        category: "الإكسسوارات والشواحن",
        availability: "in-stock",
        featured: false,
        sku: "APP-20W-ADP",
        code: "GA-4004",
        tags: "Charger, Apple, Original",
        images: [
          "https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=800"
        ],
        rating: 4.9,
        views: 2310
      }
    ]));

    localStorage.setItem("green_apple_offers", JSON.stringify([
      {
        id: "off-1",
        titleAr: "عرض الصيف الكاسح: آيفون 15 برو ماكس",
        titleEn: "Summer Deal: iPhone 15 Pro Max",
        descAr: "وفر 200 دولار عند شرائك آيفون 15 برو ماكس واحصل على شاحن أصلي وحماية شاشة مجاناً!",
        descEn: "Save $200 on iPhone 15 Pro Max and get an original 20W charger and glass screen protector for free!",
        banner: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=1200",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 Days countdown
        status: "active"
      }
    ]));

    localStorage.setItem("green_apple_videos", JSON.stringify([
      {
        id: "vid-1",
        titleAr: "مراجعة آيفون 15 برو ماكس - القوة والتصميم والتيتانيوم",
        titleEn: "iPhone 15 Pro Max Review - Titanium Design & Power",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800"
      }
    ]));

    localStorage.setItem("green_apple_views", "3840");
    localStorage.setItem("green_apple_initialized", "true");
  }
}

// Master API request Router
async function apiRequest(endpoint, method = "GET", data = null) {
  const isLocalHostOrStatic = !window.location.origin.includes("netlify.app") && 
                              !window.location.origin.includes("localhost:8888") &&
                              !window.location.origin.includes("127.0.0.1:8888");

  if (isLocalHostOrStatic || localStorage.getItem("force_local_db") === "true") {
    return handleLocalDb(endpoint, method, data);
  }

  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" }
    };
    if (data) options.body = JSON.stringify(data);
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    if (!res.ok) throw new Error("Server API Error");
    return await res.json();
  } catch (error) {
    console.warn(`Server API failed on ${endpoint}, routing to LocalStorage fallback`, error);
    localStorage.setItem("force_local_db", "true");
    return handleLocalDb(endpoint, method, data);
  }
}

// Emulates Backend in LocalStorage
function handleLocalDb(endpoint, method, data) {
  const resource = endpoint.split("/")[1]; // e.g. "products", "categories", "offers", "videos", "stats"
  const dbKey = `green_apple_${resource}`;
  
  if (endpoint === "/stats" && method === "GET") {
    const cats = JSON.parse(localStorage.getItem("green_apple_categories") || "[]");
    const prods = JSON.parse(localStorage.getItem("green_apple_products") || "[]");
    const offs = JSON.parse(localStorage.getItem("green_apple_offers") || "[]");
    const vids = JSON.parse(localStorage.getItem("green_apple_videos") || "[]");
    let views = parseInt(localStorage.getItem("green_apple_views") || "3840", 10);
    
    // Increment view count on stats load
    views += 1;
    localStorage.setItem("green_apple_views", views.toString());

    return Promise.resolve({
      categories: cats.length,
      products: prods.length,
      offers: offs.length,
      videos: vids.length,
      views: views
    });
  }

  if (endpoint === "/auth/login" && method === "POST") {
    if (data.username === "admin" && data.password === "greenapple2026") {
      return Promise.resolve({ success: true, token: "token-greenapple-2026-auth" });
    }
    return Promise.reject(new Error("Invalid credentials"));
  }

  let db = JSON.parse(localStorage.getItem(dbKey) || "[]");

  // Read list
  if (method === "GET") {
    const id = endpoint.split("/")[2];
    if (id) {
      const item = db.find(x => x.id === id);
      if (item && resource === "products") {
        item.views = (item.views || 0) + 1;
        localStorage.setItem(dbKey, JSON.stringify(db));
      }
      return Promise.resolve(item || null);
    }
    return Promise.resolve(db);
  }

  // Create
  if (method === "POST") {
    const newItem = {
      id: `${resource.slice(0, 3)}-${Date.now()}`,
      ...data
    };
    if (resource === "products") {
      newItem.rating = 5.0;
      newItem.views = 0;
    }
    db.push(newItem);
    localStorage.setItem(dbKey, JSON.stringify(db));
    return Promise.resolve(newItem);
  }

  // Update
  if (method === "PUT") {
    const idx = db.findIndex(x => x.id === data.id);
    if (idx !== -1) {
      db[idx] = { ...db[idx], ...data };
      localStorage.setItem(dbKey, JSON.stringify(db));
      return Promise.resolve(db[idx]);
    }
    return Promise.reject(new Error("Item not found"));
  }

  // Delete
  if (method === "DELETE") {
    const id = endpoint.split("/")[2] || data.id;
    db = db.filter(x => x.id !== id);
    localStorage.setItem(dbKey, JSON.stringify(db));
    return Promise.resolve({ success: true, id });
  }

  return Promise.reject(new Error("Route not configured"));
}

/* ==========================================================================
   2. THEME & LANGUAGE MANAGEMENT
   ========================================================================== */
function initThemeSystem() {
  // Support both old single-btn and new segmented control
  const segmented = document.querySelector(".theme-segmented");
  const oldBtn = document.getElementById("theme-toggle-btn");

  // Determine active theme and apply to document
  const applyTheme = (theme) => {
    localStorage.setItem("theme", theme);
    if (theme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.remove("light-mode");
      } else {
        document.documentElement.classList.add("light-mode");
      }
    } else if (theme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  };

  const updateSegmentedUI = (theme) => {
    if (!segmented) return;
    const indicator = segmented.querySelector(".theme-seg-indicator");
    const buttons = segmented.querySelectorAll(".theme-seg-btn");
    const isRtl = document.documentElement.dir === "rtl";

    buttons.forEach((btn, i) => {
      btn.classList.toggle("active", btn.dataset.theme === theme);
    });

    // Find the active button and move indicator to it
    const activeBtn = segmented.querySelector(`.theme-seg-btn[data-theme="${theme}"]`);
    if (activeBtn && indicator) {
      const segRect = segmented.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      const offset = 3; // padding
      if (isRtl) {
        const right = segRect.right - btnRect.right + offset;
        indicator.style.right = right + "px";
        indicator.style.left = "auto";
      } else {
        const left = btnRect.left - segRect.left - offset + offset;
        indicator.style.left = (btnRect.left - segRect.left) + "px";
        indicator.style.left = (activeBtn.offsetLeft) + "px";
      }
      indicator.style.width = btnRect.width + "px";
    }
  };

  // Handle old single button (fallback)
  if (oldBtn && !segmented) {
    const updateOldBtn = (theme) => {
      if (theme === "light") {
        oldBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      } else if (theme === "auto") {
        oldBtn.innerHTML = '<i class="fa-solid fa-leaf"></i>';
      } else {
        oldBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      }
    };
    const t = localStorage.getItem("theme") || "dark";
    applyTheme(t);
    updateOldBtn(t);
    oldBtn.addEventListener("click", () => {
      const cur = localStorage.getItem("theme") || "dark";
      const next = cur === "dark" ? "light" : cur === "light" ? "auto" : "dark";
      applyTheme(next);
      updateOldBtn(next);
    });
    return;
  }

  if (!segmented) return;

  const initialTheme = localStorage.getItem("theme") || "dark";
  applyTheme(initialTheme);
  // Defer indicator position until layout is ready
  requestAnimationFrame(() => updateSegmentedUI(initialTheme));

  segmented.querySelectorAll(".theme-seg-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
      updateSegmentedUI(theme);
    });
  });

  // Listen for system preference changes when in auto mode
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (localStorage.getItem("theme") === "auto") {
      applyTheme("auto");
    }
  });
}

function initLangSystem() {
  const langBtn = document.getElementById("lang-toggle-btn");
  if (!langBtn) return;

  const updateLangUI = (lang) => {
    localStorage.setItem("lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;

    if (lang === "ar") {
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
    }

    // Update pill button text if it exists
    const pillText = langBtn.querySelector(".lang-pill-text");
    if (pillText) {
      pillText.textContent = lang === "ar" ? "EN" : "عربية";
    }
  };

  const initialLang = localStorage.getItem("lang") || "ar";
  updateLangUI(initialLang);

  langBtn.addEventListener("click", () => {
    const currentLang = localStorage.getItem("lang") || "ar";
    const newLang = currentLang === "ar" ? "en" : "ar";
    updateLangUI(newLang);
    // Reload to redraw language-dependent dynamic content
    window.location.reload();
  });
}

/* ==========================================================================
   3. RESPONSIVE NAVIGATION & SCROLL ORNAMENTALS
   ========================================================================== */
function initNavbarMobile() {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const icon = menuToggle.querySelector("i");
      if (navMenu.classList.contains("active")) {
        icon.className = "fa-solid fa-xmark";
      } else {
        icon.className = "fa-solid fa-bars";
      }
    });
  }
}

function initScrollEffects() {
  const header = document.querySelector("header");
  const backToTop = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    // Header Glass morph switch
    if (window.scrollY > 50) {
      header.style.padding = "4px 0";
      header.style.background = "var(--glass-bg)";
    } else {
      header.style.padding = "0";
    }

    // Scroll to Top trigger
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add("active");
      } else {
        backToTop.classList.remove("active");
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* ==========================================================================
   4. HOME PAGE CONTROLLER (index.html)
   ========================================================================== */
async function initHomeController() {
  const categoriesContainer = document.getElementById("categories-container");
  const featuredContainer = document.getElementById("featured-products-container");
  const offersContainer = document.getElementById("index-offers-container");
  const videosContainer = document.getElementById("videos-container");

  const lang = localStorage.getItem("lang") || "ar";

  // Load Categories
  if (categoriesContainer) {
    try {
      const categories = await apiRequest("/categories");
      categoriesContainer.innerHTML = categories.map(cat => {
        const name = lang === "ar" ? cat.nameAr : cat.nameEn;
        // Generate an icon template mapping
        let icon = "fa-mobile-screen-button";
        if (name.includes("ساعة") || name.includes("Watch")) icon = "fa-clock";
        if (name.includes("سماعة") || name.includes("Head")) icon = "fa-headphones-simple";
        if (name.includes("إكسسوار") || name.includes("Access")) icon = "fa-plug";
        if (name.includes("عرض") || name.includes("Offer")) icon = "fa-tags";
        if (name.includes("آيباد") || name.includes("iPad") || name.includes("تابلت")) icon = "fa-tablet-screen-button";
        
        return `
          <div class="category-card glass" onclick="location.href='products.html?cat=${encodeURIComponent(cat.nameAr)}'">
            <i class="fa-solid ${icon}"></i>
            <span>${name}</span>
          </div>
        `;
      }).join("");
    } catch (e) {
      console.error(e);
    }
  }

  // Load Featured Products
  if (featuredContainer) {
    try {
      const products = await apiRequest("/products");
      const featured = products.filter(p => p.featured === true).slice(0, 8);
      
      if (featured.length === 0) {
        featuredContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">
          ${lang === "ar" ? "لا توجد منتجات مميزة حالياً." : "No featured products available."}
        </p>`;
      } else {
        featuredContainer.innerHTML = featured.map(prod => renderProductCard(prod, lang)).join("");
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Load Banners / Offers
  if (offersContainer) {
    try {
      const offers = await apiRequest("/offers");
      const active = offers.filter(o => o.status === "active").slice(0, 1); // Get main hero offer

      if (active.length > 0) {
        const offer = active[0];
        const title = lang === "ar" ? offer.titleAr : offer.titleEn;
        const desc = lang === "ar" ? offer.descAr : offer.descEn;
        
        offersContainer.innerHTML = `
          <div class="offer-banner-card glass">
            <img src="${offer.banner || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=1200'}" alt="${title}" class="offer-banner-bg">
            <div class="offer-banner-content">
              <h3 class="offer-title">${title}</h3>
              <p class="offer-desc">${desc}</p>
              
              <!-- Countdown timer -->
              <div class="countdown-container" data-date="${offer.endDate}">
                <div class="countdown-box">
                  <span class="countdown-num" id="days">00</span>
                  <span class="countdown-label">${lang === 'ar' ? 'يوم' : 'Days'}</span>
                </div>
                <div class="countdown-box">
                  <span class="countdown-num" id="hours">00</span>
                  <span class="countdown-label">${lang === 'ar' ? 'ساعة' : 'Hours'}</span>
                </div>
                <div class="countdown-box">
                  <span class="countdown-num" id="minutes">00</span>
                  <span class="countdown-label">${lang === 'ar' ? 'دقيقة' : 'Min'}</span>
                </div>
                <div class="countdown-box">
                  <span class="countdown-num" id="seconds">00</span>
                  <span class="countdown-label">${lang === 'ar' ? 'ثانية' : 'Sec'}</span>
                </div>
              </div>
              
              <div>
                <a href="products.html" class="btn-primary">
                  <span class="lang-ar">استفد من العرض</span>
                  <span class="lang-en">Claim Offer</span>
                </a>
              </div>
            </div>
          </div>
        `;
        startCountdownTimer(offer.endDate);
      } else {
        offersContainer.parentElement.style.display = "none"; // Hide section if no offers
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Load Videos
  if (videosContainer) {
    try {
      const videos = await apiRequest("/videos");
      if (videos.length === 0) {
        videosContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">
          ${lang === "ar" ? "لا توجد عروض فيديو حالياً." : "No videos available."}
        </p>`;
      } else {
        videosContainer.innerHTML = videos.map(vid => renderVideoCard(vid, lang)).join("");
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Reviews dots animation
  initReviewsSlider();
}

/* ==========================================================================
   5. CATALOG CONTROLLER (products.html)
   ========================================================================== */
let allProducts = [];
let filteredProducts = [];

async function initCatalogController() {
  const catFilterContainer = document.getElementById("filter-categories-list");
  const productsContainer = document.getElementById("catalog-products-container");
  const searchInput = document.getElementById("catalog-search");
  const sortSelect = document.getElementById("catalog-sort");
  const priceSlider = document.getElementById("price-range");
  const priceVal = document.getElementById("price-range-val");

  const lang = localStorage.getItem("lang") || "ar";

  // Set URL category pre-filter if redirected from home screen
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedCat = urlParams.get("cat");

  // Load Categories into Sidebar
  if (catFilterContainer) {
    try {
      const categories = await apiRequest("/categories");
      catFilterContainer.innerHTML = categories.map(cat => {
        const name = lang === "ar" ? cat.nameAr : cat.nameEn;
        const checked = preSelectedCat === cat.nameAr ? "checked" : "";
        return `
          <label class="admin-checkbox-group" style="margin-bottom:8px; cursor:pointer;">
            <input type="checkbox" value="${cat.nameAr}" class="category-filter-checkbox" ${checked}>
            <span>${name}</span>
          </label>
        `;
      }).join("");

      // Bind filter events to checkboxes
      document.querySelectorAll(".category-filter-checkbox").forEach(chk => {
        chk.addEventListener("change", applyFilters);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Load Products
  if (productsContainer) {
    try {
      allProducts = await apiRequest("/products");
      filteredProducts = [...allProducts];
      
      // Update price range slider boundary dynamically
      if (allProducts.length > 0) {
        const maxPrice = Math.max(...allProducts.map(p => p.priceAfter));
        priceSlider.max = Math.ceil(maxPrice);
        priceSlider.value = Math.ceil(maxPrice);
        priceVal.textContent = `$${Math.ceil(maxPrice)}`;
      }

      applyFilters();

      // Bind slide events
      priceSlider.addEventListener("input", (e) => {
        priceVal.textContent = `$${e.target.value}`;
        applyFilters();
      });

      // Bind search event
      searchInput.addEventListener("input", applyFilters);

      // Bind sort event
      sortSelect.addEventListener("change", applyFilters);

    } catch (e) {
      console.error(e);
    }
  }

  function applyFilters() {
    let result = [...allProducts];

    // 1. Category Filter
    const activeCats = Array.from(document.querySelectorAll(".category-filter-checkbox:checked")).map(chk => chk.value);
    if (activeCats.length > 0) {
      result = result.filter(p => activeCats.includes(p.category));
    }

    // 2. Price filter
    const limitPrice = parseFloat(priceSlider.value);
    result = result.filter(p => p.priceAfter <= limitPrice);

    // 3. Search filter
    const term = searchInput.value.toLowerCase().trim();
    if (term) {
      result = result.filter(p => 
        (p.nameAr && p.nameAr.toLowerCase().includes(term)) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(term)) ||
        (p.sku && p.sku.toLowerCase().includes(term)) ||
        (p.code && p.code.toLowerCase().includes(term)) ||
        (p.tags && p.tags.toLowerCase().includes(term))
      );
    }

    // 4. Sorting
    const sortVal = sortSelect.value;
    if (sortVal === "newest") {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortVal === "oldest") {
      result.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortVal === "price-desc") {
      result.sort((a, b) => b.priceAfter - a.priceAfter);
    } else if (sortVal === "price-asc") {
      result.sort((a, b) => a.priceAfter - b.priceAfter);
    } else if (sortVal === "popular") {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    filteredProducts = result;
    renderCatalog();
  }

  function renderCatalog() {
    const emptyState = document.getElementById("catalog-empty-state");
    if (filteredProducts.length === 0) {
      productsContainer.innerHTML = "";
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      productsContainer.innerHTML = filteredProducts.map(prod => renderProductCard(prod, lang)).join("");
    }
  }
}

/* ==========================================================================
   6. OFFERS PAGE CONTROLLER (offers.html)
   ========================================================================== */
async function initOffersController() {
  const offersListContainer = document.getElementById("offers-list-container");
  const offersVideosContainer = document.getElementById("offers-videos-container");
  const lang = localStorage.getItem("lang") || "ar";

  if (offersListContainer) {
    try {
      const offers = await apiRequest("/offers");
      const active = offers.filter(o => o.status === "active");

      if (active.length === 0) {
        offersListContainer.innerHTML = `
          <div style="text-align:center; padding:50px;">
            <i class="fa-solid fa-tags" style="font-size:3rem; color:var(--text-muted); margin-bottom:16px;"></i>
            <h3>${lang === 'ar' ? 'لا توجد عروض ترويجية نشطة حالياً.' : 'No active promotional campaigns currently.'}</h3>
          </div>
        `;
      } else {
        offersListContainer.innerHTML = active.map(offer => {
          const title = lang === "ar" ? offer.titleAr : offer.titleEn;
          const desc = lang === "ar" ? offer.descAr : offer.descEn;
          const uqId = `timer-${offer.id}`;
          
          setTimeout(() => startCountdownTimer(offer.endDate, uqId), 100);

          return `
            <div class="offer-banner-card glass" style="margin-bottom: 30px;">
              <img src="${offer.banner || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=1200'}" alt="${title}" class="offer-banner-bg">
              <div class="offer-banner-content">
                <h3 class="offer-title">${title}</h3>
                <p class="offer-desc">${desc}</p>
                
                <div class="countdown-container" id="${uqId}">
                  <div class="countdown-box">
                    <span class="countdown-num" class="days">00</span>
                    <span class="countdown-label">${lang === 'ar' ? 'يوم' : 'Days'}</span>
                  </div>
                  <div class="countdown-box">
                    <span class="countdown-num" class="hours">00</span>
                    <span class="countdown-label">${lang === 'ar' ? 'ساعة' : 'Hours'}</span>
                  </div>
                  <div class="countdown-box">
                    <span class="countdown-num" class="minutes">00</span>
                    <span class="countdown-label">${lang === 'ar' ? 'دقيقة' : 'Min'}</span>
                  </div>
                  <div class="countdown-box">
                    <span class="countdown-num" class="seconds">00</span>
                    <span class="countdown-label">${lang === 'ar' ? 'ثانية' : 'Sec'}</span>
                  </div>
                </div>
                
                <div>
                  <a href="products.html" class="btn-primary">
                    <span class="lang-ar">تصفح المنتجات المشمولة</span>
                    <span class="lang-en">Shop Sale Items</span>
                  </a>
                </div>
              </div>
            </div>
          `;
        }).join("");
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (offersVideosContainer) {
    try {
      const videos = await apiRequest("/videos");
      if (videos.length === 0) {
        offersVideosContainer.parentElement.style.display = "none";
      } else {
        offersVideosContainer.innerHTML = videos.map(vid => renderVideoCard(vid, lang)).join("");
      }
    } catch (e) {
      console.error(e);
    }
  }
}

/* ==========================================================================
   7. HTML COMPONENT RENDERERS
   ========================================================================== */
function renderProductCard(prod, lang) {
  const name = lang === "ar" ? prod.nameAr : prod.nameEn;
  const desc = lang === "ar" ? prod.descAr : prod.descEn;
  
  // Calculate discount percentage
  let discountBadge = "";
  if (prod.priceBefore > prod.priceAfter) {
    const pct = Math.round(((prod.priceBefore - prod.priceAfter) / prod.priceBefore) * 100);
    discountBadge = `<span class="product-card-badge">-${pct}%</span>`;
  }

  const stockText = prod.availability === "in-stock" ? 
                    (lang === "ar" ? "متوفر" : "In Stock") : 
                    (lang === "ar" ? "نفذت الكمية" : "Out of Stock");

  const btnText = lang === "ar" ? "أطلب الآن" : "Order Now";
  const categoryText = prod.category;

  // Single or multiple gallery images
  const images = prod.images && prod.images.length > 0 ? prod.images : ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800"];
  
  // Build details to redirect WhatsApp checkout
  const waLink = generateWhatsappLink(prod);

  // Gallery slider dots inside cards if multiple images
  let dotsHtml = "";
  if (images.length > 1) {
    dotsHtml = `<div class="mini-gallery-dots">` + 
      images.map((_, i) => `<span class="mini-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>`).join("") + 
      `</div>`;
  }

  return `
    <div class="product-card glass" id="pcard-${prod.id}">
      ${discountBadge}
      <div class="product-card-image" data-images='${JSON.stringify(images)}' data-current="0">
        <img src="${images[0]}" alt="${name}" class="gallery-target-img">
        ${dotsHtml}
      </div>
      <div class="product-card-info">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="product-card-cat">${categoryText}</span>
          <span class="status-badge ${prod.availability}">${stockText}</span>
        </div>
        <h3 class="product-card-title">${name}</h3>
        <p class="product-card-desc">${desc}</p>
        
        <div class="product-card-meta">
          <div class="product-card-price">
            ${prod.priceBefore > prod.priceAfter ? `<span class="price-before">$${prod.priceBefore}</span>` : ""}
            <span class="price-after">$${prod.priceAfter}</span>
          </div>
          <div class="product-card-rating">
            <i class="fa-solid fa-star"></i>
            <span>${prod.rating || 5.0}</span>
          </div>
        </div>

        <button onclick="window.open('${waLink}', '_blank')" class="btn-primary product-card-btn" ${prod.availability === 'out-of-stock' ? 'disabled style="background:gray;box-shadow:none;"' : ''}>
          <i class="fa-brands fa-whatsapp"></i>
          <span>${btnText}</span>
        </button>
      </div>
    </div>
  `;
}

// Inline image preview carousel on hovering product cards
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("mini-dot")) {
    const dot = e.target;
    const cardImgContainer = dot.closest(".product-card-image");
    const targetImg = cardImgContainer.querySelector(".gallery-target-img");
    const images = JSON.parse(cardImgContainer.getAttribute("data-images"));
    const idx = parseInt(dot.getAttribute("data-idx"), 10);
    
    // Switch active dot
    cardImgContainer.querySelectorAll(".mini-dot").forEach(d => d.classList.remove("active"));
    dot.classList.add("active");

    // Change source
    targetImg.src = images[idx];
    cardImgContainer.setAttribute("data-current", idx.toString());
  }
});

function renderVideoCard(vid, lang) {
  const title = lang === "ar" ? vid.titleAr : vid.titleEn;
  return `
    <div class="video-card glass">
      <div class="video-player-wrapper">
        <video src="${vid.url}" preload="metadata" poster="${vid.thumbnail || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800'}"></video>
        <div class="video-overlay-play">
          <div class="play-btn-circle"><i class="fa-solid fa-play"></i></div>
        </div>
      </div>
      <div class="video-card-info">
        <h4 class="video-card-title">${title}</h4>
      </div>
    </div>
  `;
}

// Bind custom video play/pause toggles
document.addEventListener("click", (e) => {
  const playBtn = e.target.closest(".video-overlay-play");
  if (playBtn) {
    const video = playBtn.previousElementSibling;
    const overlay = playBtn;
    if (video.paused) {
      // Pause all other playing videos on screen
      document.querySelectorAll("video").forEach(v => {
        if (v !== video) {
          v.pause();
          if (v.nextElementSibling) v.nextElementSibling.style.opacity = "1";
        }
      });
      video.play();
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      video.controls = true;
    }
  }
});

// Resets cover details when video exits
document.addEventListener("pause", (e) => {
  const video = e.target;
  const overlay = video.nextElementSibling;
  if (overlay && overlay.classList.contains("video-overlay-play")) {
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    video.controls = false;
  }
}, true);

/* ==========================================================================
   8. WHATSAPP ORDER REDIRECT LINK GENERATOR
   ========================================================================== */
function generateWhatsappLink(product) {
  const phone = "967770006661";
  const currentLang = localStorage.getItem("lang") || "ar";
  const productUrl = `${window.location.origin}/products.html?id=${product.id}`;
  
  let text = "";
  if (currentLang === "ar") {
    text = `السلام عليكم\n\nأرغب بطلب المنتج التالي:\n\n*اسم المنتج:* ${product.nameAr}\n*الوصف:* ${product.descAr}\n*السعر قبل الخصم:* $${product.priceBefore}\n*السعر بعد الخصم:* $${product.priceAfter}\n*رابط المنتج:* ${productUrl}\n\nهل المنتج متوفر؟`;
  } else {
    text = `Hello,\n\nI would like to order the following product:\n\n*Product Name:* ${product.nameEn}\n*Description:* ${product.descEn}\n*Price Before:* $${product.priceBefore}\n*Price After:* $${product.priceAfter}\n*Product URL:* ${productUrl}\n\nIs this product available?`;
  }
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/* ==========================================================================
   9. COUNTDOWN TIMER SCHEDULER
   ========================================================================== */
function startCountdownTimer(endDateStr, containerId = null) {
  const updateTimer = () => {
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    let container = null;
    if (containerId) {
      container = document.getElementById(containerId);
    } else {
      container = document.querySelector(".countdown-container");
    }

    if (!container) return false;

    const daysEl = container.querySelector("#days") || container.querySelector(".days");
    const hoursEl = container.querySelector("#hours") || container.querySelector(".hours");
    const minutesEl = container.querySelector("#minutes") || container.querySelector(".minutes");
    const secondsEl = container.querySelector("#seconds") || container.querySelector(".seconds");

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      return clearInterval(timerId);
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = d.toString().padStart(2, "0");
    if (hoursEl) hoursEl.textContent = h.toString().padStart(2, "0");
    if (minutesEl) minutesEl.textContent = m.toString().padStart(2, "0");
    if (secondsEl) secondsEl.textContent = s.toString().padStart(2, "0");
  };

  updateTimer();
  const timerId = setInterval(updateTimer, 1000);
}

/* ==========================================================================
   10. LIGHTBOX & CUSTOMERS SLIDER HANDLERS
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById("lightbox-modal");
  const modalImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (!modal) return;

  let galleryItems = [];
  let currentIndex = 0;

  // Add click support to generic triggers
  document.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    
    // Support clicking main images on cards for details zoom
    const cardImg = e.target.closest(".product-card-image img");
    
    if (item) {
      galleryItems = Array.from(document.querySelectorAll(".gallery-item")).map(i => i.getAttribute("data-src"));
      currentIndex = galleryItems.indexOf(item.getAttribute("data-src"));
      openLightbox();
    } else if (cardImg) {
      const container = cardImg.closest(".product-card-image");
      galleryItems = JSON.parse(container.getAttribute("data-images"));
      currentIndex = parseInt(container.getAttribute("data-current") || "0", 10);
      openLightbox();
    }
  });

  function openLightbox() {
    modal.classList.add("active");
    modalImg.src = galleryItems[currentIndex];
    
    // Hide navigation arrows if single image
    if (galleryItems.length <= 1) {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    } else {
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    modalImg.src = galleryItems[currentIndex];
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    modalImg.src = galleryItems[currentIndex];
  }

  if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  if (nextBtn) nextBtn.addEventListener("click", showNext);
  if (prevBtn) prevBtn.addEventListener("click", showPrev);

  // Close modal when background is clicked
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("lightbox-content-wrapper")) {
      modal.classList.remove("active");
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") modal.classList.remove("active");
    if (e.key === "ArrowRight") {
      const isRTL = document.documentElement.dir === "rtl";
      isRTL ? showPrev() : showNext();
    }
    if (e.key === "ArrowLeft") {
      const isRTL = document.documentElement.dir === "rtl";
      isRTL ? showNext() : showPrev();
    }
  });
}

function initReviewsSlider() {
  const wrapper = document.getElementById("reviews-wrapper");
  const dots = document.querySelectorAll(".reviews-nav-dot");

  if (!wrapper || dots.length === 0) return;

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      dots.forEach(d => d.classList.remove("active"));
      dot.classList.add("active");
      
      const slideIndex = parseInt(dot.getAttribute("data-slide"), 10);
      const isRTL = document.documentElement.dir === "rtl";
      
      if (isRTL) {
        wrapper.style.transform = `translateX(${slideIndex * 100}%)`;
      } else {
        wrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
      }
    });
  });
}
