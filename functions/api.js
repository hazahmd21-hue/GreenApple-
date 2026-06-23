const { getStore } = require("@netlify/blobs");

// In-memory fallback if Blobs are not available
let localDb = {
  categories: [
    { id: "cat-1", nameAr: "الجوالات", nameEn: "Phones" },
    { id: "cat-2", nameAr: "الآيفونات", nameEn: "iPhones" },
    { id: "cat-3", nameAr: "الآيباد والتابلت", nameEn: "iPads & Tablets" },
    { id: "cat-4", nameAr: "الساعات الذكية", nameEn: "Smart Watches" },
    { id: "cat-5", nameAr: "السماعات", nameEn: "Headphones" },
    { id: "cat-6", nameAr: "الإكسسوارات والشواحن", nameEn: "Accessories & Chargers" },
    { id: "cat-7", nameAr: "العروض الخاصة", nameEn: "Special Offers" }
  ],
  products: [
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
  ],
  offers: [
    {
      id: "off-1",
      titleAr: "عرض الصيف الكاسح: آيفون 15 برو ماكس",
      titleEn: "Summer Deal: iPhone 15 Pro Max",
      descAr: "وفر 200 دولار عند شرائك آيفون 15 برو ماكس واحصل على شاحن أصلي وحماية شاشة مجاناً!",
      descEn: "Save $200 on iPhone 15 Pro Max and get an original 20W charger and glass screen protector for free!",
      banner: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=1200",
      startDate: "2026-06-01",
      endDate: "2026-07-31",
      status: "active"
    }
  ],
  videos: [
    {
      id: "vid-1",
      titleAr: "مراجعة آيفون 15 برو ماكس - القوة والتصميم والتيتانيوم",
      titleEn: "iPhone 15 Pro Max Review - Titanium Design & Power",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800"
    }
  ]
};

// Global statistics counter
let totalViews = 3840;

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Parse path
  const path = event.path.replace(/\/\.netlify\/functions\/api/, "").replace(/\/api/, "");
  const method = event.httpMethod;

  // Initialize Netlify Blob store
  let store;
  let db = { ...localDb };

  try {
    store = getStore("green-apple-db");
    const storedDb = await store.get("db");
    if (storedDb) {
      db = JSON.parse(storedDb);
    } else {
      // Initialize store with localDb if empty
      await store.set("db", JSON.stringify(db));
    }
    const views = await store.get("views");
    if (views) {
      totalViews = parseInt(views, 10);
    } else {
      await store.set("views", totalViews.toString());
    }
  } catch (err) {
    console.log("Using local database (Blobs not available or local execution)");
  }

  // Increment total views on home page hits (or any client request)
  if (method === "GET" && path === "/stats") {
    totalViews += 1;
    if (store) {
      try {
        await store.set("views", totalViews.toString());
      } catch (e) {}
    }
  }

  const saveDb = async () => {
    if (store) {
      try {
        await store.set("db", JSON.stringify(db));
      } catch (e) {
        console.error("Failed to write to Netlify Blobs:", e);
      }
    }
  };

  // Match routes
  try {
    // CATEGORIES CRUD
    if (path.startsWith("/categories")) {
      if (method === "GET") {
        return { statusCode: 200, headers, body: JSON.stringify(db.categories) };
      }
      
      const body = event.body ? JSON.parse(event.body) : {};
      
      if (method === "POST") {
        const newCat = {
          id: "cat-" + Date.now(),
          nameAr: body.nameAr || "قسم جديد",
          nameEn: body.nameEn || "New Category"
        };
        db.categories.push(newCat);
        await saveDb();
        return { statusCode: 201, headers, body: JSON.stringify(newCat) };
      }

      if (method === "PUT") {
        const idx = db.categories.findIndex(c => c.id === body.id);
        if (idx !== -1) {
          db.categories[idx] = {
            id: body.id,
            nameAr: body.nameAr,
            nameEn: body.nameEn
          };
          await saveDb();
          return { statusCode: 200, headers, body: JSON.stringify(db.categories[idx]) };
        }
        return { statusCode: 404, headers, body: JSON.stringify({ error: "Category not found" }) };
      }

      if (method === "DELETE") {
        const id = path.split("/").pop();
        const targetId = id && id !== "categories" ? id : body.id;
        db.categories = db.categories.filter(c => c.id !== targetId);
        await saveDb();
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, id: targetId }) };
      }
    }

    // PRODUCTS CRUD
    if (path.startsWith("/products")) {
      if (method === "GET") {
        // Increment single product view count if queried specifically
        const id = path.split("/").pop();
        if (id && id !== "products") {
          const product = db.products.find(p => p.id === id);
          if (product) {
            product.views = (product.views || 0) + 1;
            await saveDb();
            return { statusCode: 200, headers, body: JSON.stringify(product) };
          }
          return { statusCode: 404, headers, body: JSON.stringify({ error: "Product not found" }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify(db.products) };
      }

      const body = event.body ? JSON.parse(event.body) : {};

      if (method === "POST") {
        const newProd = {
          id: "prod-" + Date.now(),
          nameAr: body.nameAr || "",
          nameEn: body.nameEn || "",
          descAr: body.descAr || "",
          descEn: body.descEn || "",
          priceBefore: parseFloat(body.priceBefore) || 0,
          priceAfter: parseFloat(body.priceAfter) || 0,
          category: body.category || "",
          availability: body.availability || "in-stock",
          featured: !!body.featured,
          sku: body.sku || "",
          code: body.code || "",
          tags: body.tags || "",
          images: body.images || [],
          rating: 5.0,
          views: 0
        };
        db.products.push(newProd);
        await saveDb();
        return { statusCode: 201, headers, body: JSON.stringify(newProd) };
      }

      if (method === "PUT") {
        const idx = db.products.findIndex(p => p.id === body.id);
        if (idx !== -1) {
          db.products[idx] = {
            ...db.products[idx],
            nameAr: body.nameAr,
            nameEn: body.nameEn,
            descAr: body.descAr,
            descEn: body.descEn,
            priceBefore: parseFloat(body.priceBefore) || 0,
            priceAfter: parseFloat(body.priceAfter) || 0,
            category: body.category,
            availability: body.availability,
            featured: !!body.featured,
            sku: body.sku,
            code: body.code,
            tags: body.tags,
            images: body.images || db.products[idx].images
          };
          await saveDb();
          return { statusCode: 200, headers, body: JSON.stringify(db.products[idx]) };
        }
        return { statusCode: 404, headers, body: JSON.stringify({ error: "Product not found" }) };
      }

      if (method === "DELETE") {
        const id = path.split("/").pop();
        const targetId = id && id !== "products" ? id : body.id;
        db.products = db.products.filter(p => p.id !== targetId);
        await saveDb();
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, id: targetId }) };
      }
    }

    // OFFERS CRUD
    if (path.startsWith("/offers")) {
      if (method === "GET") {
        return { statusCode: 200, headers, body: JSON.stringify(db.offers) };
      }

      const body = event.body ? JSON.parse(event.body) : {};

      if (method === "POST") {
        const newOffer = {
          id: "off-" + Date.now(),
          titleAr: body.titleAr || "",
          titleEn: body.titleEn || "",
          descAr: body.descAr || "",
          descEn: body.descEn || "",
          banner: body.banner || "",
          startDate: body.startDate || "",
          endDate: body.endDate || "",
          status: body.status || "active"
        };
        db.offers.push(newOffer);
        await saveDb();
        return { statusCode: 201, headers, body: JSON.stringify(newOffer) };
      }

      if (method === "PUT") {
        const idx = db.offers.findIndex(o => o.id === body.id);
        if (idx !== -1) {
          db.offers[idx] = {
            id: body.id,
            titleAr: body.titleAr,
            titleEn: body.titleEn,
            descAr: body.descAr,
            descEn: body.descEn,
            banner: body.banner,
            startDate: body.startDate,
            endDate: body.endDate,
            status: body.status
          };
          await saveDb();
          return { statusCode: 200, headers, body: JSON.stringify(db.offers[idx]) };
        }
        return { statusCode: 404, headers, body: JSON.stringify({ error: "Offer not found" }) };
      }

      if (method === "DELETE") {
        const id = path.split("/").pop();
        const targetId = id && id !== "offers" ? id : body.id;
        db.offers = db.offers.filter(o => o.id !== targetId);
        await saveDb();
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, id: targetId }) };
      }
    }

    // VIDEOS CRUD
    if (path.startsWith("/videos")) {
      if (method === "GET") {
        return { statusCode: 200, headers, body: JSON.stringify(db.videos) };
      }

      const body = event.body ? JSON.parse(event.body) : {};

      if (method === "POST") {
        const newVideo = {
          id: "vid-" + Date.now(),
          titleAr: body.titleAr || "",
          titleEn: body.titleEn || "",
          url: body.url || "",
          thumbnail: body.thumbnail || ""
        };
        db.videos.push(newVideo);
        await saveDb();
        return { statusCode: 201, headers, body: JSON.stringify(newVideo) };
      }

      if (method === "PUT") {
        const idx = db.videos.findIndex(v => v.id === body.id);
        if (idx !== -1) {
          db.videos[idx] = {
            id: body.id,
            titleAr: body.titleAr,
            titleEn: body.titleEn,
            url: body.url,
            thumbnail: body.thumbnail || db.videos[idx].thumbnail
          };
          await saveDb();
          return { statusCode: 200, headers, body: JSON.stringify(db.videos[idx]) };
        }
        return { statusCode: 404, headers, body: JSON.stringify({ error: "Video not found" }) };
      }

      if (method === "DELETE") {
        const id = path.split("/").pop();
        const targetId = id && id !== "videos" ? id : body.id;
        db.videos = db.videos.filter(v => v.id !== targetId);
        await saveDb();
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, id: targetId }) };
      }
    }

    // STATS ENDPOINT
    if (path === "/stats" && method === "GET") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          categories: db.categories.length,
          products: db.products.length,
          offers: db.offers.length,
          videos: db.videos.length,
          views: totalViews
        })
      };
    }

    // AUTH LOGIN ENDPOINT
    if (path === "/auth/login" && method === "POST") {
      const body = event.body ? JSON.parse(event.body) : {};
      if (body.username === "admin" && body.password === "greenapple2026") {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, token: "token-greenapple-2026-auth" })
        };
      }
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Invalid username or password" })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: `Route not found: ${path}` })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
