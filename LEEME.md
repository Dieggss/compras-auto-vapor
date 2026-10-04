# Web de compras del auto a vapor (Grupo 1)

Página para que el grupo marque los materiales que va consiguiendo, con el valor, el link y quién lo trae.
Todo lo que marca uno lo ve el resto (se actualiza cada 8 segundos).

## Subirla a Vercel (una sola vez, ~10 minutos, gratis)

1. **GitHub.** Entra a github.com (crea cuenta si no tienes) → botón **New** → nombre `compras-auto-vapor` → **Create repository**.
   En la página que aparece, toca **uploading an existing file** y arrastra **todo el contenido de esta carpeta `web`**
   (`index.html`, `package.json`, `LEEME.md` y la carpeta `api` con `estado.js` adentro) → **Commit changes**.
2. **Vercel.** Entra a vercel.com → **Continue with GitHub** → **Add New… → Project** → elige `compras-auto-vapor` → **Deploy**.
   No cambies nada de la configuración (no es Next.js ni nada, es una página simple).
3. **Base de datos** (sin esto cada uno ve solo lo suyo). En el proyecto de Vercel → pestaña **Storage** → **Create Database**
   → **Upstash for Redis** (plan Free) → **Create** → **Connect** al proyecto `compras-auto-vapor` (marca Production y Preview).
4. Ve a **Deployments** → los tres puntitos del último → **Redeploy**. Listo: el link `compras-auto-vapor.vercel.app` (o el que te dé) es el que mandan al grupo.

Si arriba de la página sale "Guardado para todo el grupo" con un punto verde, está funcionando.
Si sale "Falta conectar la base de datos", falta el paso 3 o el Redeploy del paso 4.

## Clave de grupo (opcional)

Para que nadie de afuera pueda marcar cosas: en Vercel → **Settings → Environment Variables** → agregar
`GRUPO_CLAVE` con la clave que quieran → **Save** → **Redeploy**. La página la pide una vez en cada celular.

## Qué tiene

- **Materiales:** los 53 de la lista, agrupados por importancia, por sistema o por quién lo consigue. Botón grande para marcar
  conseguido o pendiente, valor que salió, link de la tienda, quién lo consigue, nota, y se puede editar el nombre genérico
  y la descripción exacta (con botón para volver al texto original). Se pueden agregar materiales nuevos.
- **Arriba:** cuántos van, cuánto se ha gastado, cuánto sale por persona y cuántos difíciles faltan.
- **Copiar lo que falta:** copia la lista pendiente lista para pegar en WhatsApp.
- **Descargar planilla (CSV):** se abre en Excel.
- **Cortes, Herramientas y Paso a paso:** checklist de las piezas cortadas, quién trae cada herramienta, y los 31 pasos de la guía
  con aviso de qué materiales faltan para cada paso.

## Cambiar la lista

La lista sale de `fuente/bom.py` y los pasos de `fuente/guia.js`. Después de cambiarlos: `python3 fuente/web.py`
regenera `web/index.html`, y se sube de nuevo a GitHub (Vercel se actualiza solo). No cambiar el orden de la lista
una vez que el grupo empezó a marcar, porque cada material se guarda por su número.
