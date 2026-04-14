// utils.js : Fonctions utilitaires partagées

/**
 * Lanceur de promesse pour le FileReader (utile pour le Base64)
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Détecte si l'URL correspond à une application Google Workspace supportée
 * et extrait son ID et type MIME.
 */
function parseDriveUrl(url) {
  try {
      const urlObj = new URL(url);
      if (!urlObj.hostname.endsWith('docs.google.com')) return null;

      const match = urlObj.pathname.match(/\/(document|spreadsheets|presentation)\/d\/([a-zA-Z0-9-_]+)/);
      if (match) {
          const typeStr = match[1];
          const fileId = match[2];
          let mimeType = '';
          
          if (typeStr === 'document') mimeType = 'application/vnd.google-apps.document';
          else if (typeStr === 'spreadsheets') mimeType = 'application/vnd.google-apps.spreadsheet';
          else if (typeStr === 'presentation') mimeType = 'application/vnd.google-apps.presentation';

          return { fileId, mimeType, typeStr };
      }
      return null;
  } catch (e) {
      return null;
  }
}

// Export pour le contexte du Content Script (s'il n'y a pas de modules purs)
window.ClipperUtils = {
  blobToBase64,
  parseDriveUrl,
};

// Export ESM optionnel (pour les modules ES6 comme background.js)
if (typeof exports !== 'undefined') {
  exports.blobToBase64 = blobToBase64;
  exports.parseDriveUrl = parseDriveUrl;
}
