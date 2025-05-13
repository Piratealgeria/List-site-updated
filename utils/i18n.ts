// Define available languages
export const LANGUAGES = ["en", "de", "es", "pl"]
export const DEFAULT_LANGUAGE = "en"

// Type for translations
export type TranslationKey =
  | "common.readMore"
  | "common.search"
  | "common.categories"
  | "common.archive"
  | "common.about"
  | "common.comments"
  | "common.share"
  | "common.relatedPosts"
  | "common.postedOn"
  | "common.by"
  | "common.readingTime"
  | "common.tags"
  | "common.loadMore"
  | "common.noResults"
  | "search.title"
  | "search.placeholder"
  | "search.filters"
  | "search.category"
  | "search.tag"
  | "search.author"
  | "search.dateFrom"
  | "search.dateTo"
  | "search.clearFilters"
  | "search.recentSearches"
  | "comments.title"
  | "comments.writeComment"
  | "comments.send"
  | "comments.reply"
  | "comments.edit"
  | "comments.delete"
  | "comments.noComments"
  | "comments.signIn"
  | "poll.vote"
  | "poll.results"
  | "poll.hideResults"
  | "poll.showResults"
  | "poll.totalVotes"
  | "poll.expired"
  | "poll.voteRecorded"
  | "readingQueue.title"
  | "readingQueue.empty"
  | "readingQueue.description"
  | "readingQueue.added"
  | "readingQueue.read"
  | "accessibility.title"
  | "accessibility.textSize"
  | "accessibility.contrast"
  | "accessibility.default"
  | "accessibility.high"
  | "accessibility.low"
  | "accessibility.reduceMotion"
  | "accessibility.dyslexicFont"
  | "accessibility.reset"
  | "accessibility.cancel"
  | "accessibility.save"

// Translations
const translations: Record<string, Record<TranslationKey, string>> = {
  en: {
    "common.readMore": "Read More",
    "common.search": "Search",
    "common.categories": "Categories",
    "common.archive": "Archive",
    "common.about": "About",
    "common.comments": "Comments",
    "common.share": "Share",
    "common.relatedPosts": "Related Posts",
    "common.postedOn": "Posted on",
    "common.by": "by",
    "common.readingTime": "min read",
    "common.tags": "Tags",
    "common.loadMore": "Load More",
    "common.noResults": "No results found",
    "search.title": "Search",
    "search.placeholder": "Search with regex support...",
    "search.filters": "Filters",
    "search.category": "Category",
    "search.tag": "Tag",
    "search.author": "Author",
    "search.dateFrom": "From",
    "search.dateTo": "To",
    "search.clearFilters": "Clear all filters",
    "search.recentSearches": "Recent searches:",
    "comments.title": "Comments",
    "comments.writeComment": "Type your comment...",
    "comments.send": "Send",
    "comments.reply": "Reply",
    "comments.edit": "Edit",
    "comments.delete": "Delete",
    "comments.noComments": "No comments yet. Be the first to comment!",
    "comments.signIn": "Sign in to save your name with comments",
    "poll.vote": "Vote",
    "poll.results": "Results",
    "poll.hideResults": "Hide results",
    "poll.showResults": "Show results",
    "poll.totalVotes": "Total votes",
    "poll.expired": "Poll closed",
    "poll.voteRecorded": "Vote recorded",
    "readingQueue.title": "Reading Queue",
    "readingQueue.empty": "Your reading queue is empty.",
    "readingQueue.description": "Save articles to read later, even when offline.",
    "readingQueue.added": "Added",
    "readingQueue.read": "Read",
    "accessibility.title": "Accessibility Settings",
    "accessibility.textSize": "Text Size",
    "accessibility.contrast": "Contrast",
    "accessibility.default": "Default",
    "accessibility.high": "High",
    "accessibility.low": "Low",
    "accessibility.reduceMotion": "Reduce Motion",
    "accessibility.dyslexicFont": "Dyslexia-friendly Font",
    "accessibility.reset": "Reset",
    "accessibility.cancel": "Cancel",
    "accessibility.save": "Save",
  },
  de: {
    "common.readMore": "Weiterlesen",
    "common.search": "Suchen",
    "common.categories": "Kategorien",
    "common.archive": "Archiv",
    "common.about": "Über",
    "common.comments": "Kommentare",
    "common.share": "Teilen",
    "common.relatedPosts": "Ähnliche Beiträge",
    "common.postedOn": "Veröffentlicht am",
    "common.by": "von",
    "common.readingTime": "min Lesezeit",
    "common.tags": "Schlagwörter",
    "common.loadMore": "Mehr laden",
    "common.noResults": "Keine Ergebnisse gefunden",
    "search.title": "Suche",
    "search.placeholder": "Suche mit Regex-Unterstützung...",
    "search.filters": "Filter",
    "search.category": "Kategorie",
    "search.tag": "Schlagwort",
    "search.author": "Autor",
    "search.dateFrom": "Von",
    "search.dateTo": "Bis",
    "search.clearFilters": "Alle Filter zurücksetzen",
    "search.recentSearches": "Letzte Suchen:",
    "comments.title": "Kommentare",
    "comments.writeComment": "Schreibe einen Kommentar...",
    "comments.send": "Senden",
    "comments.reply": "Antworten",
    "comments.edit": "Bearbeiten",
    "comments.delete": "Löschen",
    "comments.noComments": "Noch keine Kommentare. Sei der Erste!",
    "comments.signIn": "Melde dich an, um deinen Namen zu speichern",
    "poll.vote": "Abstimmen",
    "poll.results": "Ergebnisse",
    "poll.hideResults": "Ergebnisse ausblenden",
    "poll.showResults": "Ergebnisse anzeigen",
    "poll.totalVotes": "Gesamtstimmen",
    "poll.expired": "Umfrage beendet",
    "poll.voteRecorded": "Stimme gespeichert",
    "readingQueue.title": "Leseliste",
    "readingQueue.empty": "Deine Leseliste ist leer.",
    "readingQueue.description": "Speichere Artikel zum späteren Lesen, auch offline.",
    "readingQueue.added": "Hinzugefügt",
    "readingQueue.read": "Lesen",
    "accessibility.title": "Barrierefreiheit",
    "accessibility.textSize": "Textgröße",
    "accessibility.contrast": "Kontrast",
    "accessibility.default": "Standard",
    "accessibility.high": "Hoch",
    "accessibility.low": "Niedrig",
    "accessibility.reduceMotion": "Bewegungen reduzieren",
    "accessibility.dyslexicFont": "Legasthenie-freundliche Schrift",
    "accessibility.reset": "Zurücksetzen",
    "accessibility.cancel": "Abbrechen",
    "accessibility.save": "Speichern",
  },
  es: {
    "common.readMore": "Leer más",
    "common.search": "Buscar",
    "common.categories": "Categorías",
    "common.archive": "Archivo",
    "common.about": "Acerca de",
    "common.comments": "Comentarios",
    "common.share": "Compartir",
    "common.relatedPosts": "Artículos relacionados",
    "common.postedOn": "Publicado el",
    "common.by": "por",
    "common.readingTime": "min de lectura",
    "common.tags": "Etiquetas",
    "common.loadMore": "Cargar más",
    "common.noResults": "No se encontraron resultados",
    "search.title": "Búsqueda",
    "search.placeholder": "Buscar con soporte regex...",
    "search.filters": "Filtros",
    "search.category": "Categoría",
    "search.tag": "Etiqueta",
    "search.author": "Autor",
    "search.dateFrom": "Desde",
    "search.dateTo": "Hasta",
    "search.clearFilters": "Borrar todos los filtros",
    "search.recentSearches": "Búsquedas recientes:",
    "comments.title": "Comentarios",
    "comments.writeComment": "Escribe tu comentario...",
    "comments.send": "Enviar",
    "comments.reply": "Responder",
    "comments.edit": "Editar",
    "comments.delete": "Eliminar",
    "comments.noComments": "¡Aún no hay comentarios. Sé el primero en comentar!",
    "comments.signIn": "Inicia sesión para guardar tu nombre con los comentarios",
    "poll.vote": "Votar",
    "poll.results": "Resultados",
    "poll.hideResults": "Ocultar resultados",
    "poll.showResults": "Mostrar resultados",
    "poll.totalVotes": "Votos totales",
    "poll.expired": "Encuesta cerrada",
    "poll.voteRecorded": "Voto registrado",
    "readingQueue.title": "Cola de lectura",
    "readingQueue.empty": "Tu cola de lectura está vacía.",
    "readingQueue.description": "Guarda artículos para leer más tarde, incluso sin conexión.",
    "readingQueue.added": "Añadido",
    "readingQueue.read": "Leer",
    "accessibility.title": "Configuración de accesibilidad",
    "accessibility.textSize": "Tamaño del texto",
    "accessibility.contrast": "Contraste",
    "accessibility.default": "Predeterminado",
    "accessibility.high": "Alto",
    "accessibility.low": "Bajo",
    "accessibility.reduceMotion": "Reducir movimiento",
    "accessibility.dyslexicFont": "Fuente para dislexia",
    "accessibility.reset": "Restablecer",
    "accessibility.cancel": "Cancelar",
    "accessibility.save": "Guardar",
  },
  pl: {
    "common.readMore": "Czytaj więcej",
    "common.search": "Szukaj",
    "common.categories": "Kategorie",
    "common.archive": "Archiwum",
    "common.about": "O nas",
    "common.comments": "Komentarze",
    "common.share": "Udostępnij",
    "common.relatedPosts": "Powiązane artykuły",
    "common.postedOn": "Opublikowano",
    "common.by": "przez",
    "common.readingTime": "min czytania",
    "common.tags": "Tagi",
    "common.loadMore": "Wczytaj więcej",
    "common.noResults": "Nie znaleziono wyników",
    "search.title": "Wyszukiwanie",
    "search.placeholder": "Szukaj z obsługą regex...",
    "search.filters": "Filtry",
    "search.category": "Kategoria",
    "search.tag": "Tag",
    "search.author": "Autor",
    "search.dateFrom": "Od",
    "search.dateTo": "Do",
    "search.clearFilters": "Wyczyść wszystkie filtry",
    "search.recentSearches": "Ostatnie wyszukiwania:",
    "comments.title": "Komentarze",
    "comments.writeComment": "Napisz komentarz...",
    "comments.send": "Wyślij",
    "comments.reply": "Odpowiedz",
    "comments.edit": "Edytuj",
    "comments.delete": "Usuń",
    "comments.noComments": "Brak komentarzy. Bądź pierwszy!",
    "comments.signIn": "Zaloguj się, aby zapisać swoje imię",
    "poll.vote": "Głosuj",
    "poll.results": "Wyniki",
    "poll.hideResults": "Ukryj wyniki",
    "poll.showResults": "Pokaż wyniki",
    "poll.totalVotes": "Łączna liczba głosów",
    "poll.expired": "Ankieta zamknięta",
    "poll.voteRecorded": "Głos zapisany",
    "readingQueue.title": "Kolejka czytania",
    "readingQueue.empty": "Twoja kolejka czytania jest pusta.",
    "readingQueue.description": "Zapisuj artykuły do przeczytania później, nawet offline.",
    "readingQueue.added": "Dodano",
    "readingQueue.read": "Czytaj",
    "accessibility.title": "Ustawienia dostępności",
    "accessibility.textSize": "Rozmiar tekstu",
    "accessibility.contrast": "Kontrast",
    "accessibility.default": "Domyślny",
    "accessibility.high": "Wysoki",
    "accessibility.low": "Niski",
    "accessibility.reduceMotion": "Ogranicz animacje",
    "accessibility.dyslexicFont": "Czcionka dla dyslektyków",
    "accessibility.reset": "Reset",
    "accessibility.cancel": "Anuluj",
    "accessibility.save": "Zapisz",
  },
}

// Create a translation hook
export function useTranslation(lang: string = DEFAULT_LANGUAGE) {
  // Ensure we have a valid language
  const validLang = LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE

  // Return the translation function
  return (key: TranslationKey): string => {
    return translations[validLang][key] || translations[DEFAULT_LANGUAGE][key] || key
  }
}
