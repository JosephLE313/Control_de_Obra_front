# Seguridad de Control de Obra

## Alcance de la revisión

Revisión del código y de los dos commits que existían al iniciar esta auditoría (29 de octubre de 2026), con búsqueda de patrones de credenciales, lectura de reglas y configuración, pruebas de regresión y auditoría npm. No es una certificación de ausencia de vulnerabilidades. No se consultaron datos de una base de producción ni se ejecutaron escrituras contra servicios externos.

## Qué se encontró y corrigió en el repositorio

- Configuración pública de Firebase versionada y una clave JWT de rol `anon` incrustada como configuración predeterminada de Supabase. No se encontraron claves `service_role`, secretos de Supabase, tokens GitHub, claves privadas PEM o claves OpenAI con los patrones revisados.
- Reglas Firestore con `allow ... if true` y plantilla SQL con lectura/escritura pública. Ahora las reglas exigen un miembro aprobado mediante custom claim `controlObra`, salvo el perfil propio. El SQL retira la política pública heredada y revoca permisos de cliente hasta configurar autorización.
- La configuración Firebase real deja de importarse y versionarse. Se utilizan variables de entorno vacías por defecto; la configuración local anterior se conserva en disco, ignorada por Git. La aplicación puede abrir en modo local sin activar Firebase remoto.
- Supabase no dispone de credenciales predeterminadas. Solo acepta claves públicas publishable o JWT con rol `anon`; rechaza claves secret y service_role, valida la URL y retira claves inválidas que hubieran quedado en almacenamiento local.
- El campo de la clave de cliente aparece enmascarado. Esta máscara evita mostrarla a simple vista; no la convierte en un secreto del navegador.
- Se eliminó la siembra automática de datos al abrir la aplicación y se corrigió la prueba de conexión para no declarar éxito ante falta de configuración o fallos de red/permisos.
- Se añadieron pruebas y una comprobación de patrones que no imprime los valores detectados. Se ejecutan con `npm run test:security` y `npm run security:check`.
- Se fijó `@grpc/grpc-js` a una versión corregida de su misma versión principal mediante un override. El lockfile npm fija las versiones reproducibles; no se aplicó `npm audit fix --force`.

## Claves públicas y secretos: diferencia necesaria

Los valores `VITE_*` se incorporan al JavaScript entregado al navegador. Mover una clave a `.env.local` la retira del repositorio, pero **no la oculta en una aplicación frontend compilada**. Firebase web API keys y Supabase publishable/anon son identificadores de cliente públicos: su protección efectiva depende de reglas, RLS y restricciones. Las claves administrativas y de APIs privadas deben estar exclusivamente en un backend.

- Firebase: https://firebase.google.com/docs/projects/api-keys
- Supabase: https://supabase.com/docs/guides/getting-started/api-keys
- RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Aviso de dependencia: https://github.com/advisories/GHSA-m9gg-hp2v-232j

## Acciones pendientes en los servicios desplegados

Estas correcciones están en Git; **no equivalen a desplegar reglas en Firebase ni a cambiar permisos de Supabase**.

1. En Firebase/Google Cloud, revisar y restringir la clave de cliente a las APIs y orígenes previstos. Si pudo usarse para otras APIs o no se conoce su alcance, reemplazarla y actualizar el entorno. No publicar claves de Gemini ni claves administrativas.
2. Desplegar `firestore.rules` al proyecto correcto, revisar que no persistan reglas abiertas y asignar la custom claim `controlObra: true` solo a colaboradores aprobados, desde un servidor o consola administrativa confiable. El formulario de perfil no concede ese permiso. La política supone una sola obra compartida por ese grupo; múltiples obras requieren aislamiento por membresía.
3. En Supabase, revisar políticas y grants reales. El SQL del repositorio cierra el acceso público, pero no implementa un sistema multiobra completo. Definir autorización por proyecto antes de volver a conceder permisos. Firebase Auth no proporciona automáticamente una sesión de Supabase: requiere una integración explícita o un backend.
4. Configurar los identificadores públicos propios en `.env.local` o en el entorno del alojamiento, reconstruir y desplegar la aplicación. La nube debe permanecer cerrada hasta completar el modelo de autorización; el modo local mantiene la interfaz y los registros del navegador.
5. Los valores históricos siguen presentes en commits anteriores. No se reescribió ni forzó el historial para no romper clones o trabajo existente. Si una credencial se considera comprometida, revocarla o rotarla primero. Un borrado del historial no elimina copias, forks o cachés.

## Prevención

No subir `.env.local`, service accounts, claves privadas, tokens personales o respaldos de configuración. No pegar secretos en formularios de cliente. La comprobación automática usa patrones conocidos y puede omitir formatos no contemplados; no sustituye revisión y controles de acceso. Nunca copiar valores de credenciales en reportes de incidencias.

Los avisos gRPC corregidos corresponden al SDK de Node; no se verificó una explotación desde este frontend. El lockfile anterior de Bun se sustituyó por un único lockfile npm para evitar instalaciones con versiones distintas de las auditadas.

## Verificación del cambio

Pasaron la comprobación TypeScript, seis pruebas de regresión, el escaneo de patrones y la compilación de producción. La auditoría npm del lockfile resultante reportó cero vulnerabilidades conocidas. Se comprobó que la clave histórica de Firebase no está incluida en la compilación sin configuración. No se ejecutaron pruebas de lectura/escritura contra las bases reales ni se desplegaron las reglas. La compilación conserva un aviso de tamaño de bundle, ajeno a esta corrección de credenciales.
