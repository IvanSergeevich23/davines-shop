// Davines Serbia - Telegram WebApp Application Logic
(function() {
  'use strict';

  // 1. Translations
  const I18N = {
    ru: {
      brandTagline: "sustainable beauty",
      salonPill: "Салон",
      salonNotSet: "Укажите салон и скидку",
      salonModalTitle: "Добро пожаловать в Davines",
      salonModalDesc: "Укажите название вашей студии / салона и выберите вашу персональную скидку (20% или 30%):",
      salonInputLabel: "Название салона / студии:",
      discountLabel: "Персональная скидка:",
      discLabel20: "Скидка клиента (20%)",
      discLabel30: "Спец. скидка (30%)",
      discountNotice: "ℹ️ Название и скидка фиксируются при первом входе и не подлежат изменению.",
      saveAndEnter: "Сохранить и войти в каталог",
      salonLockedToast: "Название салона и скидка зафиксированы и не меняются",
      salonPlaceholder: "например: Studio Elegance, Салон Давинес...",
      save: "Сохранить",
      searchPlaceholder: "Поиск по коду или названию (70031, nounou, oi)...",
      allLines: "Все линейки",
      itemsFound: "Найдено позиций",
      cart: "Корзина",
      cartEmptyTitle: "Ваша корзина пуста",
      cartEmptyDesc: "Выберите нужные продукты Davines в каталоге выше",
      commentBtn: "Комментарий",
      commentBtnEdit: "Изменить",
      commentModalTitle: "💬 Комментарий к заказу",
      commentModalDesc: "Укажите необходимые расходники (пеньюары, пакеты) или пожелания к доставке:",
      commentModalPlaceholder: "Например: нужны одноразовые пеньюары, пакеты для клиентов...",
      commentSave: "✓ Сохранить комментарий",
      commentClear: "🗑 Очистить",
      commentCancel: "Отмена",
      historyBtn: "📋 Заказы",
      historyTitle: "История заказов",
      historyDesc: "Ваши предыдущие оформленные заказы:",
      historyEmpty: "У вас пока нет оформленных заказов на этом устройстве.",
      historyRepeat: "Повторить заказ",
      vatIncluded: "с НДС (sa PDV)",
      total: "Итого к оплате",
      totalWithDiscount: "Итого со скидкой",
      retailTotalWithoutDiscount: "Розничная цена (без скидки):",
      sendOrder: "Отправить заказ торговому представителю",
      copyOrder: "Скопировать список заказа",
      orderCopied: "Текст заказа скопирован!",
      salonRequiredAlert: "Пожалуйста, укажите название салона перед входом!",
      clearCart: "Очистить",
      addBtn: "В корзину",
      orderSuccess: "Заказ оформлен!",
      orderSuccessSub: "Список заказа передан торговому представителю",
      allSubcats: "Все",
      chooseShades: "Выбрать оттенки",
      editShades: "Изменить оттенки",
      shadesSelected: "Выбрано оттенков",
      paletteSearchPlaceholder: "Поиск тона (7.34, 10, quartz)...",
      applyPalette: "Применить в корзину",
      tubes: "шт.",
      items: "товаров",
      lines: {
        "ALL": "Все товары",
        "COLORING": "Окрашивание",
        "ESSENTIAL": "Essential Evolution",
        "NATURALTECH": "NaturalTech",
        "OI": "OI Line",
        "MORE_INSIDE": "More Inside",
        "HEART_OF_GLASS": "Heart of Glass",
        "ALCHEMIC": "Alchemic System",
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
      salonNotSet: "Unesite salon i popust",
      salonModalTitle: "Dobrodošli u Davines",
      salonModalDesc: "Unesite naziv vašeg studija / salona i izaberite vaš personalni popust (20% ili 30%):",
      salonInputLabel: "Naziv salona / studija:",
      discountLabel: "Personalni popust:",
      discLabel20: "Klijentski popust (20%)",
      discLabel30: "Specijalni popust (30%)",
      discountNotice: "ℹ️ Naziv i popust se trajno fiksiraju i ne mogu se naknadno menjati.",
      saveAndEnter: "Sačuvaj i otvori katalog",
      salonLockedToast: "Naziv salona i popust su fiksirani i ne mogu se menjati",
      salonPlaceholder: "na primer: Studio Elegance, Frizerski salon Ana...",
      save: "Sačuvaj",
      searchPlaceholder: "Pretraga po šifri ili nazivu (70031, nounou, oi)...",
      allLines: "Sve linije",
      itemsFound: "Pronađeno artikala",
      cart: "Korpa",
      cartEmptyTitle: "Vaša korpa je prazna",
      cartEmptyDesc: "Izaberite željene Davines proizvode iz kataloga",
      commentBtn: "Komentar",
      commentBtnEdit: "Izmeni",
      commentModalTitle: "💬 Komentar uz porudžbinu",
      commentModalDesc: "Navedite besplatne potrošne materijale (pelerine, kese) ili napomene za dostavu:",
      commentModalPlaceholder: "Na primer: potrebne jednokratne pelerine, kese za klijente...",
      commentSave: "✓ Sačuvaj komentar",
      commentClear: "🗑 Obriši",
      commentCancel: "Otkaži",
      historyBtn: "📋 Porudžbine",
      historyTitle: "Istorija porudžbina",
      historyDesc: "Vaše prethodne kreirane porudžbine:",
      historyEmpty: "Još uvek nemate prethodnih porudžbina na ovom uređaju.",
      historyRepeat: "Ponovi porudžbinu",
      vatIncluded: "sa PDV-om",
      total: "Ukupno",
      totalWithDiscount: "Ukupno sa popustom",
      retailTotalWithoutDiscount: "Maloprodajna cena (bez popusta):",
      sendOrder: "Pošalji porudžbinu predstavniku",
      copyOrder: "Kopiraj spisak porudžbine",
      orderCopied: "Spisak porudžbine je kopiran!",
      salonRequiredAlert: "Molimo unesite naziv vašeg salona!",
      clearCart: "Isprazni",
      addBtn: "U korpu",
      orderSuccess: "Porudžbina je kreirana!",
      orderSuccessSub: "Spisak je poslat prodajnom predstavniku",
      allSubcats: "Sve",
      chooseShades: "Izaberi nijanse",
      editShades: "Promeni nijanse",
      shadesSelected: "Izabrano nijansi",
      paletteSearchPlaceholder: "Pretraga tona (7.34, 10, quartz)...",
      applyPalette: "Sačuvaj u korpu",
      tubes: "kom",
      items: "artikala",
      lines: {
        "ALL": "Svi proizvodi",
        "COLORING": "Bojenje",
        "ESSENTIAL": "Essential Evolution",
        "NATURALTECH": "NaturalTech",
        "OI": "OI Line",
        "MORE_INSIDE": "More Inside",
        "HEART_OF_GLASS": "Heart of Glass",
        "ALCHEMIC": "Alchemic System",
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
    "COLORING": {
      key: "COLORING",
      filter: item => item.category === "BOJE" || 
                      item.category === "FINEST PIGMENTS" || 
                      item.category === "ACTIVATOR" || 
                      item.category === "THE CENTURY OF LIGHT"
    },
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
      filter: item => item.category === "BALANCE & BOUCLE" ||
                      item.category === "NATURALTECH TAILORING TREATMENT" || 
                      item.category === "DAVINES AUTHENTIC FORMULAS" || 
                      item.category === "LIQUID SPELL"
    }
  };

  // 3. Application State & Discount Initializer
  // Check if reset is requested via URL (?reset=1 or #reset)
  let isResetRequested = false;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === '1' || window.location.hash.includes('reset')) {
      isResetRequested = true;
      localStorage.removeItem('davines_salon_name');
      localStorage.removeItem('davines_discount');
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  } catch (e) {}

  const savedDiscount = isResetRequested ? 0 : parseInt(localStorage.getItem('davines_discount') || '0', 10);
  const savedSalon = isResetRequested ? '' : (localStorage.getItem('davines_salon_name') || '');

  // For users who already entered a salon, auto-set default 20% discount so they are never blocked
  let initialDiscount = 0;
  if (savedDiscount === 20 || savedDiscount === 30) {
    initialDiscount = savedDiscount;
  } else if (savedSalon) {
    initialDiscount = 20;
    localStorage.setItem('davines_discount', '20');
  }

  const state = {
    lang: localStorage.getItem('davines_lang') || 'ru',
    salonName: savedSalon,
    discount: initialDiscount,
    draftDiscount: (initialDiscount === 30) ? 30 : 20,
    activeLine: 'ALL',
    activeSubcat: 'ALL',
    searchQuery: '',
    comment: localStorage.getItem('davines_cart_comment') || '',
    cart: JSON.parse(localStorage.getItem('davines_cart') || '{}'),
    shadesCart: JSON.parse(localStorage.getItem('davines_shades_cart') || '{}'),
    catalog: window.DAVINES_CATALOG || [],
    shadesDb: window.DAVINES_SHADES || {},
    currentPaletteKey: null,
    paletteActiveLevel: 'ALL',
    paletteSearch: ''
  };

  // 4. Telegram WebApp Full-Screen Expansion (iOS & Android)
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  function expandTelegramApp() {
    if (!tg) return;
    try {
      tg.ready();
      tg.expand();
      if (tg.setHeaderColor) tg.setHeaderColor('#F9F8F5');
      if (tg.setBackgroundColor) tg.setBackgroundColor('#F9F8F5');
    } catch (e) {}
  }

  // Force expand immediately and at key intervals for iOS WebKit handshake
  expandTelegramApp();
  setTimeout(expandTelegramApp, 60);
  setTimeout(expandTelegramApp, 250);
  setTimeout(expandTelegramApp, 600);
  window.addEventListener('load', expandTelegramApp);

  if (tg && tg.onEvent) {
    tg.onEvent('viewportChanged', () => {
      if (!tg.isExpanded && tg.expand) tg.expand();
    });
  }

  // Clear any existing Service Workers to prevent iOS WebKit 60s fetch timeouts
  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.getRegistrations().then(regs => {
        for (let reg of regs) reg.unregister();
      });
      if (window.caches) {
        caches.keys().then(keys => {
          for (let key of keys) caches.delete(key);
        });
      }
    } catch (e) {}
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
    salonPillDiscount: document.getElementById('salonPillDiscount'),
    salonModal: document.getElementById('salonModal'),
    salonModalInput: document.getElementById('salonModalInput'),
    salonModalSave: document.getElementById('salonModalSave'),
    dialogSalonInputLabel: document.getElementById('dialogSalonInputLabel'),
    dialogDiscountLabel: document.getElementById('dialogDiscountLabel'),
    discLabel20: document.getElementById('discLabel20'),
    discLabel30: document.getElementById('discLabel30'),
    dialogDiscountNotice: document.getElementById('dialogDiscountNotice'),
    discountChoiceBtns: document.querySelectorAll('.discount-choice-btn'),
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
    cartDrawerDiscountBadge: document.getElementById('cartDrawerDiscountBadge'),
    cartDrawerRetailTotal: document.getElementById('cartDrawerRetailTotal'),
    cartDrawerBody: document.getElementById('cartDrawerBody'),
    cartCommentBtn: document.getElementById('cartCommentBtn'),
    cartCommentBtnText: document.getElementById('cartCommentBtnText'),
    cartCommentPreviewRow: document.getElementById('cartCommentPreviewRow'),
    cartCommentPreviewText: document.getElementById('cartCommentPreviewText'),
    cartCommentClearBtn: document.getElementById('cartCommentClearBtn'),
    commentModal: document.getElementById('commentModal'),
    commentModalTitle: document.getElementById('commentModalTitle'),
    commentModalDesc: document.getElementById('commentModalDesc'),
    commentModalInput: document.getElementById('commentModalInput'),
    btnSaveComment: document.getElementById('btnSaveComment'),
    btnClearComment: document.getElementById('btnClearComment'),
    btnCancelComment: document.getElementById('btnCancelComment'),
    historyBtn: document.getElementById('historyBtn'),
    historyModal: document.getElementById('historyModal'),
    historyModalTitle: document.getElementById('historyModalTitle'),
    historyModalDesc: document.getElementById('historyModalDesc'),
    historyList: document.getElementById('historyList'),
    historyCloseBtn: document.getElementById('historyCloseBtn'),
    btnSendOrder: document.getElementById('btnSendOrder'),
    btnCopyOrder: document.getElementById('btnCopyOrder'),
    btnClearCart: document.getElementById('btnClearCart'),
    toast: document.getElementById('toastMsg'),
    // Palette Modal DOM
    paletteModal: document.getElementById('paletteModal'),
    paletteTitle: document.getElementById('paletteTitle'),
    paletteSubtitle: document.getElementById('paletteSubtitle'),
    paletteCloseBtn: document.getElementById('paletteCloseBtn'),
    paletteSearchInput: document.getElementById('paletteSearchInput'),
    paletteClearSearchBtn: document.getElementById('paletteClearSearchBtn'),
    paletteLevelTabs: document.getElementById('paletteLevelTabs'),
    shadesGrid: document.getElementById('shadesGrid'),
    paletteSelectedCount: document.getElementById('paletteSelectedCount'),
    paletteSelectedTotal: document.getElementById('paletteSelectedTotal'),
    btnSavePalette: document.getElementById('btnSavePalette')
  };

  // 6. Pricing & Formatting Utilities
  function getDiscountRate() {
    return (state.discount === 30 || (!state.discount && state.draftDiscount === 30)) ? 30 : 20;
  }

  function getDiscountedPrice(retailPrice) {
    const disc = (state.discount === 30) ? 30 : ((state.discount === 20) ? 20 : state.draftDiscount);
    return Math.round(retailPrice * (1 - (disc / 100)));
  }

  function getCleanProductName(fullName) {
    if (!fullName) return "";
    const parts = fullName.split(/\s*[-—]\s*/);
    return parts[0].trim();
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
    const disc = (state.discount === 30 || state.discount === 20) ? state.discount : state.draftDiscount;

    dom.langBtn.innerHTML = state.lang === 'ru' ? '🇷🇺 RU' : '🇷🇸 SR';
    dom.searchInput.placeholder = t.searchPlaceholder;
    
    // Salon pill & Discount Pill
    if (state.salonName) {
      dom.salonPillName.textContent = state.salonName;
    } else {
      dom.salonPillName.textContent = t.salonNotSet;
    }
    if (dom.salonPillDiscount) {
      dom.salonPillDiscount.textContent = `-${disc}%`;
    }

    // Cart Drawer Salon Val & Badge
    dom.cartDrawerSalonVal.textContent = state.salonName || t.salonNotSet;
    if (dom.cartDrawerDiscountBadge) {
      dom.cartDrawerDiscountBadge.textContent = `-${disc}%`;
    }
    
    // Salon Modal labels
    document.getElementById('dialogTitle').textContent = t.salonModalTitle;
    document.getElementById('dialogDesc').textContent = t.salonModalDesc;
    if (dom.dialogSalonInputLabel) dom.dialogSalonInputLabel.textContent = t.salonInputLabel;
    if (dom.dialogDiscountLabel) dom.dialogDiscountLabel.textContent = t.discountLabel;
    if (dom.discLabel20) dom.discLabel20.textContent = t.discLabel20;
    if (dom.discLabel30) dom.discLabel30.textContent = t.discLabel30;
    if (dom.dialogDiscountNotice) dom.dialogDiscountNotice.textContent = t.discountNotice;
    dom.salonModalInput.placeholder = t.salonPlaceholder;
    dom.salonModalSave.textContent = t.saveAndEnter;
    
    // Cart drawer labels
    document.getElementById('drawerTitle').textContent = t.cart;
    document.getElementById('cartSalonLabel').textContent = t.salonPill + ":";
    document.getElementById('cartDrawerVatNote').textContent = t.vatIncluded;
    document.getElementById('summaryLabel').textContent = `${t.totalWithDiscount} (-${disc}%):`;
    dom.btnSendOrder.innerHTML = `<span>✈️</span> ${t.sendOrder}`;
    dom.btnCopyOrder.textContent = t.copyOrder;
    dom.btnClearCart.textContent = t.clearCart;

    // Comment Modal labels
    if (dom.commentModalTitle) dom.commentModalTitle.textContent = t.commentModalTitle;
    if (dom.commentModalDesc) dom.commentModalDesc.textContent = t.commentModalDesc;
    if (dom.commentModalInput) dom.commentModalInput.placeholder = t.commentModalPlaceholder;
    if (dom.btnSaveComment) dom.btnSaveComment.textContent = t.commentSave;
    if (dom.btnClearComment) dom.btnClearComment.textContent = t.commentClear;
    if (dom.btnCancelComment) dom.btnCancelComment.textContent = t.commentCancel;
    updateCommentUI();

    // History Modal labels
    if (dom.historyBtn) dom.historyBtn.textContent = t.historyBtn;
    if (dom.historyModalTitle) dom.historyModalTitle.textContent = t.historyTitle;
    if (dom.historyModalDesc) dom.historyModalDesc.textContent = t.historyDesc;

    // Palette modal labels
    if (dom.paletteSearchInput) dom.paletteSearchInput.placeholder = t.paletteSearchPlaceholder;
    if (dom.btnSavePalette) dom.btnSavePalette.textContent = t.applyPalette;
  }

  // 8. Render Category Tabs
  function renderCategoryTabs() {
    const t = I18N[state.lang];
    dom.linesScroll.innerHTML = '';

    const categories = [
      { key: 'ALL', label: t.lines.ALL, count: state.catalog.length },
      { key: 'COLORING', label: t.lines.COLORING, count: countItems('COLORING') },
      { key: 'ESSENTIAL', label: t.lines.ESSENTIAL, count: countItems('ESSENTIAL') },
      { key: 'NATURALTECH', label: t.lines.NATURALTECH, count: countItems('NATURALTECH') },
      { key: 'OI', label: t.lines.OI, count: countItems('OI') },
      { key: 'MORE_INSIDE', label: t.lines.MORE_INSIDE, count: countItems('MORE_INSIDE') },
      { key: 'HEART_OF_GLASS', label: t.lines.HEART_OF_GLASS, count: countItems('HEART_OF_GLASS') },
      { key: 'ALCHEMIC', label: t.lines.ALCHEMIC, count: countItems('ALCHEMIC') },
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
    if (state.activeLine === 'ALL' || state.activeLine === 'TRAVEL' || state.activeLine === 'CIRCLE' || state.activeLine === 'OI' || state.activeLine === 'SU' || state.activeLine === 'PASTA_LOVE') {
      dom.subcatContainer.style.display = 'none';
      return;
    }

    const def = CATEGORY_MAP[state.activeLine];
    const items = state.catalog.filter(def.filter);
    let subcats = Array.from(new Set(items.map(i => i.sub_category)));

    if (state.activeLine === 'COLORING') {
      const coloringOrder = [
        'Красители (Mask, View, TPT)',
        'Century of Light (Пудры)',
        'Activator (Окислители)',
        'Finest Pigments'
      ];
      subcats.sort((a, b) => {
        const ia = coloringOrder.indexOf(a);
        const ib = coloringOrder.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b);
      });
    } else if (state.activeLine === 'OTHER') {
      const otherOrder = [
        'Завивка',
        'Tailoring Treatment',
        'Authentic Formulas',
        'Liquid Spell'
      ];
      subcats.sort((a, b) => {
        const ia = otherOrder.indexOf(a);
        const ib = otherOrder.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b);
      });
    } else {
      subcats.sort();
    }

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

  // Helper: map product code to shade database key
  function getShadesKeyForProduct(code) {
    if (code === "DAV-BOJE-01") return "MASK_VIBRACHROM";
    if (code === "DAV-BOJE-02") return "VIEW_COLOR";
    if (code === "DAV-BOJE-04") return "THE_PRESENT_TIME";
    return null;
  }

  // 11. Render Product Grid (DocumentFragment Optimized, Ultra Fast)
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

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < items.length; i++) {
      fragment.appendChild(createProductCard(items[i]));
    }
    dom.catalogList.appendChild(fragment);
  }

  function createProductCard(item) {
    const t = I18N[state.lang];
    const shadesKey = getShadesKeyForProduct(item.code);
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

    const discRate = getDiscountRate();
    const discPrice = getDiscountedPrice(item.mp_price);

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
          <span class="price-main">${formatMoney(discPrice)}</span>
          <div class="price-retail-row">
            <span class="price-retail-strike">${formatMoney(item.mp_price)}</span>
            <span class="price-discount-tag">-${discRate}%</span>
          </div>
        </div>
        <div class="card-actions" id="action-${item.code}">
          ${shadesKey ? renderShadesButtonWidget(shadesKey) : renderQuantityWidget(item.code, state.cart[item.code] || 0)}
        </div>
      </div>
    `;

    bindCardButtons(card, item.code, shadesKey);
    return card;
  }

  function renderShadesButtonWidget(shadesKey) {
    const t = I18N[state.lang];
    const shadesMap = state.shadesCart[shadesKey] || {};
    let totalSelected = 0;
    for (const qty of Object.values(shadesMap)) {
      totalSelected += qty;
    }

    if (totalSelected > 0) {
      const lineInfo = state.shadesDb[shadesKey] || {};
      const discShadePrice = getDiscountedPrice(lineInfo.price_mp || 0);
      const totalAmount = totalSelected * discShadePrice;
      return `
        <button class="btn-add-initial btn-open-palette" data-line="${shadesKey}" style="background: var(--accent-green); font-size: 12px; padding: 7px 12px;">
          🎨 ${totalSelected} ${t.tubes} (${formatMoney(totalAmount)})
        </button>
      `;
    } else {
      return `
        <button class="btn-add-initial btn-open-palette" data-line="${shadesKey}">
          🎨 ${t.chooseShades}
        </button>
      `;
    }
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

  function bindCardButtons(cardElement, code, shadesKey) {
    if (shadesKey) {
      const btn = cardElement.querySelector('.btn-open-palette');
      if (btn) {
        btn.addEventListener('click', () => openPaletteModal(shadesKey));
      }
      return;
    }

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

  function updateShadeQuantity(lineKey, shade, newQty) {
    triggerHaptic('light');
    if (!state.shadesCart[lineKey]) {
      state.shadesCart[lineKey] = {};
    }
    if (newQty <= 0) {
      delete state.shadesCart[lineKey][shade];
      if (Object.keys(state.shadesCart[lineKey]).length === 0) {
        delete state.shadesCart[lineKey];
      }
    } else {
      state.shadesCart[lineKey][shade] = newQty;
    }
    localStorage.setItem('davines_shades_cart', JSON.stringify(state.shadesCart));

    // Update palette footer
    renderPaletteSummary();
    renderCartFloatingBar();
    renderCartDrawerContent();
  }

  function getCartSummary() {
    let totalItems = 0;
    let totalPriceDiscounted = 0;
    let totalPriceRetail = 0;
    let orderedList = [];

    // 1. Standard Products
    for (const [code, qty] of Object.entries(state.cart)) {
      if (qty <= 0) continue;
      const product = state.catalog.find(p => p.code === code);
      if (product) {
        const discPrice = getDiscountedPrice(product.mp_price);
        const subtotalDisc = discPrice * qty;
        const subtotalRetail = product.mp_price * qty;

        totalItems += qty;
        totalPriceDiscounted += subtotalDisc;
        totalPriceRetail += subtotalRetail;

        orderedList.push({
          product,
          isShade: false,
          qty,
          discPrice,
          subtotalDisc,
          subtotalRetail
        });
      }
    }

    // 2. Shade Products from Palettes
    for (const [lineKey, shadesMap] of Object.entries(state.shadesCart)) {
      const lineInfo = state.shadesDb[lineKey];
      if (!lineInfo) continue;
      for (const [shade, qty] of Object.entries(shadesMap)) {
        if (qty <= 0) continue;
        const discPrice = getDiscountedPrice(lineInfo.price_mp);
        const subtotalDisc = discPrice * qty;
        const subtotalRetail = lineInfo.price_mp * qty;

        totalItems += qty;
        totalPriceDiscounted += subtotalDisc;
        totalPriceRetail += subtotalRetail;

        orderedList.push({
          product: {
            code: `${lineKey}-${shade}`,
            name: `${lineInfo.name} (тон ${shade})`,
            volume: lineInfo.volume,
            mp_price: lineInfo.price_mp,
            category: "BOJE",
            sub_category: "Красители (оттенки)"
          },
          isShade: true,
          lineKey: lineKey,
          shade: shade,
          qty: qty,
          discPrice,
          subtotalDisc,
          subtotalRetail
        });
      }
    }

    return { totalItems, totalPriceDiscounted, totalPriceRetail, orderedList };
  }

  function renderCartFloatingBar() {
    const t = I18N[state.lang];
    const { totalItems, totalPriceDiscounted } = getCartSummary();

    if (totalItems > 0) {
      dom.cartFloatingBar.classList.add('visible');
      dom.cartBarCount.textContent = `${totalItems} ${t.items}`;
      dom.cartBarTotal.textContent = formatMoney(totalPriceDiscounted);
    } else {
      dom.cartFloatingBar.classList.remove('visible');
    }
  }

  function renderCartDrawerContent() {
    const t = I18N[state.lang];
    const discRate = getDiscountRate();
    const { totalItems, totalPriceDiscounted, totalPriceRetail, orderedList } = getCartSummary();

    document.getElementById('summaryLabel').textContent = `${t.totalWithDiscount} (-${discRate}%):`;
    dom.cartDrawerTotal.textContent = formatMoney(totalPriceDiscounted);
    if (dom.cartDrawerRetailTotal) {
      if (totalItems > 0) {
        dom.cartDrawerRetailTotal.innerHTML = `${t.retailTotalWithoutDiscount} <s>${formatMoney(totalPriceRetail)}</s>`;
      } else {
        dom.cartDrawerRetailTotal.textContent = '';
      }
    }
    dom.cartItemsScroll.innerHTML = '';

    updateCommentUI();

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

    orderedList.forEach(({ product, isShade, lineKey, shade, qty, subtotalDisc, subtotalRetail }) => {
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
          <button class="qty-btn btn-drawer-minus">−</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn btn-drawer-plus">+</button>
        </div>
        <div class="cart-item-price-box">
          <div class="cart-item-price">${formatMoney(subtotalDisc)}</div>
          <div class="cart-item-retail-sub"><s>${formatMoney(subtotalRetail)}</s></div>
        </div>
      `;

      row.querySelector('.btn-drawer-minus').addEventListener('click', () => {
        if (isShade) {
          updateShadeQuantity(lineKey, shade, qty - 1);
        } else {
          updateQuantity(product.code, qty - 1);
        }
      });
      row.querySelector('.btn-drawer-plus').addEventListener('click', () => {
        if (isShade) {
          updateShadeQuantity(lineKey, shade, qty + 1);
        } else {
          updateQuantity(product.code, qty + 1);
        }
      });

      dom.cartItemsScroll.appendChild(row);
    });
  }

  // 13. Order Text Formatting (HTML and Plain Text variants)
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function generateOrderHtml() {
    const discRate = getDiscountRate();
    const { totalItems, totalPriceDiscounted, orderedList } = getCartSummary();
    const comment = (state.comment ? state.comment.trim() : "");

    let lines = [];
    const salonStr = escapeHtml(state.salonName || "Nije navedeno");
    let headerStr = `<b>${salonStr}</b>`;

    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const u = tg.initDataUnsafe.user;
      const firstName = u.first_name || '';
      const lastName = u.last_name || '';
      const fullName = [firstName, lastName].filter(Boolean).join(' ') || u.username || '';
      const escapedName = escapeHtml(fullName);

      if (u.username) {
        headerStr += ` ("${escapedName}" <a href="https://t.me/${u.username}">@${u.username}</a>)`;
      } else if (u.id) {
        headerStr += ` (<a href="tg://user?id=${u.id}">"${escapedName}"</a>)`;
      } else if (escapedName) {
        headerStr += ` ("${escapedName}")`;
      }
    }

    lines.push(headerStr);
    lines.push(``);

    orderedList.forEach((item, idx) => {
      let itemTitle = "";
      if (item.isShade) {
        let brandPrefix = "View";
        if (item.lineKey === 'MASK_VIBRACHROM') brandPrefix = "Mask";
        else if (item.lineKey === 'THE_PRESENT_TIME') brandPrefix = "The Present Time";
        itemTitle = `${brandPrefix} (${escapeHtml(item.shade)})`;
      } else {
        const clean = getCleanProductName(item.product.name);
        const vol = item.product.volume || '';
        const volPart = (vol && !clean.toLowerCase().includes(vol.toLowerCase())) ? ` ${vol}` : '';
        itemTitle = `(${escapeHtml(item.product.code)}) ${escapeHtml(clean)}${escapeHtml(volPart)}`;
      }
      lines.push(`${idx + 1}. ${itemTitle} — ${item.qty} шт`);
    });

    if (comment) {
      lines.push(``);
      lines.push(`💬 <b>Комментарий:</b> ${escapeHtml(comment)}`);
    }

    lines.push(``);
    lines.push(`💰 <b>Итого со скидкой (${discRate}%):</b> ${formatMoney(totalPriceDiscounted)}`);

    return lines.join('\n');
  }

  function generateOrderPlainText() {
    const discRate = getDiscountRate();
    const { totalItems, totalPriceDiscounted, orderedList } = getCartSummary();
    const comment = (state.comment ? state.comment.trim() : "");

    let lines = [];
    const salonStr = state.salonName || "Nije navedeno";
    let headerStr = `${salonStr}`;

    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const u = tg.initDataUnsafe.user;
      const firstName = u.first_name || '';
      const lastName = u.last_name || '';
      const fullName = [firstName, lastName].filter(Boolean).join(' ') || u.username || '';

      if (u.username) {
        headerStr += ` ("${fullName}" @${u.username})`;
      } else if (fullName) {
        headerStr += ` ("${fullName}")`;
      }
    }

    lines.push(headerStr);
    lines.push(``);

    orderedList.forEach((item, idx) => {
      let itemTitle = "";
      if (item.isShade) {
        let brandPrefix = "View";
        if (item.lineKey === 'MASK_VIBRACHROM') brandPrefix = "Mask";
        else if (item.lineKey === 'THE_PRESENT_TIME') brandPrefix = "The Present Time";
        itemTitle = `${brandPrefix} (${item.shade})`;
      } else {
        const clean = getCleanProductName(item.product.name);
        const vol = item.product.volume || '';
        const volPart = (vol && !clean.toLowerCase().includes(vol.toLowerCase())) ? ` ${vol}` : '';
        itemTitle = `(${item.product.code}) ${clean}${volPart}`;
      }
      lines.push(`${idx + 1}. ${itemTitle} — ${item.qty} шт`);
    });

    if (comment) {
      lines.push(``);
      lines.push(`💬 Комментарий: ${comment}`);
    }

    lines.push(``);
    lines.push(`💰 Итого со скидкой (${discRate}%): ${formatMoney(totalPriceDiscounted)}`);

    return lines.join('\n');
  }

  // 14. Send Order Handler (Native Telegram WebApp sendData + Device History)
  function handleSendOrder() {
    const t = I18N[state.lang];
    if (!state.salonName.trim()) {
      showToast(t.salonRequiredAlert);
      openSalonModal(true);
      return;
    }

    const discRate = getDiscountRate();
    const { totalItems, totalPriceDiscounted, totalPriceRetail, orderedList } = getCartSummary();
    if (totalItems === 0) return;

    dom.btnSendOrder.disabled = true;
    dom.btnSendOrder.innerHTML = `<span>⏳</span> ${state.lang === 'ru' ? 'Оформление заказа...' : 'Slanje porudžbine...'}`;

    const orderHtml = generateOrderHtml();
    const orderPlainText = generateOrderPlainText();
    const currentComment = state.comment ? state.comment.trim() : "";

    const orderPayload = {
      action: "davines_order",
      salon_name: state.salonName,
      discount: discRate,
      total_items: totalItems,
      total_price_mp: totalPriceDiscounted,
      comment: currentComment,
      items: orderedList.map(item => ({
        code: item.product.code,
        name: item.isShade ? `${item.lineKey} (${item.shade})` : item.product.name,
        volume: item.product.volume || '',
        qty: item.qty,
        price_mp: item.product.mp_price,
        disc_price: item.discPrice
      })),
      formatted_html: orderHtml,
      formatted_text: orderPlainText
    };

    // Save to local device order history
    saveOrderToLocalHistory({
      id: Date.now(),
      date: new Date().toISOString(),
      salon_name: state.salonName,
      discount: discRate,
      total_items: totalItems,
      total_price_mp: totalPriceDiscounted,
      comment: currentComment,
      formatted_text: orderPlainText,
      items: orderPayload.items
    });

    // Check if running inside Telegram WebApp
    const isInsideTelegram = Boolean(tg && typeof tg.sendData === 'function');

    if (isInsideTelegram) {
      triggerHaptic('success');
      showToast(t.orderSuccess);
      dom.btnSendOrder.innerHTML = `<span>✅</span> ${state.lang === 'ru' ? 'Заказ оформлен!' : 'Porudžbina poslata!'}`;

      // Reset cart and comment state
      state.cart = {};
      state.shadesCart = {};
      state.comment = "";
      localStorage.removeItem('davines_cart');
      localStorage.removeItem('davines_shades_cart');
      localStorage.removeItem('davines_cart_comment');
      renderProducts();
      renderCartFloatingBar();
      updateCommentUI();

      // Send payload directly to Telegram Bot via native client bridge
      try {
        tg.sendData(JSON.stringify(orderPayload));
      } catch (err) {
        console.warn("tg.sendData warning:", err);
      }

      setTimeout(() => {
        closeCartDrawer();
        dom.btnSendOrder.disabled = false;
        dom.btnSendOrder.innerHTML = `<span>✈️</span> ${t.sendOrder}`;
        if (tg && tg.close) {
          try { tg.close(); } catch(e) {}
        }
      }, 1000);
      return;
    }

    // Standalone Browser Fallback (e.g. testing in desktop/mobile browser)
    copyToClipboard(orderPlainText);
    showToast(state.lang === 'ru' ? 'Заказ скопирован! Открываем Telegram...' : 'Porudžbina je kopirana!');
    dom.btnSendOrder.innerHTML = `<span>✅</span> ${state.lang === 'ru' ? 'Заказ скопирован' : 'Spisak kopiran'}`;

    const tgUrl = `https://t.me/Ivan_Sergeevich_23?text=${encodeURIComponent(orderPlainText)}`;
    setTimeout(() => {
      window.open(tgUrl, '_blank');
      closeCartDrawer();
      dom.btnSendOrder.disabled = false;
      dom.btnSendOrder.innerHTML = `<span>✈️</span> ${t.sendOrder}`;
    }, 1000);
  }

  // Comment Modal & Tile Handlers
  function openCommentModal() {
    dom.commentModalInput.value = state.comment || "";
    if (dom.btnClearComment) {
      dom.btnClearComment.style.display = state.comment ? "block" : "none";
    }
    dom.modalOverlay.classList.add("open");
    dom.commentModal.classList.add("open");
    setTimeout(() => {
      if (dom.commentModalInput) dom.commentModalInput.focus();
    }, 150);
  }

  function closeCommentModal() {
    if (document.activeElement) document.activeElement.blur();
    dom.commentModal.classList.remove("open");
    if (!dom.cartDrawer.classList.contains("open")) {
      dom.modalOverlay.classList.remove("open");
    }
  }

  function saveComment() {
    state.comment = dom.commentModalInput.value.trim();
    if (state.comment) {
      localStorage.setItem("davines_cart_comment", state.comment);
    } else {
      localStorage.removeItem("davines_cart_comment");
    }
    triggerHaptic("light");
    closeCommentModal();
    updateCommentUI();
  }

  function clearComment() {
    state.comment = "";
    dom.commentModalInput.value = "";
    localStorage.removeItem("davines_cart_comment");
    triggerHaptic("light");
    closeCommentModal();
    updateCommentUI();
  }

  function updateCommentUI() {
    const t = I18N[state.lang];
    if (!dom.cartCommentBtn) return;
    if (state.comment && state.comment.trim()) {
      dom.cartCommentBtn.classList.add("has-comment");
      if (dom.cartCommentBtnText) dom.cartCommentBtnText.textContent = t.commentBtnEdit || (state.lang === 'ru' ? 'Изменить' : 'Izmeni');
      if (dom.cartCommentPreviewRow) dom.cartCommentPreviewRow.style.display = "flex";
      if (dom.cartCommentPreviewText) dom.cartCommentPreviewText.textContent = state.comment.trim();
    } else {
      dom.cartCommentBtn.classList.remove("has-comment");
      if (dom.cartCommentBtnText) dom.cartCommentBtnText.textContent = t.commentBtn || (state.lang === 'ru' ? 'Комментарий' : 'Komentar');
      if (dom.cartCommentPreviewRow) dom.cartCommentPreviewRow.style.display = "none";
      if (dom.cartCommentPreviewText) dom.cartCommentPreviewText.textContent = "";
    }
  }

  // Local Order History
  function saveOrderToLocalHistory(orderRecord) {
    try {
      let history = JSON.parse(localStorage.getItem("davines_order_history") || "[]");
      history.unshift(orderRecord);
      if (history.length > 25) history = history.slice(0, 25);
      localStorage.setItem("davines_order_history", JSON.stringify(history));
    } catch(e) {
      console.warn("Failed to save local history:", e);
    }
  }

  function openHistoryModal() {
    const t = I18N[state.lang];
    if (!dom.historyList) return;
    dom.historyList.innerHTML = "";

    let history = [];
    try {
      history = JSON.parse(localStorage.getItem("davines_order_history") || "[]");
    } catch(e) {}

    if (!history || history.length === 0) {
      dom.historyList.innerHTML = `
        <div style="text-align: center; padding: 30px 10px; color: var(--text-muted); font-size: 13px;">
          ${t.historyEmpty}
        </div>
      `;
    } else {
      history.forEach((order, index) => {
        const dateObj = new Date(order.date);
        const dateFormatted = dateObj.toLocaleDateString(state.lang === 'ru' ? 'ru-RU' : 'sr-RS', {
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });
        const orderNum = `#DV-${String(history.length - index).padStart(4, '0')}`;
        const card = document.createElement("div");
        card.className = "history-card";
        card.innerHTML = `
          <div class="history-card-header">
            <span class="history-card-id">${orderNum} • ${escapeHtml(order.salon_name)} (-${order.discount}%)</span>
            <span class="history-card-date">${dateFormatted}</span>
          </div>
          <div class="history-card-summary">
            <span class="history-card-items">${order.total_items} ${t.items}</span>
            <span class="history-card-total">${formatMoney(order.total_price_mp)}</span>
          </div>
          ${order.comment ? `<div class="history-card-comment">💬 ${escapeHtml(order.comment)}</div>` : ''}
          <button type="button" class="history-card-repeat-btn" data-idx="${index}">
            🔄 ${t.historyRepeat}
          </button>
        `;

        card.querySelector(".history-card-repeat-btn").addEventListener("click", () => {
          repeatOrder(order);
        });

        dom.historyList.appendChild(card);
      });
    }

    dom.modalOverlay.classList.add("open");
    dom.historyModal.classList.add("open");
  }

  function closeHistoryModal() {
    dom.historyModal.classList.remove("open");
    if (!dom.cartDrawer.classList.contains("open")) {
      dom.modalOverlay.classList.remove("open");
    }
  }

  function repeatOrder(order) {
    if (!order.items || !Array.isArray(order.items)) return;
    triggerHaptic("success");
    order.items.forEach(item => {
      if (item.code.includes("-")) {
        const [lineKey, ...shadeParts] = item.code.split("-");
        const shade = shadeParts.join("-");
        if (!state.shadesCart[lineKey]) state.shadesCart[lineKey] = {};
        state.shadesCart[lineKey][shade] = (state.shadesCart[lineKey][shade] || 0) + item.qty;
      } else {
        state.cart[item.code] = (state.cart[item.code] || 0) + item.qty;
      }
    });
    localStorage.setItem("davines_cart", JSON.stringify(state.cart));
    localStorage.setItem("davines_shades_cart", JSON.stringify(state.shadesCart));
    renderProducts();
    renderCartFloatingBar();
    closeHistoryModal();
    openCartDrawer();
    showToast(state.lang === 'ru' ? 'Товары добавлены в корзину!' : 'Artikli su dodati u korpu!');
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

  // 15. Color Palette Drawer Logic
  function openPaletteModal(lineKey) {
    state.currentPaletteKey = lineKey;
    state.paletteActiveLevel = 'ALL';
    state.paletteSearch = '';
    const lineInfo = state.shadesDb[lineKey];
    if (!lineInfo) return;

    const discRate = getDiscountRate();
    const discPrice = getDiscountedPrice(lineInfo.price_mp);

    dom.paletteTitle.textContent = lineInfo.name;
    dom.paletteSubtitle.innerHTML = `${lineInfo.volume} • <b>${formatMoney(discPrice)}</b> <span style="font-size: 11px; opacity: 0.85;">(<s>${formatMoney(lineInfo.price_mp)}</s> MP -${discRate}%)</span> • ${lineInfo.count} ${state.lang === 'ru' ? 'оттенков' : 'nijansi'}`;
    if (dom.paletteSearchInput) dom.paletteSearchInput.value = '';

    renderPaletteLevelTabs(lineKey);
    renderShadesGrid();
    renderPaletteSummary();

    dom.paletteModal.classList.add('open');
    dom.modalOverlay.classList.add('open');
    triggerHaptic('medium');
  }

  function closePaletteModal() {
    dom.paletteModal.classList.remove('open');
    if (!dom.cartDrawer.classList.contains('open') && !dom.salonModal.classList.contains('open')) {
      dom.modalOverlay.classList.remove('open');
    }
    // Update product card badge
    renderProducts();
  }

  function renderPaletteLevelTabs(lineKey) {
    dom.paletteLevelTabs.innerHTML = '';
    let tabs = [{ key: 'ALL', label: state.lang === 'ru' ? 'Все' : 'Sve' }];

    if (lineKey === 'MASK_VIBRACHROM') {
      tabs.push(
        { key: 'NAT', label: '.0 Базы' },
        { key: '1-4', label: '1 - 4' },
        { key: '5-6', label: '5 - 6' },
        { key: '7-8', label: '7 - 8' },
        { key: '9-10', label: '9 - 10' },
        { key: '12', label: '12 Блонды' },
        { key: '0.xx', label: '0.xx Микстона' }
      );
    } else if (lineKey === 'VIEW_COLOR') {
      tabs.push(
        { key: 'TONERS', label: 'Тонеры / Gloss' },
        { key: '2-4', label: '2 - 4' },
        { key: '5-6', label: '5 - 6' },
        { key: '7-8', label: '7 - 8' },
        { key: '9-10', label: '9 - 10' }
      );
    } else if (lineKey === 'THE_PRESENT_TIME') {
      tabs.push(
        { key: 'SPECIAL', label: 'Specialties' },
        { key: '2-4', label: '2 - 4' },
        { key: '5-6', label: '5 - 6' },
        { key: '7-8', label: '7 - 8' },
        { key: '9-10', label: '9 - 10' }
      );
    }

    tabs.forEach(t => {
      const tab = document.createElement('div');
      tab.className = `palette-level-tab ${state.paletteActiveLevel === t.key ? 'active' : ''}`;
      tab.textContent = t.label;
      tab.addEventListener('click', () => {
        state.paletteActiveLevel = t.key;
        triggerHaptic('light');
        renderPaletteLevelTabs(lineKey);
        renderShadesGrid();
      });
      dom.paletteLevelTabs.appendChild(tab);
    });
  }

  function getFilteredShades() {
    const lineKey = state.currentPaletteKey;
    const lineInfo = state.shadesDb[lineKey];
    if (!lineInfo) return [];

    let shades = lineInfo.shades || [];

    // Filter by Level
    if (state.paletteActiveLevel !== 'ALL') {
      const lvl = state.paletteActiveLevel;
      if (lvl === 'NAT') {
        shades = shades.filter(s => s.endsWith('.0') || s.endsWith(',0') || ['1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0', '9.0', '10.0', '33.0', '44.0', '55.0', '66.0', '77.0', '88.0', '99.0', '4', '5', '6', '7', '8'].includes(s));
      } else if (lvl === '0.xx') {
        shades = shades.filter(s => s.startsWith('0.'));
      } else if (lvl === '12') {
        shades = shades.filter(s => s.startsWith('12.'));
      } else if (lvl === 'TONERS') {
        shades = shades.filter(s => ['QUARTZ', 'BRONZE', 'CHARCOAL', 'STEEL', 'GLOSS 500', 'RUBY', 'VIOLET AMETH'].includes(s));
      } else if (lvl === 'SPECIAL') {
        shades = shades.filter(s => s.includes('BLUE') || s.includes('GREEN') || s.includes('VIOLET') || s.includes('RED') || s.includes('YELLOW') || s.includes('CLEAR'));
      } else if (lvl === '1-4' || lvl === '2-4') {
        shades = shades.filter(s => /^[1-4](\.|\b)/.test(s));
      } else if (lvl === '5-6') {
        shades = shades.filter(s => /^[5-6](\.|\b)/.test(s) || s.startsWith('55.') || s.startsWith('66.'));
      } else if (lvl === '7-8') {
        shades = shades.filter(s => /^[7-8](\.|\b)/.test(s) || s.startsWith('77.') || s.startsWith('88.'));
      } else if (lvl === '9-10') {
        shades = shades.filter(s => /^(9|10)(\.|\b)/.test(s) || s.startsWith('99.'));
      }
    }

    // Filter by search text
    if (state.paletteSearch.trim()) {
      const q = state.paletteSearch.trim().toLowerCase();
      shades = shades.filter(s => s.toLowerCase().includes(q));
    }

    return shades;
  }

  function renderShadesGrid() {
    const shades = getFilteredShades();
    dom.shadesGrid.innerHTML = '';

    if (shades.length === 0) {
      dom.shadesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px 10px; color: var(--text-muted);">
          Не найдено оттенков
        </div>
      `;
      return;
    }

    const lineKey = state.currentPaletteKey;
    const currentCartMap = state.shadesCart[lineKey] || {};

    shades.forEach(shade => {
      const qty = currentCartMap[shade] || 0;
      const tile = document.createElement('div');
      tile.className = `shade-tile ${qty > 0 ? 'selected' : ''}`;
      tile.innerHTML = `
        <div class="shade-num">${shade}</div>
        <div class="shade-tile-counter">
          ${qty > 0 ? `
            <button class="shade-btn-sm btn-tile-minus">−</button>
            <span class="shade-qty-val">${qty}</span>
            <button class="shade-btn-sm btn-tile-plus">+</button>
          ` : `
            <span style="font-size: 11px; color: var(--text-dim); margin-top: 4px;">+ выбрать</span>
          `}
        </div>
      `;

      tile.addEventListener('click', (e) => {
        // If clicking inside counter buttons
        if (e.target.classList.contains('btn-tile-plus')) {
          e.stopPropagation();
          updateShadeQuantity(lineKey, shade, qty + 1);
          renderShadesGrid();
          return;
        }
        if (e.target.classList.contains('btn-tile-minus')) {
          e.stopPropagation();
          updateShadeQuantity(lineKey, shade, qty - 1);
          renderShadesGrid();
          return;
        }

        // Clicking the tile directly toggles / adds 1
        if (qty === 0) {
          updateShadeQuantity(lineKey, shade, 1);
          renderShadesGrid();
        }
      });

      dom.shadesGrid.appendChild(tile);
    });
  }

  function renderPaletteSummary() {
    const t = I18N[state.lang];
    const lineKey = state.currentPaletteKey;
    if (!lineKey) return;
    const lineInfo = state.shadesDb[lineKey] || {};
    const shadesMap = state.shadesCart[lineKey] || {};

    let totalSelected = 0;
    for (const qty of Object.values(shadesMap)) {
      totalSelected += qty;
    }

    const discPrice = getDiscountedPrice(lineInfo.price_mp || 0);
    const totalMoney = totalSelected * discPrice;
    dom.paletteSelectedCount.textContent = `${t.shadesSelected}: ${totalSelected} ${t.tubes}`;
    dom.paletteSelectedTotal.textContent = formatMoney(totalMoney);
  }

  // 16. Modals & Drawer Toggles
  function updateDiscountButtonsUI() {
    const activeVal = state.draftDiscount || 20;
    const btns = document.querySelectorAll('.discount-choice-btn');
    btns.forEach(btn => {
      const d = parseInt(btn.getAttribute('data-discount'), 10);
      if (d === activeVal) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function openSalonModal(force = false) {
    if (!force && state.salonName && (state.discount === 20 || state.discount === 30)) {
      showToast(I18N[state.lang].salonLockedToast);
      return;
    }

    dom.salonModalInput.value = state.salonName;
    state.draftDiscount = (state.discount === 30) ? 30 : 20;
    updateDiscountButtonsUI();

    dom.salonModal.classList.add('open');
    dom.modalOverlay.classList.add('open');
    setTimeout(() => dom.salonModalInput.focus(), 150);
  }

  function closeSalonModal() {
    if (!state.salonName || (state.discount !== 20 && state.discount !== 30)) {
      // Must complete setup before closing
      return;
    }
    dom.salonModal.classList.remove('open');
    if (!dom.cartDrawer.classList.contains('open') && !dom.paletteModal.classList.contains('open')) {
      dom.modalOverlay.classList.remove('open');
    }
  }

  function saveSalonName() {
    const val = dom.salonModalInput.value.trim();
    if (!val) {
      showToast(I18N[state.lang].salonRequiredAlert);
      dom.salonModalInput.focus();
      return;
    }

    state.salonName = val;
    state.discount = state.draftDiscount || 20;
    localStorage.setItem('davines_salon_name', state.salonName);
    localStorage.setItem('davines_discount', state.discount.toString());

    renderStaticTexts();
    renderCategoryTabs();
    renderProducts();
    renderCartFloatingBar();
    renderCartDrawerContent();

    dom.salonModal.classList.remove('open');
    if (!dom.cartDrawer.classList.contains('open') && !dom.paletteModal.classList.contains('open')) {
      dom.modalOverlay.classList.remove('open');
    }

    showToast(state.lang === 'ru' ? 'Данные успешно зафиксированы' : 'Podaci su uspešno fiksirani');
    triggerHaptic('success');
  }

  function openCartDrawer() {
    renderCartDrawerContent();
    dom.cartDrawer.classList.add('open');
    dom.modalOverlay.classList.add('open');
    triggerHaptic('medium');
  }

  function closeCartDrawer() {
    dom.cartDrawer.classList.remove('open');
    if (!dom.salonModal.classList.contains('open') && !dom.paletteModal.classList.contains('open')) {
      dom.modalOverlay.classList.remove('open');
    }
  }

  // 17. Event Listeners
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
      renderCartDrawerContent();
    });

    // Salon pill click:
    // Single tap: if already configured, notifies user that it is locked.
    // 3 rapid taps (within 1.2s): confirms and allows changing salon name and discount!
    let pillTapCount = 0;
    let pillTapTimer = null;

    dom.salonPill.addEventListener('click', () => {
      pillTapCount++;
      clearTimeout(pillTapTimer);
      pillTapTimer = setTimeout(() => {
        pillTapCount = 0;
      }, 1200);

      if (pillTapCount >= 3) {
        pillTapCount = 0;
        const confirmMsg = state.lang === 'ru'
          ? 'Хотите изменить название салона и скидку?'
          : 'Želite li da promenite naziv salona i popust?';
        if (confirm(confirmMsg)) {
          openSalonModal(true);
        }
        return;
      }

      if (state.salonName && (state.discount === 20 || state.discount === 30)) {
        showToast(I18N[state.lang].salonLockedToast);
      } else {
        openSalonModal(true);
      }
    });

    // Discount selector buttons in modal
    const discountBtns = document.querySelectorAll('.discount-choice-btn');
    discountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const d = parseInt(btn.getAttribute('data-discount'), 10);
        if (d === 20 || d === 30) {
          state.draftDiscount = d;
          updateDiscountButtonsUI();
          triggerHaptic('light');
        }
      });
    });

    dom.salonModalSave.addEventListener('click', saveSalonName);
    dom.salonModalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveSalonName();
    });

    // Overlay click closes modals
    dom.modalOverlay.addEventListener('click', () => {
      closeCommentModal();
      closeHistoryModal();
      if (state.salonName && (state.discount === 20 || state.discount === 30)) {
        closeSalonModal();
        closeCartDrawer();
        closePaletteModal();
      }
    });
    dom.drawerCloseBtn.addEventListener('click', closeCartDrawer);

    // Floating cart bar click opens drawer
    dom.cartFloatingBar.addEventListener('click', openCartDrawer);

    // Comment events (Button in top banner + modal controls)
    if (dom.cartCommentBtn) dom.cartCommentBtn.addEventListener('click', openCommentModal);
    if (dom.cartCommentPreviewRow) {
      dom.cartCommentPreviewRow.addEventListener('click', (e) => {
        if (e.target !== dom.cartCommentClearBtn) openCommentModal();
      });
    }
    if (dom.cartCommentClearBtn) {
      dom.cartCommentClearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearComment();
      });
    }
    if (dom.btnSaveComment) dom.btnSaveComment.addEventListener('click', saveComment);
    if (dom.btnClearComment) dom.btnClearComment.addEventListener('click', clearComment);
    if (dom.btnCancelComment) dom.btnCancelComment.addEventListener('click', closeCommentModal);

    // Order History modal events
    if (dom.historyBtn) dom.historyBtn.addEventListener('click', openHistoryModal);
    if (dom.historyCloseBtn) dom.historyCloseBtn.addEventListener('click', closeHistoryModal);

    // Palette modal events
    dom.paletteCloseBtn.addEventListener('click', closePaletteModal);
    dom.btnSavePalette.addEventListener('click', () => {
      triggerHaptic('success');
      closePaletteModal();
    });

    if (dom.paletteSearchInput) {
      dom.paletteSearchInput.addEventListener('input', (e) => {
        state.paletteSearch = e.target.value;
        if (state.paletteSearch.length > 0) {
          dom.paletteClearSearchBtn.style.display = 'block';
        } else {
          dom.paletteClearSearchBtn.style.display = 'none';
        }
        renderShadesGrid();
      });
      dom.paletteClearSearchBtn.addEventListener('click', () => {
        dom.paletteSearchInput.value = '';
        state.paletteSearch = '';
        dom.paletteClearSearchBtn.style.display = 'none';
        renderShadesGrid();
      });
    }

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

    // Cart Clear & Send
    dom.btnClearCart.addEventListener('click', () => {
      if (confirm(state.lang === 'ru' ? 'Очистить корзину?' : 'Isprazniti korpu?')) {
        state.cart = {};
        state.shadesCart = {};
        state.comment = '';
        localStorage.removeItem('davines_cart');
        localStorage.removeItem('davines_shades_cart');
        localStorage.removeItem('davines_cart_comment');
        renderProducts();
        renderCartFloatingBar();
        renderCartDrawerContent();
        triggerHaptic('medium');
      }
    });

    dom.btnSendOrder.addEventListener('click', handleSendOrder);
    dom.btnCopyOrder.addEventListener('click', () => {
      const text = generateOrderPlainText();
      copyToClipboard(text);
      showToast(I18N[state.lang].orderCopied);
      triggerHaptic('light');
    });

    // Auto-prompt salon name & discount on first run if salon not yet entered
    if (!state.salonName) {
      setTimeout(() => openSalonModal(true), 400);
    }
  }

  // 18. App Init
  function init() {
    expandTelegramApp();
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
