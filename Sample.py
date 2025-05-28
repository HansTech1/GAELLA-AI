cat > bot.py << 'EOF'
"""
anime_bot.py
A fully functional Telegram bot for free anime downloads, details, info, top rankings.
Dependencies: python-telegram-bot, jikanpy, darksadasyt_anime (or equivalent downloader)
"""

import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.constants import ChatAction
from telegram.ext import Updater, CommandHandler, CallbackQueryHandler, CallbackContext

# Unofficial MyAnimeList API wrapper
from jikanpy import Jikan
# Anime downloader client (ensure installed)
from darksadasyt_anime import AnimeClient

# Initialize API clients
database_api = Jikan()
download_client = AnimeClient()

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# -- Command handlers --
def start(update: Update, context: CallbackContext):
    """Send a welcome message and list available commands."""
    welcome_text = (
        "Salut! 😊 Je suis ton bot d'anime pleinement fonctionnel.\n"
        "Voici les commandes disponibles :\n"
        "/search <nom> - Rechercher un anime\n"
        "/details <id> - Voir les détails d'un anime\n"
        "/download <id> <épisode> - Télécharger un épisode\n"
        "/top [n] - Top n anime (par défaut 50)\n"
        "/ranking - Top 10 trending\n"
    )
    update.message.reply_text(welcome_text)


def search(update: Update, context: CallbackContext):
    """Search anime by keyword and display top 5 results with inline buttons."""
    query = ' '.join(context.args)
    if not query:
        update.message.reply_text("Usage: /search <nom de l'anime>")
        return
    update.message.chat.send_action(ChatAction.TYPING)
    try:
        response = database_api.search('anime', query)
        results = response['results'][:5]
        buttons = [[InlineKeyboardButton(f"{anime['title']} ({anime['mal_id']})", callback_data=f"details_{anime['mal_id']}")] for anime in results]
        update.message.reply_text(f"Recherche: {query}", reply_markup=InlineKeyboardMarkup(buttons))
    except Exception as e:
        logger.error(e)
        update.message.reply_text("Erreur lors de la recherche.")


def send_details(query, anime_id: int):
    """Fetch and send detailed anime info via callback query."""
    query.message.chat.send_action(ChatAction.TYPING)
    try:
        data = database_api.anime(anime_id)
        info = (
            f"*{data['title']}* (ID: {anime_id})\n"
            f"Score: {data.get('score')} | Episodes: {data.get('episodes')} | Status: {data.get('status')}\n"
            f"Type: {data.get('type')} | Airing: {data.get('aired', {}).get('string')}\n\n"
            f"{data.get('synopsis', 'Pas de synopsis.')[:500]}...\n\n"
            f"Plus d'infos: {data.get('url')}"
        )
        query.message.reply_markdown(info)
    except Exception as e:
        logger.error(e)
        query.message.reply_text("Impossible de récupérer les détails.")


def download(update: Update, context: CallbackContext):
    """Download a specific episode via AnimeClient and send links."""
    args = context.args
    if len(args) < 2:
        update.message.reply_text("Usage: /download <anime_id> <episode>")
        return
    anime_id, episode = args[0], args[1]
    update.message.chat.send_action(ChatAction.TYPING)
    try:
        links = download_client.get_download_links(int(anime_id), int(episode))
        buttons = [[InlineKeyboardButton(f"Link {i+1}", url=link)] for i, link in enumerate(links)]
        update.message.reply_text(f"Téléchargements pour {anime_id} épisode {episode}:", reply_markup=InlineKeyboardMarkup(buttons))
    except Exception as e:
        logger.error(e)
        update.message.reply_text("Erreur lors du téléchargement.")


def top(update: Update, context: CallbackContext):
    """Show top n anime by popularity (default 50)."""
    n = int(context.args[0]) if context.args and context.args[0].isdigit() else 50
    update.message.chat.send_action(ChatAction.TYPING)
    try:
        top_list = database_api.top('anime', page=1, subtype='bypopularity')['top'][:n]
        text = "Top {} anime par popularité:\n".format(n)
        for i, anime in enumerate(top_list, start=1):
            text += f"{i}. {anime['title']} (Score: {anime['score']})\n"
        update.message.reply_text(text)
    except Exception as e:
        logger.error(e)
        update.message.reply_text("Impossible de récupérer le top.")


def ranking(update: Update, context: CallbackContext):
    """Show top 10 trending anime."""
    update.message.chat.send_action(ChatAction.TYPING)
    try:
        trending = database_api.trending('anime')['top'][:10]
        text = "Top 10 trending anime:\n"
        for i, anime in enumerate(trending, start=1):
            text += f"{i}. {anime['title']}\n"
        update.message.reply_text(text)
    except Exception as e:
        logger.error(e)
        update.message.reply_text("Impossible de récupérer le classement.")


def button_handler(update: Update, context: CallbackContext):
    """Handle inline button callbacks for details."""
    query = update.callback_query
    query.answer()
    data = query.data
    if data.startswith("details_"):
        anime_id = int(data.split("_")[1])
        send_details(query, anime_id)


def main():
    updater = Updater('7613209987:AAEUt4IR1Akm_-Z-WiTt_Knm80CV414mmsM', use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler('start', start))
    dp.add_handler(CommandHandler('search', search))
    dp.add_handler(CommandHandler('download', download))
    dp.add_handler(CommandHandler('top', top))
    dp.add_handler(CommandHandler('ranking', ranking))
    dp.add_handler(CallbackQueryHandler(button_handler))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
EOF
