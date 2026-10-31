// Davines Serbia - Telegram WebApp Application Logic
(function() {
  'use strict';

  // 1. Translations
  const I18N = {
    ru: {
      brandTagline: "sustainable beauty",
      salonPill: "Салон",
      salonNotSet: "Укажите название вашего салона",
      salonModalTitle: "Название салона",
      salonModalDesc: "Укажите название салона красоты или имя мастера для оформления заказов:",
      salonPlaceholder: "например: Studio Elegance, Мастер Анна...",
      save: "Сохранить",
      searchPlaceholder: "Поиск по коду или названию (70031, nounou, oi)...",
      allLines: "Все линейки",
      itemsFound: "Найдено позиций",
      cart: "Корзина",
      cartEmptyTitle: "Ваша корзина пуста",
      cartEmptyDesc: "Выберите нужные продукты Davines в каталоге выше",
      vatIncluded: "с НДС (sa PDV)",
      total: "Итого к оплате",
      sendOrder: "Отправить заказ торговому представителю",
      copyOrder: "Скопировать список заказа",
      orderCopied: "Текст заказа скопирован!",
      salonRequiredAlert: "Пожалуйста, укажите название салона перед отправкой!",
      clearCart: "Очистить",
      addBtn: "В корзину",
      orderSuccess: "Заказ оформлен!",
      orderSuccessSub: "Список заказа передан в Telegram",
      allSubcats: "Все",
      lines: {
        "ALL": "Все товары",
        "ESSENTIAL": "Essential Evolution",
        "NATURALTECH": "NaturalTech",
        "OI": "OI Line",
        "MORE_INSIDE": "More Inside",
        "HEART_OF_GLASS": "Heart of Glass",
        "ALCHEMIC": "Alchemic System",
        "BOJE": "Boje & Pigmenti",
        "CIRCLE": "The Circle Chronicles",
        "SU": "SU Sun Care",
        "PASTA_LOVE": "Pasta & Love",
        "TRAVEL": "Travel Size",
        "OTHER": "Прочие линии"
      }
    },
    sr: {
      brandTagline: "sustainable beauty",
      salonPill: "Salon",
      salonNotSet: "Unesite naziv vašeg salona",
      salonModalTitle: "Naziv salona",
      salonModalDesc: "Unesite naziv salona ili ime frizera radi kreiranja porudžbine:",
      salonPlaceholder: "na primer: Studio Elegance, Frizerski salon Ana...",
      save: "Sačuvaj",
      searchPlaceholder: "Pretraga po šifri ili nazivu (70031, nounou, oi)...",
      allLines: "Sve linije",
      itemsFound: "Pronađeno artikala",
      cart: "Korpa",
      cartEmptyTitle: "Vaša korpa je prazna",
      cartEmptyDesc: "Izaberite željene Davines proizvode iz kataloga",
      vatIncluded: "sa PDV-om",
      total: "Ukupno",
      sendOrder: "Pošalji porudžbinu predstavniku",
      copyOrder: "Kopiraj spisak porudžbine",
      orderCopied: "Spisak porudžbine je kopiran!",
      salonRequiredAlert: "Molimo unesite naziv vašeg salona pre slanja!",
      clearCart: "Isprazni",
      addBtn: "U korpu",
      orderSuccess: "Porudžbina je kreirana!",
      orderSuccessSub: "Spisak je poslat u Telegram",
      allSubcats: "Sve",
      lines: {
        "ALL": "Svi proizvodi",
        "ESSENTIAL": "Essential Evolution",
        "NATURALTECH": "NaturalTech",
        "OI": "OI Line",
        "MORE_INSIDE": "More Inside",
        "HEART_OF_GLASS": "Heart of Glass",
        "ALCHEMIC": "Alchemic System",
        "BOJE": "Boje i Pigmenti",
        "CIRCLE": "The Circle Chronicles",
        "SU": "SU Sun Care",
        "PASTA_LOVE": "Pasta & Love",
        "TRAVEL": "Travel Size",
        "OTHER": "Ostale linije"
      }
    }
  };

  // 2. High-level category grouping definition
  const CATEGORY_MAP = {
    "ESSENTIAL": {
      key: "ESSENTIAL",
      filter: item => item.category === "ESSENTIAL HAIRCARE EVOLUTION"
    },
    "NATURALTECH": {
      key: "NATURALTECH",
      filter: item => item.category === "NATURALTECH"
    },
    "OI": {
      key: "OI",
      filter: item => item.category === "OI"
    },
    "MORE_INSIDE": {
      key: "MORE_INSIDE",
      filter: item => item.category === "MORE INSIDE"
    },
    "HEART_OF_GLASS": {
      key: "HEART_OF_GLASS",
      filter: item => item.category === "THERE MUST BE AN ANGEL"
    },
    "ALCHEMIC": {
      key: "ALCHEMIC",
      filter: item => item.category === "ALCHEMIC SYSTEM"
    },
    "BOJE": {
      key: "BOJE",
      filter: item => item.category === "BOJE" || item.category === "FINEST PIGMENTS" || item.category === "ACTIVATOR"
    },
    "CIRCLE": {
      key: "CIRCLE",
      filter: item => item.category === "THE CIRCLE CHRONICLES"
    },
    "SU": {
      key: "SU",
      filter: item => item.category === "SU"
    },
    "PASTA_LOVE": {
      key: "PASTA_LOVE",
      filter: item => item.category === "PASTA & LOVE"
    },
    "TRAVEL": {
      key: "TRAVEL",
      filter: item => item.category === "TRAVEL SIZE"
    },
    "OTHER": {
      key: "OTHER",
      filter: item => item.category === "NATURALTECH TAILORING TREATMENT" || 
                      item.category === "BALANCE & BOUCLE" || 
                      item.category === "DAVINES AUTHENTIC FORMULAS" || 
                      item.category === "LIQUID SPELL" || 
                      item.category === "THE CENTURY OF LIGHT"
    }
  };

  // 3. Application State
  const state = {
    lang: localStorage.getItem('davines_lang') || 'ru',
    salonName: localStorage.getItem('davines_salon_name') || '',
    activeLine: 'ALL',
    activeSubcat: 'ALL',
    searchQuery: '',
    cart: JSON.parse(localStorage.getItem('davines_cart') || '{}'),
    catalog: window.DAVINES_CATALOG || []
  };

  // 4. Telegram WebApp Init
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  if (tg) {
    tg.ready();
    tg.expand();
    if (tg.setHeaderColor) tg.setHeaderColor('#F9F8F5');
    if (tg.setBackgroundColor) tg.setBackgroundColor('#F9F8F5');
  }

  function triggerHaptic(type = 'light') {
    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(type);
    }
  }

  // 5. DOM References
  const dom = {
    langBtn: document.getElementById('langBtn'),
    salonPill: document.getElementById('salonPill'),
    salonPillName: document.getElementById('salonPillName'),
    salonModal: document.getElementById('salonModal'),
    salonModalInput: document.getElementById('salonModalInput'),
    salonModalSave: document.getElementById('salonModalSave'),
    modalOverlay: document.getElementById('modalOverlay'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    linesScroll: document.getElementById('linesScroll'),
    subcatContainer: document.getElementById('subcatContainer'),
    subcatScroll: document.getElementById('subcatScroll'),
    catalogList: document.getElementById('catalogList'),
    catalogCount: document.getElementById('catalogCount'),
    cartFloatingBar: document.getElementById('cartFloatingBar'),
    cartBarCount: document.getElementById('cartBarCount'),
    cartBarTotal: document.getElementById('cartBarTotal'),
    cartDrawer: document.getElementById('cartDrawer'),
    drawerCloseBtn: document.getElementById('drawerCloseBtn'),
    cartItemsScroll: document.getElementById('cartItemsScroll'),
    cartDrawerTotal: document.getElementById('cartDrawerTotal'),
    cartDrawerSalonVal: document.getElementById('cartDrawerSalonVal'),
    cartDrawerSalonEdit: document.getElementById('cartDrawerSalonEdit'),
    btnSendOrder: document.getElementById('btnSendOrder'),
    btnCopyOrder: document.getElementById('btnCopyOrder'),
    btnClearCart: document.getElementById('btnClearCart'),
    toast: document.getElementById('toastMsg')
  };

  // 6. Formatting Utilities
  function getCleanProductName(fullName) {
    if (!fullName) return "";
    if (fullName.includes(" - ")) {
      return fullName.split(" - ")[0].trim();
    }
    return fullName.trim();
  }

  function formatMoney(amount) {
    return new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.round(amount)) + ' RSD';
  }

  function showToast(text) {
    if (!dom.toast) return;
    dom.toast.textContent = text;
    dom.toast.classList.add('show');
    setTimeout(() => dom.toast.classList.remove('show'), 2800);
  }

  // 7. Render Language & Static UI Elements
  function renderStaticTexts() {
    const t = I18N[state.lang];
    dom.langBtn.innerHTML = state.lang === 'ru' ? '🇷🇺 RU' : '🇷🇸 SR';
    dom.searchInput.placeholder = t.searchPlaceholder;
    
    // Salon pill
    if (state.salonName) {
      dom.salonPillName.textContent = state.salonName;
    } else {
      dom.salonPillName.textContent = t.salonNotSet;
    }
    dom.cartDrawerSalonVal.textContent = state.salonName || t.salonNotSet;
    
    // Salon Modal labels
    document.getElementById('dialogTitle').textContent = t.salonModalTitle;
    document.getElementById('dialogDesc').textContent = t.salonModalDesc;
    dom.salonModalInput.placeholder = t.salonPlaceholder;
    dom.salonModalSave.textContent = t.save;
    
    // Cart drawer labels
    document.getElementById('drawerTitle').textContent = t.cart;
    document.getElementById('cartSalonLabel').textContent = t.salonPill + ":";
    document.getElementById('cartDrawerVatNote').textContent = t.vatIncluded;
    document.getElementById('summaryLabel').textContent = t.total + ":";
    dom.btnSendOrder.innerHTML = `<span>✈️</span> ${t.sendOrder}`;
    dom.btnCopyOrder.textContent = t.copyOrder;
    dom.btnClearCart.textContent = t.clearCart;
  }

  // 8. Render Category Tabs
  function renderCategoryTabs() {
    const t = I18N[state.lang];
    dom.linesScroll.innerHTML = '';

    const categories = [
      { key: 'ALL', label: t.lines.ALL, count: state.catalog.length },
      { key: 'ESSENTIAL', label: t.lines.ESSENTIAL, count: countItems('ESSENTIAL') },
      { key: 'NATURALTECH', label: t.lines.NATURALTECH, count: countItems('NATURALTECH') },
      { key: 'OI', label: t.lines.OI, count: countItems('OI') },
      { key: 'MORE_INSIDE', label: t.lines.MORE_INSIDE, count: countItems('MORE_INSIDE') },
      { key: 'HEART_OF_GLASS', label: t.lines.HEART_OF_GLASS, count: countItems('HEART_OF_GLASS') },
      { key: 'ALCHEMIC', label: t.lines.ALCHEMIC, count: countItems('ALCHEMIC') },
      { key: 'BOJE', label: t.lines.BOJE, count: countItems('BOJE') },
      { key: 'CIRCLE', label: t.lines.CIRCLE, count: countItems('CIRCLE') },
      { key: 'SU', label: t.lines.SU, count: countItems('SU') },
      { key: 'PASTA_LOVE', label: t.lines.PASTA_LOVE, count: countItems('PASTA_LOVE') },
      { key: 'TRAVEL', label: t.lines.TRAVEL, count: countItems('TRAVEL') },
      { key: 'OTHER', label: t.lines.OTHER, count: countItems('OTHER') }
    ];

    categories.forEach(cat => {
      const tab = document.createElement('div');
      tab.className = `line-tab ${state.activeLine === cat.key ? 'active' : ''}`;
      tab.innerHTML = `<span>${cat.label}</span><span class="line-badge-count">${cat.count}</span>`;
      tab.addEventListener('click', () => {
        state.activeLine = cat.key;
        state.activeSubcat = 'ALL';
        triggerHaptic('light');
        renderCategoryTabs();
        renderSubcategoryPills();
        renderProducts();
      });
      dom.linesScroll.appendChild(tab);
    });
  }

  function countItems(categoryKey) {
    if (categoryKey === 'ALL') return state.catalog.length;
    const def = CATEGORY_MAP[categoryKey];
    if (!def) return 0;
    return state.catalog.filter(def.filter).length;
  }

  // 9. Render Subcategories when a line is selected
  function renderSubcategoryPills() {
    const t = I18N[state.lang];
    if (state.activeLine === 'ALL' || state.activeLine === 'TRAVEL' || state.activeLine === 'OTHER' || state.activeLine === 'CIRCLE' || state.activeLine === 'OI' || state.activeLine === 'SU' || state.activeLine === 'PASTA_LOVE') {
      dom.subcatContainer.style.display = 'none';
      return;
    }

    const def = CATEGORY_MAP[state.activeLine];
    const items = state.catalog.filter(def.filter);
    const subcats = Array.from(new Set(items.map(i => i.sub_category))).sort();

    if (subcats.length <= 1) {
      dom.subcatContainer.style.display = 'none';
      return;
    }

    dom.subcatContainer.style.display = 'block';
    dom.subcatScroll.innerHTML = '';

    // "All" pill
    const allPill = document.createElement('div');
    allPill.className = `subcat-pill ${state.activeSubcat === 'ALL' ? 'active' : ''}`;
    allPill.textContent = `${t.allSubcats} (${items.length})`;
    allPill.addEventListener('click', () => {
      state.activeSubcat = 'ALL';
      triggerHaptic('light');
      renderSubcategoryPills();
      renderProducts();
    });
    dom.subcatScroll.appendChild(allPill);

    // Each subcategory pill
    subcats.forEach(sub => {
      const count = items.filter(i => i.sub_category === sub).length;
      const pill = document.createElement('div');
      pill.className = `subcat-pill ${state.activeSubcat === sub ? 'active' : ''}`;
      pill.textContent = `${sub} (${count})`;
      pill.addEventListener('click', () => {
        state.activeSubcat = sub;
        triggerHaptic('light');
        renderSubcategoryPills();
        renderProducts();
      });
      dom.subcatScroll.appendChild(pill);
    });
  }

  // 10. Filter Products
  function getFilteredProducts() {
    let items = state.catalog;

    // 1. Line filter
    if (state.activeLine !== 'ALL') {
      const def = CATEGORY_MAP[state.activeLine];
      if (def) items = items.filter(def.filter);
    }

    // 2. Subcategory filter
    if (state.activeSubcat !== 'ALL') {
      items = items.filter(item => item.sub_category === state.activeSubcat);
    }

    // 3. Search Query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.trim().toLowerCase();
      items = items.filter(item => {
        const codeMatch = item.code && item.code.toLowerCase().includes(q);
        const nameMatch = item.name && item.name.toLowerCase().includes(q);
        const catMatch = item.category && item.category.toLowerCase().includes(q);
        const subMatch = item.sub_category && item.sub_category.toLowerCase().includes(q);
        const volMatch = item.volume && item.volume.toLowerCase().includes(q);
        return codeMatch || nameMatch || catMatch || subMatch || volMatch;
      });
    }

    return items;
  }

  // 11. Render Product Grid
  function renderProducts() {
    const t = I18N[state.lang];
    const items = getFilteredProducts();

    dom.catalogCount.textContent = `${t.itemsFound}: ${items.length}`;
    dom.catalogList.innerHTML = '';

    if (items.length === 0) {
      dom.catalogList.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
          <div style="font-size: 36px; margin-bottom: 8px; opacity: 0.5;">🔍</div>
          <div style="font-size: 15px; font-weight: 600;">${t.emptySearch}</div>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = createProductCard(item);
      dom.catalogList.appendChild(card);
    });
  }

  function createProductCard(item) {
    const t = I18N[state.lang];
    const qty = state.cart[item.code] || 0;

    const card = document.createElement('div');
    card.className = 'product-card';

    // Parse title & description
    let title = item.name;
    let desc = "";
    if (item.name.includes(" - ")) {
      const parts = item.name.split(" - ");
      title = parts[0];
      desc = parts.slice(1).join(" - ");
    }

    card.innerHTML = `
      <div>
        <div class="card-header">
          <span class="card-family-tag">${item.sub_category || item.category}</span>
          <span class="card-code">#${item.code}</span>
        </div>
        <div class="product-title">${title}</div>
        ${desc ? `<div class="product-desc">${desc}</div>` : ''}
      </div>
      <div class="card-footer">
        <div class="volume-price-box">
          <span class="volume-badge">${item.volume}</span>
          <span class="price-main">${formatMoney(item.mp_price)}</span>
          <span class="price-note">${t.vatIncluded}</span>
        </div>
        <div class="card-actions" id="action-${item.code}">
          ${renderQuantityWidget(item.code, qty)}
        </div>
      </div>
    `;

    bindCardButtons(card, item.code);
    return card;
  }

  function renderQuantityWidget(code, qty) {
    const t = I18N[state.lang];
    if (qty > 0) {
      return `
        <div class="qty-control">
          <button class="qty-btn btn-minus" data-code="${code}">−</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn btn-plus" data-code="${code}">+</button>
        </div>
      `;
    } else {
      return `
        <button class="btn-add-initial btn-add" data-code="${code}">
          + ${t.addBtn}
        </button>
      `;
    }
  }

  function bindCardButtons(cardElement, code) {
    const addBtn = cardElement.querySelector('.btn-add');
    if (addBtn) {
      addBtn.addEventListener('click', () => updateQuantity(code, 1));
    }
    const plusBtn = cardElement.querySelector('.btn-plus');
    if (plusBtn) {
      plusBtn.addEventListener('click', () => updateQuantity(code, (state.cart[code] || 0) + 1));
    }
    const minusBtn = cardElement.querySelector('.btn-minus');
    if (minusBtn) {
      minusBtn.addEventListener('click', () => updateQuantity(code, (state.cart[code] || 0) - 1));
    }
  }

  // 12. Cart Operations
  function updateQuantity(code, newQty) {
    triggerHaptic('light');
    if (newQty <= 0) {
      delete state.cart[code];
    } else {
      state.cart[code] = newQty;
    }
    localStorage.setItem('davines_cart', JSON.stringify(state.cart));

    // Update product card widget in place without re-rendering entire list
    const actionSlot = document.getElementById(`action-${code}`);
    if (actionSlot) {
      actionSlot.innerHTML = renderQuantityWidget(code, state.cart[code] || 0);
      const parentCard = actionSlot.closest('.product-card');
      if (parentCard) bindCardButtons(parentCard, code);
    }

    renderCartFloatingBar();
    renderCartDrawerContent();
  }

  function getCartSummary() {
    let totalItems = 0;
    let totalPriceMP = 0;
    let orderedList = [];

    for (const [code, qty] of Object.entries(state.cart)) {
      if (qty <= 0) continue;
      const product = state.catalog.find(p => p.code === code);
      if (product) {
        totalItems += qty;
        const subtotalMP = product.mp_price * qty;
        totalPriceMP += subtotalMP;
        orderedList.push({
          product,
          qty,
          subtotalMP
        });
      }
    }

    return { totalItems, totalPriceMP, orderedList };
  }

  function renderCartFloatingBar() {
    const t = I18N[state.lang];
    const { totalItems, totalPriceMP } = getCartSummary();

    if (totalItems > 0) {
      dom.cartFloatingBar.classList.add('visible');
      dom.cartBarCount.textContent = `${totalItems} ${t.items}`;
      dom.cartBarTotal.textContent = formatMoney(totalPriceMP);
    } else {
      dom.cartFloatingBar.classList.remove('visible');
    }
  }

  function renderCartDrawerContent() {
    const t = I18N[state.lang];
    const { totalItems, totalPriceMP, orderedList } = getCartSummary();

    dom.cartDrawerTotal.textContent = formatMoney(totalPriceMP);
    dom.cartItemsScroll.innerHTML = '';

    if (orderedList.length === 0) {
      dom.cartItemsScroll.innerHTML = `
        <div class="cart-empty-view">
          <div class="cart-empty-icon">🛒</div>
          <div style="font-weight: 600; font-size: 16px;">${t.cartEmptyTitle}</div>
          <div style="font-size: 13px; margin-top: 4px;">${t.cartEmptyDesc}</div>
        </div>
      `;
      dom.btnSendOrder.style.opacity = '0.5';
      dom.btnSendOrder.style.pointerEvents = 'none';
      return;
    }

    dom.btnSendOrder.style.opacity = '1';
    dom.btnSendOrder.style.pointerEvents = 'auto';

    orderedList.forEach(({ product, qty, subtotalMP }) => {
      const cleanTitle = getCleanProductName(product.name);
      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-title">${cleanTitle}</div>
          <div class="cart-item-meta">
            ${product.volume} • #${product.code}
          </div>
        </div>
        <div class="qty-control">
          <button class="qty-btn btn-drawer-minus" data-code="${product.code}">−</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn btn-drawer-plus" data-code="${product.code}">+</button>
        </div>
        <div class="cart-item-price">${formatMoney(subtotalMP)}</div>
      `;

      row.querySelector('.btn-drawer-minus').addEventListener('click', () => {
        updateQuantity(product.code, qty - 1);
      });
      row.querySelector('.btn-drawer-plus').addEventListener('click', () => {
        updateQuantity(product.code, qty + 1);
      });

      dom.cartItemsScroll.appendChild(row);
    });
  }

  // 13. Order Text Formatting
  function generateOrderMessageText() {
    const { totalItems, totalPriceMP, orderedList } = getCartSummary();
    const dateStr = new Date().toLocaleString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let lines = [];
    lines.push(`🌿 *PORUDŽBINA / ЗАКАЗ DAVINES* 🌿`);
    lines.push(`📅 Datum: ${dateStr}`);
    lines.push(`💈 *Salon / Салон:* ${state.salonName || "Nije navedeno"}`);
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const u = tg.initDataUnsafe.user;
      lines.push(`👤 Master: ${u.first_name || ''} ${u.last_name || ''} ${u.username ? `(@${u.username})` : ''}`.trim());
    }
    lines.push(``);
    lines.push(`📦 *Artikli / Товары (${totalItems} kom):*`);

    orderedList.forEach(({ product, qty, subtotalMP }, idx) => {
      const cleanTitle = getCleanProductName(product.name);
      lines.push(`${idx + 1}. [${product.code}] ${cleanTitle} (${product.volume})`);
      lines.push(`   └ ${qty} kom x ${formatMoney(product.mp_price)} = *${formatMoney(subtotalMP)}*`);
    });

    lines.push(``);
    lines.push(`💰 *UKUPNO / ИТОГО (sa PDV): ${formatMoney(totalPriceMP)}*`);

    return lines.join('\n');
  }

  // 14. Send Order Handler (Direct Telegram Bot API Delivery + WebApp fallback)
  async function handleSendOrder() {
    const t = I18N[state.lang];
    if (!state.salonName.trim()) {
      showToast(t.salonRequiredAlert);
      openSalonModal();
      return;
    }

    const { totalItems, totalPriceMP, orderedList } = getCartSummary();
    if (totalItems === 0) return;

    dom.btnSendOrder.disabled = true;
    dom.btnSendOrder.innerHTML = `<span>⏳</span> ${state.lang === 'ru' ? 'Отправка заказа...' : 'Slanje porudžbine...'}`;

    const orderText = generateOrderMessageText();
    const botToken = "9127736042:AAGHWTb70DEQY9WgJYppJxlqFamJ8XC24nU";
    const managerChatId = "414194396";
    const clientUser = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user : null;
    const clientChatId = clientUser ? clientUser.id : null;

    try {
      // 1. Direct API delivery to Sales Representative (Ivan)
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: managerChatId,
          text: orderText,
          parse_mode: "Markdown"
        })
      });
      const data = await res.json();
      console.log("Order dispatch result:", data);

      // 2. Send confirmation to client if different from manager
      if (clientChatId && String(clientChatId) !== String(managerChatId)) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: clientChatId,
            text: `✅ *Vaša porudžbina je uspešno poslata! / Заказ отправлен!*\n\n💈 Salon: *${state.salonName}*\n📦 Artikala: *${totalItems} kom*\n💰 Ukupno: *${formatMoney(totalPriceMP)}*\n\nProdajni predstavnik Davinesa je obavešten o porudžbini. Hvala!`,
            parse_mode: "Markdown"
          })
        }).catch(e => console.log("Client note error:", e));
      }

      // 3. Trigger sendData if context supports it
      if (tg && tg.sendData) {
        try {
          tg.sendData(JSON.stringify({
            action: "davines_order",
            salon_name: state.salonName,
            total_items: totalItems,
            total_price_mp: totalPriceMP
          }));
        } catch(e) {
          console.log("sendData ignored:", e);
        }
      }

      triggerHaptic('success');
      showToast(t.orderSuccess);
      dom.btnSendOrder.innerHTML = `<span>✅</span> ${state.lang === 'ru' ? 'Заказ успешно отправлен!' : 'Porudžbina poslata!'}`;

      // Reset cart
      state.cart = {};
      localStorage.removeItem('davines_cart');
      renderProducts();
      renderCartFloatingBar();

      setTimeout(() => {
        closeCartDrawer();
        dom.btnSendOrder.disabled = false;
        dom.btnSendOrder.innerHTML = `<span>✈️</span> ${t.sendOrder}`;
        if (tg && tg.close) {
          try { tg.close(); } catch(e) {}
        }
      }, 1400);

    } catch (err) {
      console.error("Failed to send order via API:", err);
      copyToClipboard(orderText);
      showToast(t.orderCopied);
      dom.btnSendOrder.disabled = false;
      dom.btnSendOrder.innerHTML = `<span>📋</span> ${t.copyOrder}`;
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  // 15. Modals & Drawer Toggles
  function openSalonModal() {
    dom.salonModalInput.value = state.salonName;
    dom.salonModal.classList.add('open');
    dom.modalOverlay.classList.add('open');
    setTimeout(() => dom.salonModalInput.focus(), 150);
  }

  function closeSalonModal() {
    dom.salonModal.classList.remove('open');
    if (!dom.cartDrawer.classList.contains('open')) {
      dom.modalOverlay.classList.remove('open');
    }
  }

  function saveSalonName() {
    const val = dom.salonModalInput.value.trim();
    if (val) {
      state.salonName = val;
      localStorage.setItem('davines_salon_name', val);
      renderStaticTexts();
      closeSalonModal();
      showToast("Салон сохранен / Salon je sačuvan");
      triggerHaptic('light');
    }
  }

  function openCartDrawer() {
    renderCartDrawerContent();
    dom.cartDrawer.classList.add('open');
    dom.modalOverlay.classList.add('open');
    triggerHaptic('medium');
  }

  function closeCartDrawer() {
    dom.cartDrawer.classList.remove('open');
    if (!dom.salonModal.classList.contains('open')) {
      dom.modalOverlay.classList.remove('open');
    }
  }

  // 16. Event Listeners
  function initEvents() {
    // Language switch
    dom.langBtn.addEventListener('click', () => {
      state.lang = state.lang === 'ru' ? 'sr' : 'ru';
      localStorage.setItem('davines_lang', state.lang);
      triggerHaptic('light');
      renderStaticTexts();
      renderCategoryTabs();
      renderSubcategoryPills();
      renderProducts();
      renderCartFloatingBar();
    });

    // Salon pill edit
    dom.salonPill.addEventListener('click', openSalonModal);
    dom.cartDrawerSalonEdit.addEventListener('click', openSalonModal);
    dom.salonModalSave.addEventListener('click', saveSalonName);
    dom.salonModalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveSalonName();
    });

    // Overlay click closes
    dom.modalOverlay.addEventListener('click', () => {
      closeSalonModal();
      closeCartDrawer();
    });
    dom.drawerCloseBtn.addEventListener('click', closeCartDrawer);

    // Floating cart bar click opens drawer
    dom.cartFloatingBar.addEventListener('click', openCartDrawer);

    // Search input
    dom.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (state.searchQuery.length > 0) {
        dom.clearSearchBtn.style.display = 'block';
      } else {
        dom.clearSearchBtn.style.display = 'none';
      }
      renderProducts();
    });

    dom.clearSearchBtn.addEventListener('click', () => {
      dom.searchInput.value = '';
      state.searchQuery = '';
      dom.clearSearchBtn.style.display = 'none';
      renderProducts();
    });

    // Cart buttons
    dom.btnClearCart.addEventListener('click', () => {
      if (confirm(state.lang === 'ru' ? 'Очистить корзину?' : 'Isprazniti korpu?')) {
        state.cart = {};
        localStorage.removeItem('davines_cart');
        renderProducts();
        renderCartFloatingBar();
        renderCartDrawerContent();
        triggerHaptic('medium');
      }
    });

    dom.btnSendOrder.addEventListener('click', handleSendOrder);
    dom.btnCopyOrder.addEventListener('click', () => {
      const text = generateOrderMessageText();
      copyToClipboard(text);
      showToast(I18N[state.lang].orderCopied);
      triggerHaptic('light');
    });

    // Auto-prompt salon name on first run if empty
    if (!state.salonName) {
      setTimeout(() => openSalonModal(), 600);
    }
  }

  // 17. App Init
  function init() {
    renderStaticTexts();
    renderCategoryTabs();
    renderSubcategoryPills();
    renderProducts();
    renderCartFloatingBar();
    initEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
