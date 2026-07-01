# مكوّنات الخريطة والأيقونات — تعليمات سريعة

هذا الملف يشرح كيف تستخدم المكوّنات التي أضفتها وكيف تغيّر إحداثيات المتجر أو تستبدل Leaflet بخرائط Google.

الملفات المضافة/المعدّلة:
- assets/icons/*.svg — أيقونات الأقسام (phone, headphones, watch, plug, offer)
- styles/category-cards.css — CSS لبطاقات الأقسام
- components/category-card.html — مثال HTML لعرض البطاقات
- components/store-map.html — مكوّن خريطة باستخدام Leaflet + OpenStreetMap
- index.html — تم تحديثه لإدراج البطاقات والخريطة داخل الصفحة الرئيسية

تغيير إحداثيات المتجر:
- الملف الذي يستخدم الخريطة في الصفحة هو `components/store-map.html` (يتضمن خرائط Leaflet).
- لتعديل الموقع افتح السطر الذي يحتوي على عنصر الخريطة:
  ```html
  <div id="store-map" data-lat="15.345091758410766" data-lng="44.20579737590886"></div>
  ```
  واستبدل القيم `data-lat` و`data-lng` بالإحداثيات الصحيحة (latitude,longitude).

بدّل الـ popup (نص النافذة المصغّرة):
- افتح `components/store-map.html` وابحث عن السطر:
  ```js
  marker.bindPopup('<strong>Green Apple</strong><br>العنوان: صنعاء - شارع القصر - أمام السفارة الصينية')
  ```
  وعدّل النص العربي/الإنجليزي كما تريد.

التبديل إلى Google Maps (اختياري):
- لو تفضل خرائط Google بدل Leaflet ستحتاج API key من Google Cloud.
- استبدل مكوّن الخريطة بالمثال التالي داخل الصفحة (ضع مفتاحك في `YOUR_API_KEY`):
  ```html
  <div id="gmap" style="height:420px; border-radius:14px; overflow:hidden;"></div>
  <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
  <script>
    function initMap() {
      const pos = { lat: 15.345091758410766, lng: 44.20579737590886 };
      const map = new google.maps.Map(document.getElementById('gmap'), { zoom: 16, center: pos, disableDefaultUI: true });
      new google.maps.Marker({ position: pos, map: map, title: 'Green Apple' });
    }
  </script>
  ```

ملاحظة عن المسارات (paths):
- في `index.html` استخدمت المسارات المطلقة من الجذر مثل `/assets/icons/phone.svg` و`/styles/category-cards.css`.
- عند النشر في بيئة تخدم الملفات من مجلد آخر (مثلاً `public/` أو `static/`) تأكد أن هذه المسارات تشير إلى المكان الصحيح أو انقل المجلدات إلى المجلد الذي يخدمه السيرفر.

إذا تريد أعدّل أي نص أو ألوان للأيقونات أو أضبط الـ popup باسم مختلف أقدر أعدلهم الآن ثم ترفع أنت النشر.
