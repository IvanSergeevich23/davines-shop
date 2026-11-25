# Configuration for Davines Telegram Bot
import os


def _load_dotenv(path):
    """Load key=value pairs from local .env file without external dependencies."""
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        for raw_line in f:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = val


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_load_dotenv(os.path.join(BASE_DIR, ".env"))

# Telegram Bot Token (stored only in local .env or environment variables — never commit!)
BOT_TOKEN = os.getenv("BOT_TOKEN", "")

# Sales representative Telegram User ID where orders should be sent
MANAGER_CHAT_ID = os.getenv("MANAGER_CHAT_ID", "414194396")

# URL where the WebApp is hosted
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://ivansergeevich23.github.io/davines-shop/webapp/")

# Database path
DB_PATH = os.path.join(BASE_DIR, "davines_orders.db")
