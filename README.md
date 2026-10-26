# Junte Family 2026 – Registro de poleras

*"Un lazo que ni el tiempo puede soltar"* · Sábado 19 de diciembre de 2026 · Trinidad, Beni

Página para que cada familia registre nombre, talla y modelo de su polera. Las respuestas se guardan en la Google Sheet **"Junte Family 2026 – Poleras"**.

## Archivos

- `index.html`: el formulario (página pública).
- `logo.png`, `frase.png`, `icon.png`: imágenes de la página.
- `apps-script/Code.gs`: el código que guarda las respuestas en la Google Sheet.

## Puesta en marcha

1. **Conectar la hoja**: abre la Google Sheet → *Extensiones → Apps Script* → borra lo que haya y pega `apps-script/Code.gs` → guardar.
2. **Implementar** → *Nueva implementación* → tipo *Aplicación web* → Ejecutar como: **Yo** · Quién tiene acceso: **Cualquier persona** → *Implementar* → autorizar → copiar la URL que termina en `/exec`.
3. En `index.html`, reemplaza `PEGAR_AQUI_LA_URL_DEL_APPS_SCRIPT` por esa URL.
4. **GitHub Pages**: *Settings → Pages → Source: Deploy from a branch → main / (root)*. La página queda en `https://derinvc23.github.io/junte-family-2026/`.

Para cambiar la fecha límite, edita `FECHA_LIMITE` al inicio del `<script>` en `index.html`.
