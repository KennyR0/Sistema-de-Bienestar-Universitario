# Plan de implementacion - Flujos de edicion

Objetivo: habilitar edicion, vista y eliminacion en formularios inline para los modulos administrativos y estudiantiles, usando estado local en memoria y alineando UI con las plantillas legacy.

## Alcance
- Admin: usuarios, estudiantes, solicitudes, citas, becas, casos, reportes
- Estudiante: solicitudes

## Decisiones
- Formularios inline (sin modales ni rutas nuevas).
- Persistencia en memoria (servicios con update/delete).
- Vista en panel inline para botones "Ver".
- Validacion minima (campos requeridos).

## Progreso
- [x] Servicios con update/delete (usuarios, estudiantes, solicitudes, citas, becas, casos, student-solicitudes)
- [x] Admin usuarios: vista/edicion/eliminacion inline
- [x] Admin estudiantes: vista/edicion/eliminacion inline
- [x] Admin solicitudes: vista/edicion inline
- [x] Admin citas: edicion inline + cancelar (marca "Cancelada")
- [x] Admin becas: edicion/eliminacion inline
- [x] Admin casos: vista/edicion inline
- [x] Admin reportes: vista inline
- [x] Estudiante solicitudes: vista/edicion inline (editar solo Pendiente)
- [x] Estilos base para form-card__header y form-grid

## Verificacion
1. Editar una fila en cada modulo y guardar cambios.
2. Cancelar edicion sin cambios.
3. Ver panel de detalle en modulos con boton "Ver".
4. Eliminar usuarios/becas y confirmar que la tabla se actualiza.
5. Cancelar cita y confirmar que el estado cambia a "Cancelada".
