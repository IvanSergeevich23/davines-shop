#!/usr/bin/env python3
"""
Davines Serbia Telegram Bot & WebApp Order Receiver
Zero-dependency implementation using Python 3 standard library (urllib, json, sqlite3).
"""

import html as html_lib
import json
import os
import sqlite3
import ssl
import sys
import time
import urllib.error
import urllib.request

# Ensure unbuffered logging for background LaunchAgent logs
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(line_buffering=True)

# Import configuration
try:
    import config
    BOT_TOKEN = config.BOT_TOKEN
    MANAGER_CHAT_ID = config.MANAGER_CHAT_ID
    WEBAPP_URL = config.WEBAPP_URL
    DB_PATH = config.DB_PATH
except ImportError:
    BOT_TOKEN = os.getenv("BOT_TOKEN", "")
    MANAGER_CHAT_ID = os.getenv("MANAGER_CHAT_ID", "")
    WEBAPP_URL = os.getenv("WEBAPP_URL", "")
    DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "davines_orders.db")

TELEGRAM_API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"


# 1. Database Initialization
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS salons (
            chat_id INTEGER PRIMARY KEY,
            salon_name TEXT NOT NULL,
            username TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id INTEGER NOT NULL,
            salon_name TEXT NOT NULL,
            user_fullname TEXT,
            username TEXT,
            total_items INTEGER NOT NULL,
            total_price_mp REAL NOT NULL,
            items_json TEXT NOT NULL,
            formatted_text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def save_salon_name(chat_id, salon_name, username=None):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO salons (chat_id, salon_name, username, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(chat_id) DO UPDATE SET
            salon_name = excluded.salon_name,
            username = excluded.username,
            updated_at = CURRENT_TIMESTAMP
    """, (chat_id, salon_name, username))
    conn.commit()
    conn.close()


def get_salon_name(chat_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT salon_name FROM salons WHERE chat_id = ?", (chat_id,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else None


def save_order(chat_id, salon_name, user_fullname, username, total_items, total_price_mp, items_json, formatted_text):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO orders (chat_id, salon_name, user_fullname, username, total_items, total_price_mp, items_json, formatted_text)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (chat_id, salon_name, user_fullname, username, total_items, total_price_mp, json.dumps(items_json, ensure_ascii=False), formatted_text))
    order_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return order_id


def get_recent_orders(chat_id, limit=5):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, salon_name, total_items, total_price_mp, created_at
        FROM orders
        WHERE chat_id = ?
        ORDER BY id DESC
        LIMIT ?
    """, (chat_id, limit))
    rows = cursor.fetchall()
    conn.close()
    return rows


# 2. Telegram API HTTP Request Helper
def _build_ssl_context():
    try:
        return ssl.create_default_context()
    except Exception:
        return ssl._create_unverified_context()


SSL_CONTEXT = _build_ssl_context()


def tg_request(method, data=None):
    global SSL_CONTEXT
    if not BOT_TOKEN or BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        return None
    url = f"{TELEGRAM_API_URL}/{method}"
    try:
        headers = {"User-Agent": "DavinesRSbot/2.0"}
        if data is not None:
            headers["Content-Type"] = "application/json"
            req_data = json.dumps(data).encode("utf-8")
            req = urllib.request.Request(url, data=req_data, headers=headers)
        else:
            req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=35, context=SSL_CONTEXT) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8", errors="replace")
        print(f"Telegram API HTTPError on {method}: {e.code} - {err_msg}", file=sys.stderr)
        return None
    except ssl.SSLError:
        # Fallback for macOS python3 builds lacking CA bundle
        SSL_CONTEXT = ssl._create_unverified_context()
        return tg_request(method, data)
    except Exception as e:
        if method != "getUpdates" or "timed out" not in str(e).lower():
            print(f"Telegram API Exception on {method}: {e}", file=sys.stderr)
        return None


def send_message(chat_id, text, reply_markup=None, parse_mode="HTML"):
    payload = {
        "chat_id": chat_id,
        "text": text,
    }
    if parse_mode:
        payload["parse_mode"] = parse_mode
    if reply_markup:
        payload["reply_markup"] = reply_markup
    res = tg_request("sendMessage", payload)
    if not res or not res.get("ok"):
        if parse_mode:
            payload.pop("parse_mode", None)
            res = tg_request("sendMessage", payload)
    return res


# 3. Main Keyboard with WebApp button (supports tg.sendData natively!)
def get_main_keyboard(salon_name=None):
    btn_text = "🛍 Otvori Davines katalog / Открыть каталог"
    return {
        "keyboard": [
            [
                {
                    "text": btn_text,
                    "web_app": {"url": WEBAPP_URL}
                }
            ],
            [
                {"text": "📋 Moje porudžbine / Мои заказы"}
            ]
        ],
        "resize_keyboard": True,
        "is_persistent": True
    }


def format_manager_order_html(salon_name, user_id, user_fullname, username, discount, total_price, items, comment=""):
    esc = html_lib.escape
    header = f"<b>{esc(salon_name or 'Nije navedeno')}</b>"
    display_name = esc(user_fullname or username or "")
    if username:
        clean_un = username.lstrip("@")
        header += f' ("{display_name}" <a href="https://t.me/{esc(clean_un)}">@{esc(clean_un)}</a>)'
    elif user_id and display_name:
        header += f' (<a href="tg://user?id={user_id}">"{display_name}"</a>)'
    elif display_name:
        header += f' ("{display_name}")'

    lines = [header, ""]
    for idx, it in enumerate(items, start=1):
        code = str(it.get("c") or it.get("code") or "").strip()
        name = str(it.get("n") or it.get("name") or "").strip()
        vol = str(it.get("v") or it.get("volume") or "").strip()
        qty = it.get("q") if "q" in it else it.get("qty", 1)
        is_shade = bool(it.get("s")) or (
            "-" in code and any(k in code for k in ("MASK_VIBRACHROM", "VIEW_COLOR", "THE_PRESENT_TIME"))
        )

        if is_shade:
            item_title = esc(name)
        else:
            vol_part = f" {vol}" if (vol and vol.lower() not in name.lower()) else ""
            item_title = f"({esc(code)}) {esc(name)}{esc(vol_part)}" if code else f"{esc(name)}{esc(vol_part)}"

        lines.append(f"{idx}. {item_title} — {qty} шт")

    if comment:
        lines.append("")
        lines.append(f"💬 <b>Комментарий:</b> {esc(comment)}")

    price_formatted = f"{int(round(total_price)):,} RSD".replace(",", ".")
    lines.append("")
    lines.append(f"💰 <b>Итого со скидкой ({discount}%):</b> {price_formatted}")
    return "\n".join(lines)


# 4. Message Handlers
def handle_message(msg):
    chat_id = msg.get("chat", {}).get("id")
    user = msg.get("from", {})
    text = (msg.get("text") or "").strip()
    user_fullname = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
    username = user.get("username", "")

    # A) Check if message contains WebApp data (Order submitted from WebApp!)
    web_app_data = msg.get("web_app_data")
    if web_app_data:
        raw_data = web_app_data.get("data", "")
        handle_webapp_order(chat_id, user, user_fullname, username, raw_data)
        return

    # B) Command /start
    if text.startswith("/start"):
        global MANAGER_CHAT_ID
        if not MANAGER_CHAT_ID:
            MANAGER_CHAT_ID = str(chat_id)
            print(f"Automatically set MANAGER_CHAT_ID to {MANAGER_CHAT_ID} (from /start)")

        salon = get_salon_name(chat_id)
        greeting = (
            "🌿 <b>Добро пожаловать в Davines Сербия!</b>\n"
            "Бот для быстрого оформления заказов профессиональной продукции Davines.\n\n"
            "Нажмите кнопку <b>«🛍 Otvori Davines katalog / Открыть каталог»</b> внизу, чтобы открыть каталог, "
            "укажите название вашей студии/салона и выберите вашу персональную скидку (20% или 30%).\n\n"
            "──────────────────────\n\n"
            "🌿 <b>Dobrodošli u Davines Srbija!</b>\n"
            "Bot za brzo kreiranje porudžbina profesionalnih Davines proizvoda.\n\n"
            "Pritisnite dugme ispod da otvorite katalog, unesite naziv vašeg studija/salona i izaberite vaš personalni popust (20% ili 30%)."
        )
        if salon:
            greeting += f"\n\n💈 <b>Prijavljeni salon / Салон:</b> <code>{html_lib.escape(salon)}</code>"

        if WEBAPP_URL and WEBAPP_URL.startswith("http"):
            send_message(chat_id, greeting, reply_markup=get_main_keyboard(salon), parse_mode="HTML")
        else:
            send_message(chat_id, greeting + "\n\n⚠️ WebApp URL не настроен.", parse_mode="HTML")
        return

    # C) Command /reset
    if text.startswith("/reset"):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM salons WHERE chat_id = ?", (chat_id,))
        conn.commit()
        conn.close()

        reset_webapp_url = WEBAPP_URL + ("&" if "?" in WEBAPP_URL else "?") + "reset=1"
        reset_keyboard = {
            "keyboard": [
                [
                    {
                        "text": "🔄 Сбросить салон и скидку / Resetuj",
                        "web_app": {"url": reset_webapp_url}
                    }
                ],
                [
                    {"text": "🛍 Otvori Davines katalog / Открыть каталог", "web_app": {"url": WEBAPP_URL}}
                ]
            ],
            "resize_keyboard": True,
            "is_persistent": True
        }
        send_message(
            chat_id,
            "🔄 <b>Сброс данных салона и скидки:</b>\n\n"
            "Нажмите на кнопку «🔄 Сбросить салон и скидку» внизу, чтобы заново указать название салона и выбрать скидку (20% или 30%):\n\n"
            "──────────────────────\n\n"
            "🔄 <b>Resetovanje podataka salona i popusta:</b>\n\n"
            "Pritisnite dugme ispod da ponovo unesete naziv vašeg salona i izaberete popust (20% ili 30%):",
            reply_markup=reset_keyboard,
            parse_mode="HTML"
        )
        return

    if text.startswith("/salon") or "Promeni salon" in text or "Сменить салон" in text:
        send_message(
            chat_id,
            "ℹ️ Naziv salona i popust se unose prilikom prvog ulaska u katalog.\n"
            "Ako želite da resetujete i promenite podatke, pošaljite komandu /reset.\n\n"
            "ℹ️ Название студии/салона и скидка фиксируются при первом входе в каталог.\n"
            "Если вы хотите сбросить и ввести заново, отправьте команду /reset.",
            reply_markup=get_main_keyboard(),
            parse_mode="HTML"
        )
        return

    # D) "Moje porudžbine" or /orders
    if text.startswith("/orders") or text == "📋 Moje porudžbine / Мои заказы":
        orders = get_recent_orders(chat_id, limit=5)
        if not orders:
            send_message(
                chat_id,
                "ℹ️ <b>У вас пока нет оформленных заказов.</b>\n"
                "Нажмите кнопку «🛍 Otvori Davines katalog / Открыть каталог» внизу, чтобы сделать первый заказ!\n\n"
                "──────────────────────\n\n"
                "ℹ️ <b>Još uvek nemate prethodnih porudžbina.</b>\n"
                "Pritisnite dugme ispod da otvorite katalog i kreirate prvu porudžbinu!",
                reply_markup=get_main_keyboard(get_salon_name(chat_id)),
                parse_mode="HTML"
            )
            return

        lines = ["📋 <b>Ваши последние заказы / Vaše poslednje porudžbine:</b>\n"]
        for o_id, s_name, t_items, t_price, c_at in orders:
            price_fmt = f"{int(round(t_price)):,} RSD".replace(",", ".")
            dt_str = c_at[:16] if c_at else ""
            lines.append(f"• <b>Заказ #DV-{o_id:04d}</b> ({dt_str})")
            lines.append(f"  Салон: <code>{html_lib.escape(s_name)}</code> | {t_items} шт. | <b>{price_fmt}</b>\n")

        send_message(chat_id, "\n".join(lines), reply_markup=get_main_keyboard(get_salon_name(chat_id)), parse_mode="HTML")
        return

    # E) /all_orders (for Sales Representative)
    if text.startswith("/all_orders") and str(chat_id) == str(MANAGER_CHAT_ID):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, salon_name, user_fullname, username, total_items, total_price_mp, created_at FROM orders ORDER BY id DESC LIMIT 15")
        all_orders = cursor.fetchall()
        conn.close()
        if not all_orders:
            send_message(chat_id, "ℹ️ В базе пока нет заказов.")
            return
        lines = ["📊 <b>Все последние заказы салонов:</b>\n"]
        for o_id, s_name, u_full, u_name, t_items, t_price, c_at in all_orders:
            price_fmt = f"{int(round(t_price)):,} RSD".replace(",", ".")
            u_mention = f"@{u_name}" if u_name else (u_full or "")
            lines.append(f"• <b>#DV-{o_id:04d}</b> {html_lib.escape(s_name)} ({html_lib.escape(u_mention)})")
            lines.append(f"  {t_items} шт. | <b>{price_fmt}</b> | {c_at[:16]}\n")
        send_message(chat_id, "\n".join(lines), parse_mode="HTML")
        return

    # F) Default fallback
    salon = get_salon_name(chat_id)
    send_message(
        chat_id,
        "🌿 Чтобы открыть каталог и оформить заказ, нажмите кнопку внизу 👇\n"
        "Za kreiranje porudžbine otvorite Davines katalog pomoću dugmeta ispod 👇",
        reply_markup=get_main_keyboard(salon),
        parse_mode="HTML"
    )


# 5. Handle incoming WebApp Order payload
def handle_webapp_order(chat_id, user, user_fullname, username, raw_data):
    try:
        order_info = json.loads(raw_data)
    except Exception as e:
        print(f"Failed to parse WebApp JSON: {e}", file=sys.stderr)
        send_message(chat_id, "⚠️ Greška pri obradi porudžbine. Molimo pokušajte ponovo.")
        return

    salon_name = order_info.get("salon_name") or get_salon_name(chat_id) or "Nije navedeno"
    save_salon_name(chat_id, salon_name, username)

    total_items = order_info.get("total_items", 0)
    total_price = order_info.get("total_price_mp", 0.0)
    items = order_info.get("items", [])
    comment = (order_info.get("comment") or "").strip()
    discount = order_info.get("discount", 20)

    manager_notification = format_manager_order_html(
        salon_name=salon_name,
        user_id=user.get("id") or chat_id,
        user_fullname=user_fullname,
        username=username,
        discount=discount,
        total_price=total_price,
        items=items,
        comment=comment
    )

    # Save to database
    order_id = save_order(
        chat_id=chat_id,
        salon_name=salon_name,
        user_fullname=user_fullname,
        username=username,
        total_items=total_items,
        total_price_mp=total_price,
        items_json=items,
        formatted_text=manager_notification
    )

    order_num = f"#DV-{order_id:04d}"
    price_formatted = f"{int(round(total_price)):,} RSD".replace(",", ".")

    # 1. Confirmation message to Client Salon
    confirmation_msg = (
        f"✅ <b>Заказ успешно отправлен! / Porudžbina je poslata!</b>\n\n"
        f"💈 <b>Салон / Salon:</b> {html_lib.escape(salon_name)} (-{discount}%)\n"
        f"📦 <b>Позиций / Artikala:</b> {total_items} шт / kom\n"
        f"💰 <b>Итого / Ukupno:</b> <b>{price_formatted}</b>"
    )
    send_message(chat_id, confirmation_msg, reply_markup=get_main_keyboard(salon_name), parse_mode="HTML")

    # 2. Notification to Sales Representative (MANAGER_CHAT_ID)
    if MANAGER_CHAT_ID and MANAGER_CHAT_ID != "YOUR_TELEGRAM_CHAT_ID_HERE":
        send_message(MANAGER_CHAT_ID, manager_notification, parse_mode="HTML")
        print(f"Successfully delivered order {order_num} to manager ({MANAGER_CHAT_ID})")
    else:
        print(f"Notice: MANAGER_CHAT_ID is not configured. Order {order_num} saved to database.")


# 6. Long Polling Loop
def start_polling():
    init_db()
    print("=" * 60)
    print("🌿 Davines Serbia Telegram Bot started!")
    print(f"📊 SQLite DB: {DB_PATH}")
    print(f"🌐 WebApp URL: {WEBAPP_URL}")
    print(f"👤 Manager Chat ID: {MANAGER_CHAT_ID}")
    print("=" * 60)

    if not BOT_TOKEN or BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        print("⚠️ BOT_TOKEN is not set! Create .env or set BOT_TOKEN env var.")
        return

    # Clear webhook if any so polling works cleanly
    tg_request("deleteWebhook", {"drop_pending_updates": False})

    # Verify bot identity
    me = tg_request("getMe")
    if not me or not me.get("ok"):
        print("❌ Failed to connect to Telegram with current BOT_TOKEN.", file=sys.stderr)
        return

    bot_info = me.get("result", {})
    print(f"✅ Authenticated as @{bot_info.get('username')} ({bot_info.get('first_name')})")
    print("Listening for updates...")

    offset = 0
    while True:
        try:
            updates = tg_request("getUpdates", {"offset": offset, "timeout": 25})
            if updates and updates.get("ok"):
                for upd in updates.get("result", []):
                    offset = max(offset, upd.get("update_id", 0) + 1)
                    if "message" in upd:
                        handle_message(upd["message"])
            time.sleep(0.5)
        except KeyboardInterrupt:
            print("\nBot stopped.")
            break
        except Exception as e:
            print(f"Polling error: {e}", file=sys.stderr)
            time.sleep(3)


if __name__ == "__main__":
    start_polling()
