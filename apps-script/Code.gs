/**
 * Junte Family 2026 – registro de poleras
 * Pegar este código en: Google Sheet → Extensiones → Apps Script
 * Luego: Implementar → Nueva implementación → Aplicación web
 *   - Ejecutar como: Yo
 *   - Quién tiene acceso: Cualquier persona
 */

const HOJA = 'Registros';
const COLUMNAS = ['Fecha registro', 'Nombre y apellido', 'Talla', 'Modelo', 'Familia', 'Ciudad de origen', 'WhatsApp'];
const TALLAS = ['Niño 2', 'Niño 4', 'Niño 6', 'Niño 8', 'Niño 10', 'Niño 12', 'Niño 14',
                'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const MODELOS = ['Varón', 'Dama', 'Niño/a'];

function hoja_() {
  const ss = SpreadsheetApp.openById('1DqSF7dC0FzIUfiCa0FH_BMgQkvhJ0vfBpeXYlyDGJzg');
  const sh = ss.getSheetByName(HOJA) || ss.getSheets()[0];
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNAS);
    sh.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold').setBackground('#3B2416').setFontColor('#F4EADB');
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function limpiar_(v, max) {
  return String(v == null ? '' : v).replace(/^[=+\-@]+/, '').trim().slice(0, max || 80);
}

function resumen_() {
  const sh = hoja_();
  const n = sh.getLastRow() - 1;
  const porTalla = {};
  const porModelo = {};
  if (n > 0) {
    const filas = sh.getRange(2, 3, n, 2).getValues(); // Talla, Modelo
    filas.forEach(function (f) {
      const t = String(f[0]); const m = String(f[1]);
      if (!t) return;
      porTalla[t] = (porTalla[t] || 0) + 1;
      porModelo[m] = (porModelo[m] || 0) + 1;
    });
  }
  return { ok: true, total: Math.max(n, 0), porTalla: porTalla, porModelo: porModelo, tallas: TALLAS };
}

function doGet() {
  return json_(resumen_());
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const datos = JSON.parse(e.postData.contents || '{}');
    const personas = Array.isArray(datos.personas) ? datos.personas.slice(0, 15) : [];
    const familia = limpiar_(datos.familia, 80);
    const ciudad = limpiar_(datos.ciudad, 60);
    const whatsapp = limpiar_(datos.whatsapp, 30);
    const validas = personas
      .map(function (p) {
        return { nombre: limpiar_(p.nombre, 80), talla: limpiar_(p.talla, 20), modelo: limpiar_(p.modelo, 20) };
      })
      .filter(function (p) {
        return p.nombre.length >= 2 && TALLAS.indexOf(p.talla) >= 0 && MODELOS.indexOf(p.modelo) >= 0;
      });
    if (!validas.length) {
      return json_({ ok: false, error: 'Faltan datos: nombre, talla y modelo de al menos una persona.' });
    }
    const sh = hoja_();
    const ahora = new Date();
    const filas = validas.map(function (p) {
      return [ahora, p.nombre, p.talla, p.modelo, familia, ciudad, whatsapp];
    });
    sh.getRange(sh.getLastRow() + 1, 1, filas.length, COLUMNAS.length).setValues(filas);
    const r = resumen_();
    r.registrados = validas.map(function (p) { return p.nombre; });
    return json_(r);
  } catch (err) {
    return json_({ ok: false, error: 'No se pudo guardar. Intenta de nuevo.' });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}
