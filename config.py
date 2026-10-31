# Configuration for Davines Telegram Bot
import os

# Telegram Bot Token from @BotFather
BOT_TOKEN = os.getenv("BOT_TOKEN", "9127736042:AAGHWTb70DEQY9WgJYppJxlqFamJ8XC24nU")

# Sales representative Telegram User ID or Group Chat ID where orders should be sent
# You can get your ID by messaging @userinfobot or @raw_data_bot on Telegram
MANAGER_CHAT_ID = os.getenv("MANAGER_CHAT_ID", "414194396")

# URL where the WebApp is hosted (e.g. GitHub Pages, Vercel, ngrok, or Cloudflare Pages)
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://ivansergeevich23.github.io/davines-shop/webapp/")

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), "davines_orders.db")
