<div align="center">
  <img src="public/icon.svg" alt="Identidad de Control de Obra" width="80" />
  <h1>Control de Obra</h1>
  <p><strong>Seguimiento de avance, recursos y actividades de construcción civil.</strong></p>
  <p>React · TypeScript · Vite · Tailwind CSS · Supabase · Firebase</p>
</div>

## Sobre el proyecto

**Control de Obra** es una aplicación web en desarrollo para organizar el seguimiento diario de una obra: partidas y metrados, reportes, personal, materiales, equipos, incidencias y evidencias fotográficas.

El proyecto conecta ingeniería civil y herramientas digitales para reunir información de campo en una interfaz adaptable a escritorio y móvil. Incluye vistas de análisis, cronograma de cimentación y protocolos de inspección.

**Estado:** prototipo en desarrollo. Las funciones descritas corresponden a módulos presentes en el código; su disponibilidad con datos compartidos depende de la configuración de los servicios. No se presentan resultados de validación en obra, ahorros medidos ni una certificación de uso en producción.

## Módulos

| Módulo | Alcance en la aplicación |
| --- | --- |
| Panel de seguimiento | Resumen del proyecto, indicadores y acceso a las actividades de obra. |
| Reporte diario | Registro y consulta de actividades por fecha; formato de reporte para imprimir o guardar como PDF desde el navegador. |
| Partidas y metrados | Organización de partidas y seguimiento del avance registrado. |
| Personal y cuadrillas | Registro y consulta del personal de obra. |
| Materiales e insumos | Gestión de registros de materiales. |
| Equipos y maquinaria | Registro y seguimiento de equipos. |
| Incidencias | Registro de ocurrencias y seguimiento de su estado. |
| Evidencias fotográficas | Organización de registros fotográficos asociados a la obra. |
| Cronograma de cimentación | Actividades, hitos y chequeos de la etapa de cimentación. |
| Inspecciones | Listas de verificación y protocolos diarios. |
| Análisis y reportes | Visualizaciones del avance y exportación de datos a CSV. |

La interfaz incluye navegación lateral en escritorio, navegación inferior en móvil y formularios de configuración del proyecto y del perfil.

## Tecnologías y organización

| Capa | Herramientas |
| --- | --- |
| Interfaz | React 19 y TypeScript |
| Desarrollo y compilación | Vite 6 |
| Estilos | Tailwind CSS 4 |
| Gráficos, animación e iconos | Recharts, Motion y Lucide React |
| Datos de obra | Estado de React, `localStorage` y servicios de Supabase |
| Identidad y servicios adicionales | Firebase Authentication y código de servicios Firestore |
| Instalación web | Manifiesto y service worker de PWA |

El contexto principal de obra utiliza Supabase y conserva datos en `localStorage`. El repositorio también contiene integración con Firebase Authentication y servicios Firestore; esto no implica que ambos proveedores se utilicen indistintamente para todas las operaciones.

```text
src/
  components/        Vistas, formularios y modales
  context/           Estado de obra y autenticación
  data/              Datos iniciales, inspecciones y cronograma
  lib/               Configuración de Supabase y Firebase
  services/          Acceso a datos
  types.ts           Tipos del dominio
  App.tsx            Composición y selección de vistas
public/
  manifest.json      Configuración de instalación web
  sw.js              Service worker
```

## Ejecutar en local

Requisitos: Git, Node.js y npm compatibles con las dependencias de `package.json`.

```bash
git clone https://github.com/JosephLE313/Control_de_Obra_front.git
cd Control_de_Obra_front
npm ci
```

Antes de iniciar, copia `.env.example` a `.env.local` y configura un **proyecto de desarrollo propio** para las pruebas de persistencia:

```dotenv
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICA_ANON
```

También existe un formulario de configuración de Supabase dentro de la aplicación. Su configuración guardada en el navegador tiene prioridad sobre las variables de entorno. Abrir la aplicación no siembra datos de forma automática. La carga inicial remota es una acción explícita y requiere permisos.

Revisa [la configuración de Supabase](src/lib/supabase.ts), [la configuración de Firebase](src/lib/firebase.ts) y [la guía de seguridad](SECURITY.md). Firebase usa las variables públicas `VITE_FIREBASE_*` del ejemplo; no importa configuraciones locales versionadas. Sin configuración propia, la interfaz conserva el modo local y la nube no se activa. El SQL de ejemplo cierra el acceso público hasta configurar autorización por proyecto.

```bash
npm run dev
```

Abre **http://localhost:3000**. El comando de desarrollo expone el servidor en las interfaces de red del equipo, según la configuración actual del script.

El archivo `.env.example` contiene solo campos públicos vacíos. No se exige una clave de Gemini; cualquier futura API privada de IA deberá ejecutarse en un backend, nunca con secretos dentro de `VITE_*`.

## Comprobación y compilación

```bash
npm run lint
npm run build
npm run preview
```

- `lint` ejecuta `tsc --noEmit`: es una comprobación de tipos, no una suite de pruebas ni un análisis con ESLint.
- `build` genera el sitio en `dist/`.
- `preview` sirve la compilación para revisión local; utiliza la dirección que muestre Vite.

Comprobaciones de seguridad: `npm run security:check` y `npm run test:security`. Usa npm y `package-lock.json` para reproducir las versiones auditadas.

## Persistencia y alcance actual

- Los registros locales pertenecen al navegador y origen utilizados. Borrar su almacenamiento elimina esa copia; `localStorage` no sustituye un respaldo de datos.
- La sincronización requiere un proyecto Supabase válido, tablas y políticas compatibles. Una interfaz de configuración no confirma por sí sola que exista una conexión operativa.
- La aplicación muestra actualmente el panel sin exigir inicio de sesión y admite un perfil de invitado. La presencia de Firebase Authentication no equivale a tener todas las vistas protegidas.
- El SQL de ejemplo retira la política pública heredada y revoca permisos de clientes. La nube requiere un modelo explícito de autorización; no uses políticas abiertas para reactivar la sincronización. Las reglas Firestore exigen un miembro aprobado y protegen el perfil propio. Consulta `SECURITY.md` antes de desplegarlas.
- El manifiesto y el service worker proporcionan una base para instalación y caché web. No se garantiza operación completa sin conexión ni resolución de conflictos; el repositorio no incluye un APK generado.
- Los iconos PNG de 192 y 512 píxeles referidos en el manifiesto no están incluidos en `public/`; deben incorporarse para completar esos recursos de instalación.

Usa únicamente claves públicas de cliente en variables `VITE_*`. No agregues claves administrativas, `service_role`, credenciales privadas ni archivos `.env.local` al repositorio.

## Despliegue

Publica el contenido de `dist/` en un alojamiento estático, tras configurar y revisar los servicios de datos. Las variables `VITE_*` se incorporan durante la compilación.

La configuración actual del manifiesto y del service worker usa rutas desde `/`. Si el alojamiento sirve la aplicación en una subcarpeta, deben revisarse `base` de Vite y esas rutas antes del despliegue.

Este README no anuncia una demo pública de la aplicación: el repositorio no tiene una URL de despliegue configurada. El portafolio personal enlazado a continuación es un sitio distinto.

## Autor

**Joseph Leonardo Ccana Ayuque** · Estudiante de Ingeniería Civil.

[Perfil de GitHub](https://github.com/JosephLE313) · [Portafolio personal](https://josephle313.github.io/)

## Licencia

No hay un archivo `LICENSE` general en el repositorio. Algunos archivos incluyen avisos propios; revisa las condiciones aplicables antes de reutilizar o redistribuir el código.

## Seguridad y credenciales

Consulta [SECURITY.md](SECURITY.md) para el alcance de la revisión, pruebas y pasos pendientes en Firebase/Supabase. Las correcciones del repositorio no despliegan permisos en los servidores ni eliminan copias históricas de claves públicas. Nunca compartas secretos en incidencias.
