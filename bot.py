#!/usr/bin/env python3
"""
Davines Serbia Telegram Bot & WebApp Order Receiver
Zero-dependency implementation using Python 3 standard library (urllib, json, sqlite3).
"""

import sys
import os
import json
import time
import sqlite3
import urllib.request
import urllib.parse
from datetime import datetime

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
    DB_PATH = "davines_orders.db"

TELEGRAM_API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

# 1. Database Initialization
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Salons table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS salons (
            chat_id INTEGER PRIMARY KEY,
            salon_name TEXT NOT NULL,
            username TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Orders table
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
    """, (chat_id, salon_name, user_fullname, username, total_items, total_price_mp, json.dumps(items_json), formatted_text))
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
import ssl

def get_ssl_context():
    try:
        ctx = ssl.create_default_context()
        return ctx
    except Exception:
        return ssl._create_unverified_context()

SSL_CONTEXT = ssl._create_unverified_context()

def tg_request(method, data=None):
    if not BOT_TOKEN or BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        return None
    url = f"{TELEGRAM_API_URL}/{method}"
    try:
        headers = {"User-Agent": "DavinesRSbot/1.0"}
        if data:
            headers["Content-Type"] = "application/json"
            req_data = json.dumps(data).encode("utf-8")
            req = urllib.request.Request(url, data=req_data, headers=headers)
        else:
            req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30, context=SSL_CONTEXT) as resp:
            res = resp.read()
            return json.loads(res.decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8', errors='replace')
        print(f"Telegram API HTTPError on {method}: {e.code} - {err_msg}", file=sys.stderr)
        return None
    except Exception as e:
        # Don't clutter logs on expected polling timeout
        if method != "getUpdates" or "timed out" not in str(e).lower():
            print(f"Telegram API Exception on {method}: {e}", file=sys.stderr)
        return None

def send_message(chat_id, text, reply_markup=None, parse_mode="HTML"):
    payload = {
        "chat_id": chat_id,
        "text": text
    }
    if parse_mode:
        payload["parse_mode"] = parse_mode
    if reply_markup:
        payload["reply_markup"] = reply_markup
    res = tg_request("sendMessage", payload)
    if not res or not res.get("ok"):
        # Auto-fallback to plain text if HTML/Markdown parsing failed
        if parse_mode:
            payload.pop("parse_mode", None)
            res = tg_request("sendMessage", payload)
    return res

# 3. Main Keyboard with WebApp button
def get_main_keyboard(salon_name=None):
    btn_text = "🛍 Otvori Davines katalog / Открыть каталог"
    
    keyboard = {
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
        "resize_keyboard": True
    }
    return keyboard

def get_inline_webapp_keyboard():
    return {
        "inline_keyboard": [
            [
                {
                    "text": "✨ Otvori katalog (Web App) ✨",
                    "web_app": {"url": WEBAPP_URL}
                }
            ]
        ]
    }

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
        # Auto-configure manager if not set
        global MANAGER_CHAT_ID
        if not MANAGER_CHAT_ID:
            MANAGER_CHAT_ID = str(chat_id)
            print(f"🌟 Automatically set MANAGER_CHAT_ID to {MANAGER_CHAT_ID} (from /start)")

        salon = get_salon_name(chat_id)
        greeting = (
            "🌿 *Добро пожаловать в Davines Сербия!*\n"
            "Бот для быстрого оформления заказов профессиональной продукции Davines.\n\n"
            "Нажмите кнопку ниже, чтобы открыть каталог, укажите название вашей студии/салона и выберите вашу персональную скидку (20% или 30%).\n\n"
            "──────────────────────\n\n"
            "🌿 *Dobrodošli u Davines Srbija!*\n"
            "Bot za brzo kreiranje porudžbina profesionalnih Davines proizvoda.\n\n"
            "Pritisnite dugme ispod da otvorite katalog, unesite naziv vašeg studija/salona i izaberite vaš personalni popust (20% ili 30%)."
        )
        if salon:
            greeting += f"\n\n💈 *Prijavljeni salon / Салон:* `{salon}`"

        if WEBAPP_URL and WEBAPP_URL.startswith("http"):
            send_message(chat_id, greeting, reply_markup=get_main_keyboard(salon))
        else:
            greeting += (
                "\n\nℹ️ *Vaš Telegram Chat ID:* `" + str(chat_id) + "`\n"
                "(Koristite ovaj ID za prijem porudžbina u `config.py`).\n\n"
                "⚠️ WebApp URL još uvek nije podešen na HTTPS adresu. "
                "Možete hostovati folder `webapp/` (npr. preko GitHub Pages ili Vercel) "
                "i uneti link u `config.py`."
            )
            send_message(chat_id, greeting)
        return

    # C) Command /salon and /reset
    if text.startswith("/reset"):
        # Reset in database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM salons WHERE chat_id = ?", (chat_id,))
        conn.commit()
        conn.close()

        reset_webapp_url = WEBAPP_URL + ("&" if "?" in WEBAPP_URL else "?") + "reset=1"
        reset_keyboard = {
            "inline_keyboard": [
                [
                    {
                        "text": "🔄 Сбросить салон и скидку / Resetuj",
                        "web_app": {"url": reset_webapp_url}
                    }
                ]
            ]
        }
        send_message(
            chat_id,
            "🔄 *Сброс данных салона и скидки:*\n\n"
            "Нажмите на кнопку ниже, чтобы заново указать название салона и выбрать скидку (20% или 30%):\n\n"
            "──────────────────────\n\n"
            "🔄 *Resetovanje podataka salona i popusta:*\n\n"
            "Pritisnite dugme ispod da ponovo unesete naziv vašeg salona i izaberete popust (20% ili 30%):",
            reply_markup=reset_keyboard
        )
        return

    if text.startswith("/salon") or "Promeni salon" in text or "Сменить салон" in text:
        send_message(
            chat_id,
            "ℹ️ Naziv salona i popust se unose prilikom prvog ulaska u katalog.\n"
            "Ako želite da resetujete i promenite podatke, pošaljite komandu /reset.\n\n"
            "ℹ️ Название студии/салона и скидка фиксируются при первом входе в каталог.\n"
            "Если вы хотите сбросить и ввести заново, отправьте команду /reset.",
            reply_markup=get_main_keyboard()
        )
        return

    # D) "Moje porudžbine" or /orders
    if text.startswith("/orders") or text == "📋 Moje porudžbine / Мои заказы":
        orders = get_recent_orders(chat_id, limit=5)
        if not orders:
            send_message(chat_id, "ℹ️ Još uvek nemate prethodnih porudžbina. Otvorite katalog da kreirate prvu!")
            return

        lines = ["📋 *Vaše poslednje porudžbine / Ваши последние заказы:*\n"]
        for o_id, s_name, t_items, t_price, c_at in orders:
            price_fmt = f"{int(round(t_price)):,} RSD".replace(",", ".")
            lines.append(f"• *Porudžbina #DV-{o_id:04d}* ({c_at[:16]})")
            lines.append(f"  Salon: `{s_name}` | {t_items} art. | *{price_fmt}*")
        
        send_message(chat_id, "\n".join(lines))
        return

    # E) Default fallback
    salon = get_salon_name(chat_id)
    send_message(
        chat_id,
        "🌿 Za kreiranje porudžbine otvorite Davines katalog pomoću dugmeta ispod 👇",
        reply_markup=get_main_keyboard(salon)
    )

# 5. Handle incoming WebApp Order payload
def handle_webapp_order(chat_id, user, user_fullname, username, raw_data):
    try:
        order_info = json.loads(raw_data)
    except Exception as e:
        print(f"Failed to parse WebApp JSON: {e}")
        send_message(chat_id, "⚠️ Greška pri obradi porudžbine. Molimo pokušajte ponovo.")
        return

    salon_name = order_info.get("salon_name") or get_salon_name(chat_id) or "Nije navedeno"
    save_salon_name(chat_id, salon_name, username)

    total_items = order_info.get("total_items", 0)
    total_price = order_info.get("total_price_mp", 0.0)
    items = order_info.get("items", [])
    formatted_text = order_info.get("formatted_text", "")

    # Save to database
    order_id = save_order(
        chat_id=chat_id,
        salon_name=salon_name,
        user_fullname=user_fullname,
        username=username,
        total_items=total_items,
        total_price_mp=total_price,
        items_json=items,
        formatted_text=formatted_text
    )

    order_num = f"#DV-{order_id:04d}"
    price_formatted = f"{int(round(total_price)):,} RSD".replace(",", ".")
    discount = order_info.get("discount", 20)

    # 1. Confirmation message to Client Salon
    confirmation_msg = (
        f"✅ *Porudžbina {order_num} je uspešno kreirana! / Заказ успешно оформлен!*\n\n"
        f"💈 *Salon:* {salon_name}\n"
        f"🏷 *Popust / Скидка:* {discount}%\n"
        f"📦 *Broj artikala:* {total_items} kom\n"
        f"💰 *Ukupan iznos:* *{price_formatted}* (sa popustom i PDV)\n\n"
        f"Vaša porudžbina je prosleđena prodajnom predstavniku Davinesa. Uskoro ćete biti kontaktirani radi potvrde isporuke. Hvala!"
    )
    send_message(chat_id, confirmation_msg)

    # 2. Notification to Sales Representative (MANAGER_CHAT_ID)
    if MANAGER_CHAT_ID and MANAGER_CHAT_ID != "YOUR_TELEGRAM_CHAT_ID_HERE":
        user_mention = f"@{username}" if username else user_fullname
        manager_notification = (
            f"🔔 *NOVA PORUDŽBINA {order_num} OD KLIJENTA!* 🔔\n\n"
            f"💈 *Salon:* `{salon_name}`\n"
            f"👤 *Naručilac:* {user_fullname} ({user_mention})\n"
            f"🆔 *Chat ID:* `{chat_id}`\n\n"
            f"-----------------------------------------\n"
            f"{formatted_text}\n"
            f"-----------------------------------------\n"
            f"Status: Novo • Spreman za obradu"
        )
        send_message(MANAGER_CHAT_ID, manager_notification)
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
        print("⚠️ BOT_TOKEN is not set yet in config.py!")
        print("Please obtain a token from @BotFather in Telegram and update config.py.")
        print("Waiting for configuration...")
        return

    # Verify bot identity
    me = tg_request("getMe")
    if not me or not me.get("ok"):
        print("❌ Failed to connect to Telegram with current BOT_TOKEN.")
        print("Please check your token in config.py.")
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
