# Estado actual del sistema - Bienestar Universitario ULEAM

## Resumen del proyecto

El repositorio contiene una aplicación Angular 21 llamada `bienestar`, generada con Angular CLI y organizada con componentes standalone, rutas por rol y servicios de estado por módulo. La aplicación representa el sistema de Gestión del Departamento de Bienestar Universitario de ULEAM con dos perfiles operativos: administrador y estudiante.

Las plantillas originales se conservan en `legacy-static/` como referencia histórica. La implementación activa está en `src/app/` y usa Angular, signals, servicios inyectables y estilos globales en `src/styles.css`.

## Módulos existentes

- Administrador: dashboard, estudiantes, solicitudes, citas, becas, casos, reportes y usuarios.
- Estudiante: mis solicitudes, mis citas, mis becas y nueva solicitud.
- Rutas activas: `/admin/*`, `/estudiante/*` y selector de rol en `/`.
- No existe backend ni base de datos. El selector de rol sigue siendo el mecanismo de acceso para esta práctica.

## Hallazgos antes de la implementación

- Los servicios mantenían datos en memoria con `signal(...)`; al recargar el navegador se perdían los cambios.
- El dashboard y las estadísticas de reportes usaban valores estáticos como `1,234`, `45` y `300`, sin relación con los datos reales.
- Varios botones eran solo plantilla: crear estudiante, nueva solicitud, nueva cita, nueva beca, nuevo caso, nuevo usuario y generar reporte.
- El build fallaba inicialmente por asignar `string` desde selects a tipos union como `StudentStatus`, `UsuarioRol` y `UsuarioEstado`.
- Había textos visibles sin tildes y documentación con mojibake en `.github/interfaces_bienestar_uleam.md`.
- La apariencia global era básica: Arial, botones y tablas planas, paleta azul genérica y poco carácter institucional.

## Decisiones implementadas

- Se creó `LocalStorageStoreService` como adaptador único para leer/escribir colecciones versionadas en `localStorage`.
- Cada módulo conserva datos semilla, pero solo se usan cuando no existe información previa en el navegador.
- Las colecciones persistidas usan claves `bienestar:v1:*`.
- Se añadieron IDs estables a entidades que no los tenían para editar y eliminar por identificador, no por referencia de objeto.
- Dashboard y reportes calculan métricas desde los servicios persistidos.
- Las altas, ediciones y eliminaciones guardan automáticamente en `localStorage`.
- La nueva solicitud del estudiante crea un registro real y vuelve a “Mis Solicitudes”.
- Se mantuvieron las rutas actuales y no se introdujo base de datos, API ni autenticación real.

## Diseño visual aplicado

La interfaz ahora sigue una línea de panel institucional profesional, con navegación clara por rol, tablas más legibles, formularios agrupados y estados visuales consistentes.

Paleta base:

- Azul marino institucional: `#12324A`
- Teal operativo: `#0F766E`
- Verde bienestar: `#2E7D32`
- Dorado moderado: `#C9972B`
- Fondo claro: `#F3F6F8`
- Superficies blancas y estados semánticos para éxito, alerta y error.

## Persistencia local

Todo se almacena en `localStorage`. Si el usuario limpia los datos del navegador, el sistema vuelve a cargar los datos semilla. Si existe JSON inválido en una clave, el adaptador recupera la colección semilla y la vuelve a guardar.

Claves principales:

- `bienestar:v1:students`
- `bienestar:v1:solicitudes`
- `bienestar:v1:citas`
- `bienestar:v1:becas`
- `bienestar:v1:casos`
- `bienestar:v1:reportes`
- `bienestar:v1:usuarios`
- `bienestar:v1:student-solicitudes`
- `bienestar:v1:student-citas`
- `bienestar:v1:student-becas`

## Validación

- Se ejecutó `corepack pnpm build`.
- El build inicial falló por tipos de selects incompatibles.
- Después de corregir tipos, persistencia y componentes, el build terminó correctamente.

Checklist funcional recomendado:

- Entrar como administrador y navegar todos los módulos.
- Crear, editar y eliminar estudiantes, usuarios, becas y casos.
- Crear y editar solicitudes y citas.
- Generar reportes y confirmar que aparecen en reportes guardados.
- Entrar como estudiante, crear una solicitud y confirmar que aparece en “Mis Solicitudes”.
- Recargar el navegador y confirmar que los datos creados se conservan.
- Verificar en móvil que las tablas tengan scroll horizontal y no rompan la pantalla.
