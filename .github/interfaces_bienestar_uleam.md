# 🎓 Software de Gestión — Departamento de Bienestar Universitario (ULEAM)

**Autor:** Rivera Santana Kenny  
**Facultad:** Ciencias de la Vida y Tecnologías  
**Universidad:** Universidad Laica Eloy Alfaro de Manabí  
**Materia:** 4to. Nivel – C: Programación Orientada a Objetos  
**Docente:** Ing. Patricia Alexandra Quiroz Palma  
**Fecha:** 12 de mayo de 2026

---

## Descripción General del Sistema

El **Departamento de Bienestar Universitario** es el área de la Universidad Laica Eloy Alfaro de Manabí (ULEAM) encargada de apoyar el bienestar **físico, psicológico, social y económico** de los estudiantes.

Este software centraliza la gestión de todos los servicios que ofrece dicho departamento, integrando módulos para administradores y para los propios estudiantes, con el objetivo de optimizar los procesos de atención, seguimiento y apoyo estudiantil.

---

## Módulos del Sistema

El sistema está compuesto por **10 interfaces principales**, divididas en dos roles de usuario:

| # | Módulo | Rol |
|---|--------|-----|
| 1.1 | Dashboard Principal | Administrador |
| 1.2 | Gestión de Estudiantes | Administrador |
| 1.3 | Gestión de Solicitudes de Atención | Administrador |
| 1.4 | Gestión de Citas | Administrador |
| 1.5 | Gestión de Becas / Ayudas Económicas | Administrador |
| 1.6 | Seguimiento de Casos | Administrador |
| 1.7 | Reportes y Estadísticas | Administrador |
| 1.8 | Administración de Usuarios | Administrador |
| 1.9 | Mis Solicitudes (Vista Estudiante) | Estudiante |
| 1.10 | Formulario de Nueva Solicitud | Estudiante |

---

## Barra de Navegación

Ambos roles cuentan con una barra de navegación superior que incluye accesos directos a los módulos principales del sistema.

**Navegación del Administrador:**

```
Bienestar Universitario | Dashboard  Estudiantes  Solicitudes  Citas  Becas  Casos  Reportes  Usuarios
```

**Navegación del Estudiante:**

```
Bienestar Estudiantil | Mis Solicitudes   Mis Citas   Mis Becas   Nueva Solicitud
```

---

## 1.1 Dashboard Principal

### Descripción
Pantalla principal del **administrador**. Proporciona una visión general y en tiempo real del estado del departamento. Permite monitorear las métricas más importantes del sistema de un vistazo.

### Métricas que muestra

| Tarjeta | Valor de Ejemplo | Acción Disponible |
|---------|-----------------|-------------------|
| Estudiantes Registrados | 1,234 | Ver y gestionar |
| Solicitudes Pendientes | 45 | Ver y gestionar |
| Citas Programadas | 120 | Ver y gestionar |
| Becas Activas | 300 | Ver y gestionar |
| Casos Abiertos | 15 | Ver y gestionar |
| Reportes Generados | 25 | Ver y generar |
| Usuarios del Sistema | 10 | Gestionar |

### Diseño de la Interfaz

```
┌────────────────────────────────────────────────────────────────────────┐
│ Bienestar Universitario   Dashboard  Estudiantes  Solicitudes  ...     │
├────────────────────────────────────────────────────────────────────────┤
│ Dashboard Principal                                                     │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│  │Estudiantes Reg. │  │Solicitudes Pend.│  │Citas Programadas│        │
│  │     1,234       │  │      45         │  │      120        │        │
│  │ [Ver y gestionar]│ │ [Ver y gestionar]│ │ [Ver y gestionar]│       │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│  │  Becas Activas  │  │  Casos Abiertos │  │Reportes Generados│       │
│  │      300        │  │      15         │  │       25        │        │
│  │ [Ver y gestionar]│ │ [Ver y gestionar]│ │  [Ver y generar] │       │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                         │
│  ┌─────────────────┐                                                    │
│  │Usuarios Sistema │                                                    │
│  │      10         │                                                    │
│  │   [Gestionar]   │                                                    │
│  └─────────────────┘                                                    │
└────────────────────────────────────────────────────────────────────────┘
```

### Funcionalidades Clave
- Visualización de KPIs en tiempo real
- Acceso directo a cada módulo desde las tarjetas de métricas
- Resumen ejecutivo del estado operativo del departamento

---

## 1.2 Gestión de Estudiantes

### Descripción
Módulo que permite al administrador **registrar, consultar, editar y eliminar** información de los estudiantes en el sistema.

### Funciones Principales
- **Registrar** nuevo estudiante
- **Buscar** estudiante por nombre o código
- **Editar** datos del estudiante
- **Ver** historial completo de atenciones
- **Eliminar** registro de estudiante

### Campos de la Tabla de Estudiantes

| Campo | Descripción |
|-------|-------------|
| ID | Identificador único del estudiante |
| Nombre Completo | Nombres y apellidos del estudiante |
| Código | Código universitario (ej: 20210001) |
| Carrera | Carrera en la que está inscrito |
| Estado | Activo / Inactivo |
| Acciones | Botones: Ver · Editar · Eliminar |

### Diseño de la Interfaz

```
┌────────────────────────────────────────────────────────────────────────┐
│ Bienestar Universitario   Dashboard  Estudiantes  Solicitudes  ...     │
├────────────────────────────────────────────────────────────────────────┤
│ Gestión de Estudiantes                                                  │
│ Permite registrar, buscar y actualizar la información de estudiantes.   │
│                                                                         │
│  [Buscar estudiante...]  [Buscar]          [+ Registrar Nuevo Estudiante]│
│                                                                         │
│  ID  │ Nombre Completo   │ Código   │ Carrera               │ Estado  │
│  ────┼───────────────────┼──────────┼───────────────────────┼─────────│
│  101 │ Juan Pérez García │ 20210001 │ Ingeniería de Sistemas│ Activo  │
│  102 │ María López Díaz  │ 20200015 │ Psicología            │ Activo  │
│  103 │ Carlos Ruiz Soto  │ 20220003 │ Derecho               │ Activo  │
│      │                   │          │   [Ver] [Editar] [Eliminar]       │
└────────────────────────────────────────────────────────────────────────┘
```

### Datos del Formulario de Registro
- Nombre completo
- Código universitario
- Carrera
- Correo electrónico institucional
- Estado (Activo / Inactivo)

---

## 1.3 Gestión de Solicitudes de Atención

### Descripción
Módulo que permite al administrador **gestionar las solicitudes de atención** presentadas por los estudiantes. Las solicitudes pueden ser de tipo psicológico, médico, social o académico.

### Tipos de Atención Disponibles
- 🧠 Psicológica
- 🏥 Médica
- 🤝 Social
- 📚 Académica

### Estados de una Solicitud

| Estado | Descripción |
|--------|-------------|
| Pendiente | Solicitud recibida, sin gestionar |
| En Proceso | Solicitud siendo atendida |
| Completada | Solicitud resuelta |

### Campos de la Tabla de Solicitudes

| Campo | Descripción |
|-------|-------------|
| ID | Identificador de la solicitud |
| Estudiante | Nombre del estudiante solicitante |
| Tipo de Atención | Psicológica / Médica / Social / Académica |
| Fecha de Solicitud | Fecha en que fue enviada |
| Estado | Pendiente / En Proceso / Completada |
| Acciones | Ver · Editar |

### Filtros Disponibles
- Búsqueda por nombre de estudiante
- Filtro por tipo de atención
- Filtro por estado

### Diseño de la Interfaz

```
┌────────────────────────────────────────────────────────────────────────┐
│ Bienestar Universitario   Dashboard  Estudiantes  Solicitudes  ...     │
├────────────────────────────────────────────────────────────────────────┤
│ Gestión de Solicitudes de Atención                                      │
│ Administra las solicitudes de atención realizadas por los estudiantes.  │
│                                                                         │
│ Listado de Solicitudes                              [+ Nueva Solicitud] │
│                                                                         │
│ Estudiante:            Tipo de Atención:   Estado:                      │
│ [Buscar estudiante...] [Seleccionar... ▼]  [Seleccionar... ▼] [Filtrar] │
│                                                                         │
│  ID  │ Estudiante    │ Tipo Atención │ Fecha Solicitud │ Estado     │   │
│  ────┼───────────────┼───────────────┼─────────────────┼────────────│   │
│  001 │ Juan Pérez    │ Psicológica   │ 2026-10-26      │ Pendiente  │   │
│  002 │ María García  │ Médica        │ 2026-10-25      │ En Proceso │   │
│  003 │ Carlos López  │ Académica     │ 2026-10-24      │ Completada │   │
│      │               │               │  [👁 Ver] [✏ Editar]            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1.4 Gestión de Citas

### Descripción
Módulo para **programar, modificar y cancelar citas** médicas o psicológicas de los estudiantes con los profesionales del departamento.

### Funciones Principales
- Crear nueva cita
- Asignar profesional y horario
- Filtrar por estudiante, profesional, fecha y estado
- Editar cita existente
- Cancelar cita

### Tipos de Citas
- 🏥 Médica
- 🧠 Psicológica

### Estados de una Cita

| Estado | Descripción |
|--------|-------------|
| Programada | Cita agendada y confirmada |
| Completada | Cita realizada con éxito |
| Cancelada | Cita cancelada |

### Campos de la Tabla de Citas

| Campo | Descripción |
|-------|-------------|
| Estudiante | Nombre del estudiante |
| Profesional | Doctor o profesional asignado |
| Fecha | Fecha de la cita (YYYY-MM-DD) |
| Hora | Hora programada |
| Tipo | Médica / Psicológica |
| Estado | Programada / Completada / Cancelada |
| Acciones | Editar · Cancelar |

### Filtros Disponibles
- Estudiante
- Profesional (Seleccionar)
- Fecha (mm/dd/yyyy)
- Estado

### Diseño de la Interfaz

```
┌────────────────────────────────────────────────────────────────────────┐
│ Bienestar Universitario   Dashboard  Estudiantes  Solicitudes  ...     │
├────────────────────────────────────────────────────────────────────────┤
│ Gestión de Citas                                                        │
│ Permite programar, modificar y cancelar citas para los estudiantes.     │
│                                                                         │
│ Listado de Citas                                        [+ Nueva Cita] │
│                                                                         │
│ Estudiante:   Profesional:          Fecha:           Estado:            │
│ [___________] [Seleccionar... ▼]    [mm/dd/yyyy 📅]  [Seleccionar ▼] [Filtrar]│
│                                                                         │
│  Estudiante     │ Profesional     │ Fecha      │ Hora     │ Tipo       │
│  ───────────────┼─────────────────┼────────────┼──────────┼────────────│
│  Maria López    │ Dr. Juan Pérez  │ 2023-10-26 │ 10:00 AM │ Médica     │
│  Carlos García  │ Lic. Ana García │ 2023-10-27 │ 02:30 PM │ Psicológica│
│  Laura Rodríguez│ Dr. Juan Pérez  │ 2023-10-28 │ 09:00 AM │ Médica     │
│                 │                 │            │   [✏ Editar] [✖ Cancelar]│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1.5 Gestión de Becas y Ayudas Económicas

### Descripción
Módulo para **registrar, evaluar, aprobar o rechazar** solicitudes de becas y apoyos financieros destinados a los estudiantes con necesidades económicas o de alto rendimiento académico.

### Funciones Principales
- Registrar nueva beca
- Evaluar solicitud de beca
- Aprobar o rechazar solicitud
- Editar detalles de una beca existente
- Eliminar beca

### Tipos de Beca

| Tipo | Descripción |
|------|-------------|
| Mérito | Basada en rendimiento académico |
| Necesidad | Basada en condición socioeconómica |

### Estados de una Beca

| Estado | Descripción |
|--------|-------------|
| Activa | Beca vigente y asignada |
| Inactiva | Beca suspendida o finalizada |

### Campos del Listado de Becas

| Campo | Descripción |
|-------|-------------|
| Nombre de la Beca | Denominación de la beca |
| Tipo | Mérito / Necesidad |
| Monto | Valor en dólares (ej: $150) |
| Criterios | Requisitos para acceder (ej: Promedio > 9.8) |
| Estado | Activa / Inactiva |
| Acciones | Editar · Eliminar |

### Campos del Formulario de Detalle de Beca
- Nombre de la Beca
- Tipo (Mérito / Necesidad)
- Monto ($)
- Criterios de Elegibilidad
- Estado (Activa / Inactiva)
- Botones: **Cancelar** · **Guardar Cambios**

### Diseño de la Interfaz

```
┌────────────────────────────────────────────────────────────────────────┐
│ Gestión de Becas                                                        │
│ Administra el proceso de solicitud, aprobación y seguimiento de becas.  │
│                                                                         │
│ Listado de Becas                                        [+ Nueva Beca] │
│                                                                         │
│  Nombre de la Beca             │ Tipo      │ Monto │ Criterios         │
│  ──────────────────────────────┼───────────┼───────┼───────────────────│
│  Beca de Excelencia Académica  │ Mérito    │ $150  │ Promedio = 9.8    │
│  Beca de Apoyo Socioeconómico  │ Necesidad │ $80   │ Ingresos bajos    │
│  Beca de Investigación         │ Mérito    │ $150  │ Part. en proyectos│
│                                                                         │
│ Detalles de Beca                                                        │
│  Nombre: [Beca de Excelencia Académica   ]  Tipo: [Mérito          ▼] │
│  Monto:  [$1,000                         ]  Criterios: [Promedio > 8.5]│
│  Estado: [Activa ▼]                                                     │
│                                         [Cancelar]  [Guardar Cambios]  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1.6 Seguimiento de Casos

### Descripción
Módulo que permite al administrador **monitorear y gestionar casos de estudiantes** que requieren atención continua, seguimiento personalizado o intervención prolongada por parte del departamento.

### Funciones Principales
- Crear nuevo caso
- Buscar caso por ID o nombre de estudiante
- Ver detalles del caso
- Editar información del caso
- Registrar actualizaciones y evolución

### Tipos de Riesgo

| Tipo | Descripción |
|------|-------------|
| Académico | Bajo rendimiento, deserción |
| Personal | Problemas familiares, emocionales |
| Social | Situaciones de vulnerabilidad social |
| Económico | Dificultades financieras |

### Estados de un Caso

| Estado | Descripción |
|--------|-------------|
| Activo | Caso en seguimiento activo |
| Cerrado | Caso resuelto y cerrado |

### Campos de la Tabla de Casos

| Campo | Descripción |
|-------|-------------|
| ID Caso | Identificador único |
| Estudiante | Nombre del estudiante involucrado |
| Tipo de Riesgo | Académico / Personal / Social / Económico |
| Estado | Activo / Cerrado |
| Fecha de Inicio | Fecha de apertura del caso |
| Última Actualización | Fecha de la última modificación |
| Acciones | Ver · Editar |

### Diseño de la Interfaz

```
┌────────────────────────────────────────────────────────────────────────┐
│ Bienestar Universitario   Dashboard  Estudiantes  ...  Casos  ...      │
├────────────────────────────────────────────────────────────────────────┤
│ Seguimiento de Casos                                                    │
│                                                                         │
│  [Buscar caso...]                                      [Nuevo Caso]    │
│                                                                         │
│  ID Caso │ Estudiante    │ Tipo de Riesgo │ Estado  │ F. Inicio  │     │
│  ────────┼───────────────┼───────────────┼─────────┼────────────│     │
│  001     │ Juan Pérez    │ Académico      │ Activo  │ 2026-05-01 │     │
│  002     │ María García  │ Personal       │ Cerrado │ 2026-05-10 │     │
│  003     │ Carlos López  │ Académico      │ Activo  │ 2026-05-12 │     │
│          │               │                │         │  [Ver] [Editar]  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1.7 Reportes y Estadísticas

### Descripción
Módulo que permite al administrador **generar, visualizar y descargar reportes** sobre las actividades del departamento, así como ver estadísticas rápidas del sistema.

### Secciones del Módulo

#### a) Generar Reporte
- **Tipo de Reporte:** Seleccionar (Solicitudes, Becas, Casos, Estudiantes, etc.)
- **Rango de Fechas:** Ej: 01/01/2023 - 31/12/2026
- Botón: **[Generar]**

#### b) Estadísticas Rápidas
Muestra datos globales inmediatos:
- Total de Estudiantes Registrados
- Solicitudes Pendientes
- Citas Programadas (Próxima Semana)
- Becas Activas

#### c) Visualización de Datos
- Gráfico de distribución de solicitudes por tipo

#### d) Reportes Guardados
Listado de reportes previamente generados:

| Nombre del Reporte | Tipo | Generado Por | Fecha | Acciones |
|--------------------|------|--------------|-------|----------|
| Reporte Anual de Solicitudes 2025 | Solicitudes | Admin Uno | 2026-05-12 | Ver · Descargar |
| Estudiantes con Becas Activas | Becas | Admin Dos | 2026-05-12 | Ver · Descargar |
| Casos Cerrados 2025-2 | Casos | Admin Uno | 2026-05-12 | Ver · Descargar |

### Tipos de Reportes Disponibles
- Reporte de Solicitudes
- Reporte de Becas
- Reporte de Citas
- Reporte de Casos
- Reporte de Estudiantes

---

## 1.8 Administración de Usuarios

### Descripción
Módulo exclusivo del administrador para **gestionar los usuarios del sistema**, incluyendo administradores, personal del departamento y estudiantes con acceso.

### Funciones Principales
- Agregar nuevo usuario
- Buscar usuario por nombre
- Editar rol y datos del usuario
- Activar / Desactivar usuario
- Eliminar usuario

### Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| Administrador | Acceso total al sistema |
| Personal | Acceso a módulos operativos |
| Estudiante | Acceso únicamente a módulos del portal estudiantil |

### Campos de la Tabla de Usuarios

| Campo | Descripción |
|-------|-------------|
| Nombre | Nombre completo del usuario |
| Email | Correo electrónico (ej: juan.perez@example.com) |
| Rol | Administrador / Personal / Estudiante |
| Estado | Activo / Inactivo |
| Acciones | Editar · Eliminar |

### Diseño de la Interfaz

```
┌────────────────────────────────────────────────────────────────────────┐
│ Bienestar Universitario   ...  Usuarios                                 │
├────────────────────────────────────────────────────────────────────────┤
│ Administración de Usuarios                                              │
│                                                                         │
│  [Buscar usuario...]                            [+ Nuevo Usuario]      │
│                                                                         │
│  Nombre       │ Email                    │ Rol           │ Estado      │
│  ─────────────┼──────────────────────────┼───────────────┼─────────────│
│  Juan Pérez   │ juan.perez@example.com   │ Administrador │ Activo      │
│  María García │ maria.garcia@example.com │ Personal      │ Activo      │
│  Carlos López │ carlos.lopez@example.com │ Estudiante    │ Inactivo    │
│               │                          │               │ [✏] [🗑]    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1.9 Mis Solicitudes (Vista Estudiante)

### Descripción
Portal estudiantil donde los estudiantes pueden **ver y administrar sus propias solicitudes** de atención realizadas al Departamento de Bienestar Universitario.

### Funciones Disponibles para el Estudiante
- Ver listado de solicitudes propias
- Ver detalle de una solicitud
- Editar solicitud (si está pendiente)
- Crear nueva solicitud

### Estados de Solicitudes (Vista Estudiante)

| Estado | Descripción |
|--------|-------------|
| Pendiente | Aún no ha sido atendida |
| Aprobada | Fue aceptada por el departamento |
| En Proceso | Actualmente en atención |
| Rechazada | No fue aceptada |

### Campos de la Tabla de Mis Solicitudes

| Campo | Descripción |
|-------|-------------|
| Tipo de Solicitud | Tipo de ayuda requerida |
| Fecha | Fecha de envío |
| Estado | Estado actual |
| Acciones | Ver · Editar |

### Diseño de la Interfaz

```
┌────────────────────────────────────────────────────────────────────────┐
│ Bienestar Estudiantil    Mis Solicitudes  Mis Citas  Mis Becas  Nueva  │
├────────────────────────────────────────────────────────────────────────┤
│ Mis Solicitudes                                        [Crear nueva]   │
│                                                                         │
│  Tipo de Solicitud    │ Fecha      │ Estado     │ Acciones             │
│  ─────────────────────┼────────────┼────────────┼──────────────────────│
│  Ayuda Psicológica    │ 2026-05-12 │ Pendiente  │ [Ver] [Editar]       │
│  Beca Alimenticia     │ 2026-05-12 │ Aprobada   │ [Ver] [Editar]       │
│  Asesoría Académica   │ 2026-05-12 │ En Proceso │ [Ver] [Editar]       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1.10 Formulario de Nueva Solicitud (Vista Estudiante)

### Descripción
Formulario mediante el cual los estudiantes pueden **crear una nueva solicitud de atención** dirigida al Departamento de Bienestar Universitario de la ULEAM.

### Campos del Formulario

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Tipo de Atención | Dropdown | Psicológica / Médica / Social / Académica |
| Asunto | Texto corto | Título breve del motivo de la solicitud |
| Descripción Detallada | Texto largo | Explicación completa de la situación |
| Documento de respaldo (opcional) | Carga de archivo | Formatos: pdf, png, docx |

### Botones de Acción
- **[Cancelar]** — Descarta el formulario y regresa al listado
- **[Enviar Solicitud]** — Envía la solicitud al sistema

### Validaciones del Formulario
- El tipo de atención es obligatorio
- El asunto es obligatorio
- La descripción debe tener un mínimo de caracteres
- Los documentos de respaldo son opcionales (formatos: .pdf, .png, .docx)

### Diseño de la Interfaz

```
┌────────────────────────────────────────────────────────────────────────┐
│ Bienestar Estudiantil    Mis Solicitudes  Mis Citas  Mis Becas  Nueva  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│              ┌──────────────────────────────────────┐                  │
│              │   Formulario de Solicitud de Atención │                 │
│              │                                        │                 │
│              │  Tipo de Atención:                     │                 │
│              │  [Seleccionar...                    ▼] │                 │
│              │                                        │                 │
│              │  Asunto:                               │                 │
│              │  [                                   ] │                 │
│              │                                        │                 │
│              │  Descripción Detallada:                │                 │
│              │  [                                   ] │                 │
│              │  [                                   ] │                 │
│              │  [                                   ] │                 │
│              │                                        │                 │
│              │  Documento de respaldo (opcional)      │                 │
│              │              [📎 +]                    │                 │
│              │       Formatos: pdf, png, docx         │                 │
│              │                                        │                 │
│              │      [Cancelar]  [Enviar Solicitud]    │                 │
│              └──────────────────────────────────────┘                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Resumen de Roles y Permisos

| Módulo | Administrador | Estudiante |
|--------|:-------------:|:----------:|
| Dashboard Principal | ✅ | ❌ |
| Gestión de Estudiantes | ✅ | ❌ |
| Gestión de Solicitudes | ✅ | ❌ |
| Gestión de Citas | ✅ | ❌ |
| Gestión de Becas | ✅ | ❌ |
| Seguimiento de Casos | ✅ | ❌ |
| Reportes y Estadísticas | ✅ | ❌ |
| Administración de Usuarios | ✅ | ❌ |
| Mis Solicitudes | ❌ | ✅ |
| Nueva Solicitud (Formulario) | ❌ | ✅ |

---

## Paleta de Colores del Sistema

| Elemento | Color |
|----------|-------|
| Color Primario (botones principales) | Azul — `#1976D2` |
| Color de Alerta / Eliminar | Rojo — `#D32F2F` |
| Color de Éxito / Activo | Verde — `#388E3C` |
| Color de Advertencia / Pendiente | Naranja — `#F57C00` |
| Fondo de tarjetas | Blanco — `#FFFFFF` |
| Fondo general | Gris claro — `#F5F5F5` |
| Texto principal | Gris oscuro — `#212121` |

---

## Tecnologías Sugeridas para Implementación

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript / React |
| Estilos | Bootstrap 5 / Tailwind CSS |
| Backend | Java (Spring Boot) / PHP / Node.js |
| Base de Datos | MySQL / PostgreSQL |
| Control de Versiones | Git / GitHub |

---

## Conclusión

El **Software de Gestión del Departamento de Bienestar Universitario de la ULEAM** presenta un conjunto completo de interfaces que cubren todos los procesos del departamento: desde el registro y seguimiento de estudiantes, hasta la gestión de becas, citas y reportes estadísticos. El diseño está orientado a dos tipos de usuarios (administrador y estudiante), con accesos diferenciados que garantizan la seguridad y pertinencia de la información presentada.

Las interfaces diseñadas siguen principios de usabilidad clara, con navegación intuitiva, tablas con filtros y formularios bien estructurados que facilitan la operación diaria del personal del departamento.

---

*Documento elaborado para la materia de Programación Orientada a Objetos — ULEAM 2026*
