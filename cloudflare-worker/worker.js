/**
 * Davines Serbia — 24/7 Telegram Bot & WebApp Order Proxy (Cloudflare Worker)
 * Handles:
 *  - POST /webhook : Telegram Bot API updates (/start, /orders, /reset, /all_orders, web_app_data)
 *  - POST /order   : Direct verified Mini App orders (Menu Button / Inline launches)
 *  - GET  /health  : Health check
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMoneyRsd(amount) {
  const num = Math.round(Number(amount) || 0);
  return `${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} RSD`;
}

async function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const enc = new TextEncoder();
  const [da, db] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const va = new Uint8Array(da);
  const vb = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < va.length; i++) {
    diff |= va[i] ^ vb[i];
  }
  return diff === 0;
}

/**
 * Verify Telegram WebApp initData HMAC-SHA256 signature and extract user.
 * Returns parsed user object (or null if invalid).
 */
async function verifyTelegramInitData(initData, botToken) {
  if (!initData || !botToken) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;

  params.delete("hash");
  const pairs = [];
  for (const [k, v] of params.entries()) {
    pairs.push([k, v]);
  }
  pairs.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const dataCheckString = pairs.map(([k, v]) => `${k}=${v}`).join("\n");

  const enc = new TextEncoder();
  const webAppKey = await crypto.subtle.importKey(
    "raw",
    enc.encode("WebAppData"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const secretKeyBytes = await crypto.subtle.sign("HMAC", webAppKey, enc.encode(botToken));
  const secretKey = await crypto.subtle.importKey(
    "raw",
    secretKeyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBytes = await crypto.subtle.sign("HMAC", secretKey, enc.encode(dataCheckString));
  const computedHex = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (!(await constantTimeEqual(computedHex, hash))) {
    return null;
  }

  // Reject stale initData older than 7 days
  const authDate = parseInt(params.get("auth_date") || "0", 10);
  const nowSec = Math.floor(Date.now() / 1000);
  if (authDate > 0 && nowSec - authDate > 7 * 86400) {
    return null;
  }

  try {
    const userRaw = params.get("user");
    return userRaw ? JSON.parse(userRaw) : {};
  } catch {
    return {};
  }
}

async function tgApi(botToken, method, payload) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

async function sendMessage(botToken, chatId, text, replyMarkup = null, parseMode = "HTML") {
  const payload = { chat_id: chatId, text };
  if (parseMode) payload.parse_mode = parseMode;
  if (replyMarkup) payload.reply_markup = replyMarkup;

  let res = await tgApi(botToken, "sendMessage", payload);
  if ((!res || !res.ok) && parseMode) {
    delete payload.parse_mode;
    res = await tgApi(botToken, "sendMessage", payload);
  }
  return res;
}

function getMainKeyboard(webappUrl) {
  return {
    keyboard: [
      [
        {
          text: "🛍 Otvori Davines katalog / Открыть каталог",
          web_app: { url: webappUrl },
        },
      ],
      [{ text: "📋 Moje porudžbine / Мои заказы" }],
    ],
    resize_keyboard: true,
    is_persistent: true,
  };
}

function formatManagerOrderHtml({ salonName, userId, userFullname, username, discount, totalPrice, items, comment }) {
  let header = `<b>${escapeHtml(salonName || "Nije navedeno")}</b>`;
  const displayName = escapeHtml(userFullname || username || "");

  if (username) {
    const cleanUn = String(username).replace(/^@/, "");
    header += ` ("${displayName}" <a href="https://t.me/${escapeHtml(cleanUn)}">@${escapeHtml(cleanUn)}</a>)`;
  } else if (userId && displayName) {
    header += ` (<a href="tg://user?id=${escapeHtml(userId)}">"${displayName}"</a>)`;
  } else if (displayName) {
    header += ` ("${displayName}")`;
  }

  const lines = [header, ""];
  (items || []).forEach((it, idx) => {
    const code = String(it.c || it.code || "").trim();
    const name = String(it.n || it.name || "").trim();
    const vol = String(it.v || it.volume || "").trim();
    const qty = it.q !== undefined ? it.q : it.qty || 1;
    const isShade =
      Boolean(it.s) ||
      (code.includes("-") &&
        (code.includes("MASK_VIBRACHROM") || code.includes("VIEW_COLOR") || code.includes("THE_PRESENT_TIME")));

    let itemTitle = "";
    if (isShade) {
      itemTitle = escapeHtml(name);
    } else {
      const volPart = vol && !name.toLowerCase().includes(vol.toLowerCase()) ? ` ${vol}` : "";
      itemTitle = code
        ? `(${escapeHtml(code)}) ${escapeHtml(name)}${escapeHtml(volPart)}`
        : `${escapeHtml(name)}${escapeHtml(volPart)}`;
    }
    lines.push(`${idx + 1}. ${itemTitle} — ${qty} шт`);
  });

  if (comment) {
    lines.push("");
    lines.push(`💬 <b>Комментарий:</b> ${escapeHtml(comment)}`);
  }

  lines.push("");
  lines.push(`💰 <b>Итого со скидкой (${discount}%):</b> ${formatMoneyRsd(totalPrice)}`);
  return lines.join("\n");
}

async function kvGetJson(kv, key, fallback = null) {
  if (!kv) return fallback;
  try {
    const val = await kv.get(key, "json");
    return val ?? fallback;
  } catch {
    return fallback;
  }
}

async function persistOrderAndSalon(env, record) {
  if (!env.DAVINES_KV) return 1;
  const kv = env.DAVINES_KV;

  await kv.put(
    `salon:${record.chatId}`,
    JSON.stringify({
      salonName: record.salonName,
      username: record.username || "",
      updatedAt: record.createdAt,
    })
  );

  // Maintain sequential order counter & recent lists
  const prevCounter = parseInt((await kv.get("counter:orders")) || "0", 10) || 0;
  const nextId = prevCounter + 1;
  record.id = nextId;
  await kv.put("counter:orders", String(nextId));

  const userOrdersKey = `orders:${record.chatId}`;
  const userOrders = (await kvGetJson(kv, userOrdersKey, [])) || [];
  userOrders.unshift(record);
  await kv.put(userOrdersKey, JSON.stringify(userOrders.slice(0, 15)));

  const allOrders = (await kvGetJson(kv, "orders:all", [])) || [];
  allOrders.unshift(record);
  await kv.put("orders:all", JSON.stringify(allOrders.slice(0, 30)));

  return nextId;
}

async function processOrder(env, ctx, { chatId, user, orderInfo, sendKeyboardOnConfirm }) {
  const userFullname = [user?.first_name || "", user?.last_name || ""].filter(Boolean).join(" ").trim();
  const username = user?.username || "";
  const savedSalon = await kvGetJson(env.DAVINES_KV, `salon:${chatId}`, null);
  const salonName = (orderInfo.salon_name || savedSalon?.salonName || "Nije navedeno").trim();

  const totalItems = Number(orderInfo.total_items || 0);
  const totalPrice = Number(orderInfo.total_price_mp || 0);
  const items = Array.isArray(orderInfo.items) ? orderInfo.items : [];
  const comment = String(orderInfo.comment || "").trim();
  const discount = Number(orderInfo.discount || 20);

  if (totalItems <= 0 || items.length === 0) {
    return { ok: false, error: "empty_order" };
  }

  const managerNotification = formatManagerOrderHtml({
    salonName,
    userId: user?.id || chatId,
    userFullname,
    username,
    discount,
    totalPrice,
    items,
    comment,
  });

  // 1. Send full order directly to Ivan (MANAGER_CHAT_ID)
  if (env.MANAGER_CHAT_ID) {
    await sendMessage(env.BOT_TOKEN, env.MANAGER_CHAT_ID, managerNotification, null, "HTML");
  }

  // 2. Send clean confirmation to client chat
  if (chatId && (!sendKeyboardOnConfirm || String(chatId) !== String(env.MANAGER_CHAT_ID) || sendKeyboardOnConfirm)) {
    const confirmationMsg =
      `✅ <b>Заказ успешно отправлен! / Porudžbina je poslata!</b>\n\n` +
      `💈 <b>Салон / Salon:</b> ${escapeHtml(salonName)} (-${discount}%)\n` +
      `📦 <b>Позиций / Artikala:</b> ${totalItems} шт / kom\n` +
      `💰 <b>Итого / Ukupno:</b> <b>${formatMoneyRsd(totalPrice)}</b>`;

    const shouldSendClientMsg = sendKeyboardOnConfirm || String(chatId) !== String(env.MANAGER_CHAT_ID);
    if (shouldSendClientMsg) {
      await sendMessage(
        env.BOT_TOKEN,
        chatId,
        confirmationMsg,
        sendKeyboardOnConfirm ? getMainKeyboard(env.WEBAPP_URL) : null,
        "HTML"
      );
    }
  }

  // 3. Persist order in KV asynchronously
  const record = {
    id: 0,
    chatId,
    salonName,
    userFullname,
    username,
    discount,
    totalItems,
    totalPrice,
    comment,
    createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
  };
  ctx.waitUntil(persistOrderAndSalon(env, record));

  console.log(JSON.stringify({ event: "order_delivered", salonName, totalItems, totalPrice, chatId }));
  return { ok: true };
}

async function handleTelegramMessage(env, ctx, msg) {
  const chatId = msg?.chat?.id;
  if (!chatId) return;

  const user = msg.from || {};
  const text = (msg.text || "").trim();

  // A) WebApp data submitted via Reply Keyboard
  if (msg.web_app_data?.data) {
    let orderInfo = null;
    try {
      orderInfo = JSON.parse(msg.web_app_data.data);
    } catch {
      await sendMessage(env.BOT_TOKEN, chatId, "⚠️ Greška pri obradi porudžbine. Pokušajte ponovo.");
      return;
    }
    await processOrder(env, ctx, {
      chatId,
      user,
      orderInfo,
      sendKeyboardOnConfirm: true,
    });
    return;
  }

  // B) /start
  if (text.startsWith("/start")) {
    const savedSalon = await kvGetJson(env.DAVINES_KV, `salon:${chatId}`, null);
    let greeting =
      "🌿 <b>Добро пожаловать в Davines Сербия!</b>\n" +
      "Бот для быстрого оформления заказов профессиональной продукции Davines.\n\n" +
      "Нажмите кнопку <b>«🛍 Otvori Davines katalog / Открыть каталог»</b> внизу или кнопку меню слева, " +
      "укажите название вашей студии/салона и выберите вашу персональную скидку (20% или 30%).\n\n" +
      "──────────────────────\n\n" +
      "🌿 <b>Dobrodošli u Davines Srbija!</b>\n" +
      "Bot za brzo kreiranje porudžbina profesionalnih Davines proizvoda.\n\n" +
      "Pritisnite dugme ispod da otvorite katalog, unesite naziv vašeg studija/salona i izaberite vaš personalni popust (20% ili 30%).";

    if (savedSalon?.salonName) {
      greeting += `\n\n💈 <b>Prijavljeni salon / Салон:</b> <code>${escapeHtml(savedSalon.salonName)}</code>`;
    }

    await sendMessage(env.BOT_TOKEN, chatId, greeting, getMainKeyboard(env.WEBAPP_URL), "HTML");
    return;
  }

  // C) /reset
  if (text.startsWith("/reset")) {
    if (env.DAVINES_KV) {
      ctx.waitUntil(env.DAVINES_KV.delete(`salon:${chatId}`));
    }
    const sep = env.WEBAPP_URL.includes("?") ? "&" : "?";
    const resetUrl = `${env.WEBAPP_URL}${sep}reset=1`;
    const resetKeyboard = {
      keyboard: [
        [{ text: "🔄 Сбросить салон и скидку / Resetuj", web_app: { url: resetUrl } }],
        [{ text: "🛍 Otvori Davines katalog / Открыть каталог", web_app: { url: env.WEBAPP_URL } }],
      ],
      resize_keyboard: true,
      is_persistent: true,
    };

    await sendMessage(
      env.BOT_TOKEN,
      chatId,
      "🔄 <b>Сброс данных салона и скидки:</b>\n\n" +
        "Нажмите кнопку «🔄 Сбросить салон и скидку» внизу, чтобы заново указать название салона и выбрать скидку (20% или 30%):\n\n" +
        "──────────────────────\n\n" +
        "🔄 <b>Resetovanje podataka salona i popusta:</b>\n\n" +
        "Pritisnite dugme ispod da ponovo unesete naziv vašeg salona i izaberete popust (20% ili 30%):",
      resetKeyboard,
      "HTML"
    );
    return;
  }

  // D) /salon
  if (text.startsWith("/salon") || text.includes("Promeni salon") || text.includes("Сменить салон")) {
    await sendMessage(
      env.BOT_TOKEN,
      chatId,
      "ℹ️ Naziv salona i popust se unose prilikom prvog ulaska u katalog.\n" +
        "Ako želite da resetujete i promenite podatke, pošaljite komandu /reset.\n\n" +
        "ℹ️ Название студии/салона и скидка фиксируются при первом входе в каталог.\n" +
        "Если вы хотите сбросить и ввести заново, отправьте команду /reset.",
      getMainKeyboard(env.WEBAPP_URL),
      "HTML"
    );
    return;
  }

  // E) /orders
  if (text.startsWith("/orders") || text === "📋 Moje porudžbine / Мои заказы") {
    const orders = (await kvGetJson(env.DAVINES_KV, `orders:${chatId}`, [])) || [];
    if (orders.length === 0) {
      await sendMessage(
        env.BOT_TOKEN,
        chatId,
        "ℹ️ <b>У вас пока нет оформленных заказов.</b>\n" +
          "Нажмите кнопку «🛍 Otvori Davines katalog / Открыть каталог» внизу, чтобы сделать первый заказ!\n\n" +
          "──────────────────────\n\n" +
          "ℹ️ <b>Još uvek nemate prethodnih porudžbina.</b>\n" +
          "Pritisnite dugme ispod da otvorite katalog i kreirate prvu porudžbinu!",
        getMainKeyboard(env.WEBAPP_URL),
        "HTML"
      );
      return;
    }

    const lines = ["📋 <b>Ваши последние заказы / Vaše poslednje porudžbine:</b>\n"];
    for (const o of orders.slice(0, 5)) {
      const idNum = String(o.id || 0).padStart(4, "0");
      lines.push(`• <b>Заказ #DV-${idNum}</b> (${escapeHtml(o.createdAt || "")})`);
      lines.push(
        `  Салон: <code>${escapeHtml(o.salonName)}</code> | ${o.totalItems} шт. | <b>${formatMoneyRsd(o.totalPrice)}</b>\n`
      );
    }
    await sendMessage(env.BOT_TOKEN, chatId, lines.join("\n"), getMainKeyboard(env.WEBAPP_URL), "HTML");
    return;
  }

  // F) /all_orders (Manager only)
  if (text.startsWith("/all_orders") && String(chatId) === String(env.MANAGER_CHAT_ID)) {
    const allOrders = (await kvGetJson(env.DAVINES_KV, "orders:all", [])) || [];
    if (allOrders.length === 0) {
      await sendMessage(env.BOT_TOKEN, chatId, "ℹ️ В облачной базе пока нет заказов.");
      return;
    }
    const lines = ["📊 <b>Все последние заказы салонов:</b>\n"];
    for (const o of allOrders.slice(0, 15)) {
      const idNum = String(o.id || 0).padStart(4, "0");
      const mention = o.username ? `@${o.username}` : o.userFullname || "";
      lines.push(`• <b>#DV-${idNum}</b> ${escapeHtml(o.salonName)} (${escapeHtml(mention)})`);
      lines.push(`  ${o.totalItems} шт. | <b>${formatMoneyRsd(o.totalPrice)}</b> | ${escapeHtml(o.createdAt || "")}\n`);
    }
    await sendMessage(env.BOT_TOKEN, chatId, lines.join("\n"), null, "HTML");
    return;
  }

  // G) Fallback
  await sendMessage(
    env.BOT_TOKEN,
    chatId,
    "🌿 Чтобы открыть каталог и оформить заказ, нажмите кнопку внизу 👇\n" +
      "Za kreiranje porudžbine otvorite Davines katalog pomoću dugmeta ispod 👇",
    getMainKeyboard(env.WEBAPP_URL),
    "HTML"
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
      return jsonResponse({ ok: true, service: "davines-shop-bot" });
    }

    // Direct WebApp Order endpoint (used when launched from Menu Button / Inline button)
    if (request.method === "POST" && url.pathname === "/order") {
      try {
        const body = await request.json();
        const user = await verifyTelegramInitData(body?.initData, env.BOT_TOKEN);
        if (!user || !user.id) {
          return jsonResponse({ ok: false, error: "invalid_telegram_auth" }, 403);
        }

        const orderInfo = body?.orderPayload;
        if (!orderInfo || orderInfo.action !== "davines_order") {
          return jsonResponse({ ok: false, error: "invalid_payload" }, 400);
        }

        const result = await processOrder(env, ctx, {
          chatId: user.id,
          user,
          orderInfo,
          sendKeyboardOnConfirm: false,
        });

        if (!result.ok) {
          return jsonResponse(result, 400);
        }
        return jsonResponse({ ok: true });
      } catch (err) {
        console.error(JSON.stringify({ event: "order_error", error: err?.message || String(err) }));
        return jsonResponse({ ok: false, error: "server_error" }, 500);
      }
    }

    // Telegram Bot Webhook endpoint
    if (request.method === "POST" && url.pathname === "/webhook") {
      const secretHeader = request.headers.get("X-Telegram-Bot-Api-Secret-Token") || "";
      if (!env.WEBHOOK_SECRET || !(await constantTimeEqual(secretHeader, env.WEBHOOK_SECRET))) {
        return jsonResponse({ ok: false, error: "unauthorized" }, 401);
      }

      try {
        const update = await request.json();
        if (update?.message) {
          await handleTelegramMessage(env, ctx, update.message);
        }
        return jsonResponse({ ok: true });
      } catch (err) {
        console.error(JSON.stringify({ event: "webhook_error", error: err?.message || String(err) }));
        return jsonResponse({ ok: true });
      }
    }

    return jsonResponse({ ok: false, error: "not_found" }, 404);
  },
};
