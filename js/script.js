/**
 * Green Apple - Premium Smartphone Store
 * Main Frontend Script
 */

document.addEventListener("DOMContentLoaded", () => {
  // Ensure loader always hides even if initialization throws
  const loader = document.getElementById("loading-screen");
  try {
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

    // Lightbox initialization (guarded in try/catch inside function if needed)
    if (typeof initLightbox === 'function') {
      try { initLightbox(); } catch (e) { console.warn('Lightbox init failed', e); }
    }
  } catch (err) {
    // Log any initialization errors so they can be debugged
    console.error("Initialization error:", err);
  } finally {
    // Hide loading screen with a clean fade regardless of errors
    if (loader) {
      try {
        setTimeout(() => {
          loader.style.opacity = "0";
          loader.style.visibility = "hidden";
        }, 400);
      } catch (e) {
        // If setting styles fails, remove the element as a last resort
        try { loader.remove(); } catch (ex) { /* ignore */ }
      }
    }
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
        descAr: "الهاتف الأكثر قوة ومتانة على الإطلاق، مع تصميم من التيتانيوم القوي وخفيف الوزن وشريحة A17 Pro الثوري.[...]",
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
        descAr: "إلغاء الضوضاء النشط بمعدل ضعفين...",
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
        descAr: "شاشة أكثر سطوعاً، ومعالج S9 الثوري...",
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

// Helper: static host detection and localStorage cache for GET responses
const STATIC_HOST_SUFFIXES = ['github.io', 'netlify.app'];
const CACHE_PREFIX = 'greenapple:apiCache:';
const DEFAULT_TTL = 1000 * 60 * 60 * 24; // 24 hours

function isStaticHost(hostname) {
  if (!hostname) return false;
  const h = hostname.split(':')[0].toLowerCase();
  return STATIC_HOST_SUFFIXES.some(suffix => h === suffix || h.endsWith('.' + suffix));
}

function cacheKey(url, method = 'GET') {
  return `${CACHE_PREFIX}${method.toUpperCase()}::${url}`;
}

function saveToCache(url, method, bodyText, contentType) {
  if (typeof localStorage === 'undefined') return;
  try {
    const payload = {
      ts: Date.now(),
      body: bodyText,
      contentType: contentType || ''
    };
    localStorage.setItem(cacheKey(url, method), JSON.stringify(payload));
  } catch (e) {
    // ignore quota errors
  }
}

function readFromCache(url, method, maxAge = DEFAULT_TTL) {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(cacheKey(url, method));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.ts && (Date.now() - parsed.ts) > maxAge) {
      localStorage.removeItem(cacheKey(url, method));
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

async function parseResponseText(text, contentType) {
  if (!contentType) return text;
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }
  return text;
}

// Master API request Router
async function apiRequest(endpoint, method = "GET", data = null) {
  // Determine resolved URL (absolute) when possible
  const resolvedUrl = (/^https?:\/\//i.test(endpoint)) ? endpoint : (window.location.origin + API_BASE + endpoint);
  const hostname = window.location.hostname || '';
  const staticHost = isStaticHost(hostname);

  // If developer forced local DB, always use local
  if (localStorage.getItem("force_local_db") === "true") {
    return handleLocalDb(endpoint, method, data);
  }

  // Attempt network call
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" }
    };
    if (data) options.body = JSON.stringify(data);

    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const text = await res.text();
    const contentType = res.headers.get('content-type') || '';

    // Cache successful GET responses for static hosts (or all GETs if you prefer)
    if ((method === 'GET' || method === 'HEAD') && res.ok && isStaticHost(hostname)) {
      saveToCache(resolvedUrl, method, text, contentType);
    }

    if (!res.ok) throw new Error('Server API Error');

    return await parseResponseText(text, contentType);
  } catch (error) {
    console.warn(`Server API failed on ${endpoint}, attempting fallback.`, error);

    // If this app is served from a static host (Netlify/GitHub Pages), try localStorage fallback
    if (staticHost) {
      const cached = readFromCache(resolvedUrl, method);
      if (cached) {
        const parsed = await parseResponseText(cached.body, cached.contentType);
        return parsed;
      }
    }

    // As a last resort, enable force_local_db and return the local handler
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
  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (localStorage.getItem("theme") === "auto") {
        applyTheme("auto");
      }
    });
  } catch (e) {
    // Older browsers may not support addEventListener on MediaQueryList
    console.warn('matchMedia.addEventListener not supported, skipping listener', e);
  }
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

  // Guard header access to avoid exceptions on pages with a different structure
  window.addEventListener("scroll", () => {
    try {
      // Header Glass morph switch
      if (header) {
        if (window.scrollY > 50) {
          header.style.padding = "4px 0";
          header.style.background = "var(--glass-bg)";
        } else {
          header.style.padding = "0";
        }
      }

      // Scroll to Top trigger
      if (backToTop) {
        if (window.scrollY > 400) {
          backToTop.classList.add("active");
        } else {
          backToTop.classList.remove("active");
        }
      }
    } catch (e) {
      console.warn('scroll handler error', e);
    }
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function initHomeController() {
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
        try { startCountdownTimer(offer.endDate); } catch(e){ console.warn('countdown start failed', e); }
      } else {
        if (offersContainer.parentElement) offersContainer.parentElement.style.display = "none"; // Hide section if no offers
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
  try { initReviewsSlider(); } catch(e) { /* non-fatal */ }
}

/* Rest of file unchanged (controllers, renderers etc.) */
