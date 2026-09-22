/* ==========================================================================
   PROJEKT AURORA - CENTRAL CONTROLLER (main.js)
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. SISTEMA UNIFICADO DE MERKLISTE
// --------------------------------------------------------------------------

/**
 * Agrega un artículo simple (solo título y categoría) a la Merkliste.
 */
function addToMerkliste(title, category) {
  let merkliste = JSON.parse(localStorage.getItem('aurora_merkliste')) || [];

  const exists = merkliste.some(item => item.title === title);

  if (!exists) {
    merkliste.push({
      id: null,
      title: title,
      category: category,
      content: null,
      date: new Date().toLocaleDateString('de-DE')
    });
    localStorage.setItem('aurora_merkliste', JSON.stringify(merkliste));
    alert(`"${title}" wurde zu Ihrer Merkliste hinzugefügt!`);
    
    if (document.getElementById('merkliste-list')) {
      displayMerkliste();
    }
  } else {
    alert('Dieser Artikel befindet sich bereits in Ihrer Merkliste.');
  }
}

/**
 * Extrae todo el texto de un ID HTML y lo guarda completo en la Merkliste.
 * @param {string} elementId - ID del contenedor (ej: 'essay-wald-kunst').
 * @param {string} title - Título del ensayo o sección.
 * @param {string} category - Categoría (opcional, por defecto 'Essay').
 */
function addToMerklisteById(elementId, title, category = 'Essay') {
  const container = document.getElementById(elementId);

  if (!container) {
    console.error(`Error: No existe ningún elemento con el ID "${elementId}".`);
    alert(`Error: No se encontró la sección con ID "${elementId}".`);
    return;
  }

  // Extrae todo el texto contenido en el HTML respetando saltos de línea
  const textContent = container.innerText;
  let merkliste = JSON.parse(localStorage.getItem('aurora_merkliste')) || [];

  // Evita duplicados verificando por ID o por título
  const alreadySaved = merkliste.some(item => item.id === elementId || item.title === title);

  if (!alreadySaved) {
    merkliste.push({
      id: elementId,
      title: title || 'Unbekannter Titel',
      category: category,
      content: textContent, // <--- AQUÍ GUARDAMOS TODO EL TEXTO COMPLETO
      date: new Date().toLocaleDateString('de-DE')
    });

    localStorage.setItem('aurora_merkliste', JSON.stringify(merkliste));
    alert(`"${title}" wurde erfolgreich zur Merkliste hinzugefügt!`);

    if (document.getElementById('merkliste-list')) {
      displayMerkliste();
    }
  } else {
    alert('Dieser Abschnitt befindet sich bereits in Ihrer Merkliste.');
  }
}

/**
 * Lee la Merkliste de localStorage y la muestra en la pantalla.
 */
function displayMerkliste() {
  const listEl = document.getElementById('merkliste-list');
  if (!listEl) return;

  const merkliste = JSON.parse(localStorage.getItem('aurora_merkliste')) || [];

  if (merkliste.length === 0) {
    listEl.innerHTML = '<li class="list-group-item text-center text-muted">Keine Artikel in der Merkliste gespeichert.</li>';
    return;
  }

  listEl.innerHTML = merkliste.map((item) => 
    `<li class="list-group-item d-flex justify-content-between align-items-center text-dark">
      <span>
        <strong>${item.title}</strong> 
        <small class="text-muted">(${item.category})</small>
        ${item.content ? ' <span class="badge badge-success">Volltext</span>' : ''}
      </span>
      <span class="badge badge-info badge-pill">${item.date}</span>
     </li>`
  ).join('');
}

/**
 * Vacía por completo la Merkliste guardada.
 */
function clearMerkliste() {
  if (confirm('Möchten Sie Ihre Merkliste wirklich leeren?')) {
    localStorage.removeItem('aurora_merkliste');
    displayMerkliste();
  }
}


// --------------------------------------------------------------------------
// 2. EXPORTACIÓN UNIFICADA DE DOCUMENTO CON CONTENIDO COMPLETO
// --------------------------------------------------------------------------

/**
 * Descarga en un único archivo .txt los datos del formulario y los textos completos guardados.
 */
function downloadProtokollTxt() {
  const nameEl = document.getElementById('userName');
  const topicEl = document.getElementById('selectedTopics');
  const notesEl = document.getElementById('userNotes');

  const name = nameEl ? (nameEl.value || 'Anonym') : 'Anonym';
  const topic = topicEl ? topicEl.value : 'Allgemein';
  const notes = notesEl ? (notesEl.value || 'Keine Anmerkungen') : 'Keine Anmerkungen';
  const date = new Date().toLocaleDateString('de-DE');

  const merkliste = JSON.parse(localStorage.getItem('aurora_merkliste')) || [];

  let fileContent = 
    `==========================================\n` +
    `PROJEKT AURORA - PROTOKOLL & MERKLISTE\n` +
    `==========================================\n\n` +
    `Datum: ${date}\n` +
    `Nutzer / Besucher: ${name}\n` +
    `Interessensbereich: ${topic}\n\n` +
    `Notizen des Nutzers:\n${notes}\n\n` +
    `==========================================\n` +
    `GESPEICHERTE ARTIKEL & ESSAYS (MERKLISTE)\n` +
    `==========================================\n\n`;

  if (merkliste.length === 0) {
    fileContent += `Keine Artikel in der Merkliste vorhanden.\n`;
  } else {
    merkliste.forEach((item, index) => {
      fileContent += `------------------------------------------\n`;
      fileContent += `[${index + 1}] ${item.title.toUpperCase()}\n`;
      fileContent += `Kategorie: ${item.category} | Gespeichert am: ${item.date}\n`;
      fileContent += `------------------------------------------\n`;
      
      if (item.content) {
        fileContent += `\n${item.content}\n\n`;
      } else {
        fileContent += `(Kein Volltext gespeichert)\n\n`;
      }
    });
  }

  fileContent += 
    `==========================================\n` +
    `Erstellt über Projekt Aurora\n`;

  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `aurora_protokoll_${name.replace(/\s+/g, '_')}.txt`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}


// --------------------------------------------------------------------------
// 3. DESCARGA DIRECTA INDIVIDUAL (Sin pasar por la Merkliste)
// --------------------------------------------------------------------------

/**
 * Descarga inmediatamente el texto de un ID en un archivo .txt independiente.
 */
function downloadSectionById(elementId, fileName = 'artikel.txt') {
  const container = document.getElementById(elementId);
  
  if (!container) {
    console.error(`Error: No existe ningún elemento con el ID "${elementId}".`);
    alert(`Error: No se encontró la sección con ID "${elementId}".`);
    return;
  }

  const textContent = container.innerText;
  const validFileName = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;

  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = validFileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}


// --------------------------------------------------------------------------
// 4. INICIALIZACIÓN
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  displayMerkliste();
});