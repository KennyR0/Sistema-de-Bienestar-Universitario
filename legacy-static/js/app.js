const STORAGE_KEYS = {
    solicitudes: 'uleam_solicitudes',
    becas: 'uleam_becas'
};

const seedSolicitudes = [
    { id: '001', estudiante: 'Juan Pérez', tipo: 'Psicológica', asunto: 'Seguimiento', fecha: '2026-10-26', estado: 'Pendiente' },
    { id: '002', estudiante: 'María García', tipo: 'Médica', asunto: 'Consulta', fecha: '2026-10-25', estado: 'En Proceso' },
    { id: '003', estudiante: 'Carlos López', tipo: 'Académica', asunto: 'Asesoría', fecha: '2026-10-24', estado: 'Completada' }
];

const seedBecas = [
    { id: 'B-001', nombre: 'Beca de Excelencia Académica', tipo: 'Mérito', monto: 150, criterios: 'Promedio = 9.8', estado: 'Activa' },
    { id: 'B-002', nombre: 'Beca de Apoyo Socioeconómico', tipo: 'Necesidad', monto: 80, criterios: 'Ingresos bajos', estado: 'Activa' }
];

document.addEventListener('DOMContentLoaded', () => {
    initSolicitudForm();
    initBecaForm();
    renderSolicitudesTable('solicitudes-table-body', false);
    renderSolicitudesTable('admin-solicitudes-table-body', true);
    renderBecasTable();
});

function initSolicitudForm() {
    const nuevaSolicitudForm = document.getElementById('form-nueva-solicitud');
    if (!nuevaSolicitudForm) {
        return;
    }

    nuevaSolicitudForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        const tipoAtencion = document.getElementById('tipo_atencion');
        if (tipoAtencion.value === '') {
            mostrarError(tipoAtencion, 'Debe seleccionar un tipo de atención.');
            valid = false;
        } else {
            limpiarError(tipoAtencion);
        }

        const asunto = document.getElementById('asunto');
        if (asunto.value.trim() === '') {
            mostrarError(asunto, 'El asunto es obligatorio.');
            valid = false;
        } else {
            limpiarError(asunto);
        }

        const descripcion = document.getElementById('descripcion');
        if (descripcion.value.trim().length < 20) {
            mostrarError(descripcion, 'La descripción debe tener al menos 20 caracteres.');
            valid = false;
        } else {
            limpiarError(descripcion);
        }

        const archivo = document.getElementById('archivo');
        if (archivo.files.length > 0) {
            const allowedExtensions = ['pdf', 'png', 'docx'];
            const file = archivo.files[0];
            const ext = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(ext)) {
                mostrarError(archivo, 'Formato no permitido. Solo pdf, png, docx.');
                valid = false;
            } else {
                limpiarError(archivo);
            }
        } else {
            limpiarError(archivo);
        }

        if (!valid) {
            return;
        }

        const solicitudes = getStoredList(STORAGE_KEYS.solicitudes, seedSolicitudes);
        const nuevaSolicitud = {
            id: nextSolicitudId(solicitudes),
            estudiante: 'Estudiante Actual',
            tipo: formatTipoAtencion(tipoAtencion.value),
            asunto: asunto.value.trim(),
            fecha: new Date().toISOString().slice(0, 10),
            estado: 'Pendiente'
        };

        solicitudes.push(nuevaSolicitud);
        setStoredList(STORAGE_KEYS.solicitudes, solicitudes);

        alert('Solicitud enviada correctamente!');
        window.location.href = 'estudiante_solicitudes.html';
    });
}

function initBecaForm() {
    const nuevaBecaForm = document.getElementById('form-nueva-beca');
    if (!nuevaBecaForm) {
        return;
    }

    nuevaBecaForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        const nombre = document.getElementById('beca_nombre');
        const tipo = document.getElementById('beca_tipo');
        const monto = document.getElementById('beca_monto');
        const criterios = document.getElementById('beca_criterios');
        const estado = document.getElementById('beca_estado');

        if (nombre.value.trim() === '') {
            mostrarError(nombre, 'El nombre de la beca es obligatorio.');
            valid = false;
        } else {
            limpiarError(nombre);
        }

        if (tipo.value === '') {
            mostrarError(tipo, 'Seleccione el tipo de beca.');
            valid = false;
        } else {
            limpiarError(tipo);
        }

        const montoValue = parseAmount(monto.value);
        if (Number.isNaN(montoValue) || montoValue <= 0) {
            mostrarError(monto, 'Ingrese un monto válido.');
            valid = false;
        } else {
            limpiarError(monto);
        }

        if (criterios.value.trim().length < 5) {
            mostrarError(criterios, 'Ingrese criterios claros (mín. 5 caracteres).');
            valid = false;
        } else {
            limpiarError(criterios);
        }

        if (estado.value === '') {
            mostrarError(estado, 'Seleccione el estado de la beca.');
            valid = false;
        } else {
            limpiarError(estado);
        }

        if (!valid) {
            return;
        }

        const becas = getStoredList(STORAGE_KEYS.becas, seedBecas);
        const nuevaBeca = {
            id: nextBecaId(becas),
            nombre: nombre.value.trim(),
            tipo: tipo.value,
            monto: montoValue,
            criterios: criterios.value.trim(),
            estado: estado.value
        };

        becas.push(nuevaBeca);
        setStoredList(STORAGE_KEYS.becas, becas);
        renderBecasTable();
        nuevaBecaForm.reset();
        alert('Beca registrada correctamente!');
    });
}

function renderSolicitudesTable(tbodyId, showStudent) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) {
        return;
    }

    const solicitudes = getStoredList(STORAGE_KEYS.solicitudes, seedSolicitudes);
    tbody.innerHTML = '';

    solicitudes.forEach((solicitud) => {
        const row = document.createElement('tr');
        const estadoBadge = getEstadoBadgeClass(solicitud.estado);
        const acciones = showStudent
            ? `<button class="btn btn-outline">Ver</button>
               <button class="btn btn-outline" ${solicitud.estado !== 'Pendiente' ? 'disabled' : ''}>Editar</button>`
            : `<button class="btn btn-outline">Ver</button>
               <button class="btn btn-outline">Editar</button>`;

        if (showStudent) {
            row.innerHTML = `
                <td>${solicitud.tipo}</td>
                <td>${solicitud.fecha}</td>
                <td><span class="badge ${estadoBadge}">${solicitud.estado}</span></td>
                <td>${acciones}</td>
            `;
        } else {
            row.innerHTML = `
                <td>${solicitud.id}</td>
                <td>${solicitud.estudiante}</td>
                <td>${solicitud.tipo}</td>
                <td>${solicitud.fecha}</td>
                <td><span class="badge ${estadoBadge}">${solicitud.estado}</span></td>
                <td>${acciones}</td>
            `;
        }

        tbody.appendChild(row);
    });
}

function renderBecasTable() {
    const tbody = document.getElementById('becas-table-body');
    if (!tbody) {
        return;
    }

    const becas = getStoredList(STORAGE_KEYS.becas, seedBecas);
    tbody.innerHTML = '';

    becas.forEach((beca) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${beca.nombre}</td>
            <td>${beca.tipo}</td>
            <td>${formatMoney(beca.monto)}</td>
            <td>${beca.criterios}</td>
            <td>
                <button class="btn btn-outline">Editar</button>
                <button class="btn btn-danger" onclick="confirmarEliminacion()">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function mostrarError(input, mensaje) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) {
        return;
    }
    formGroup.classList.add('error');
    const mensajeError = formGroup.querySelector('.error-message');
    if (mensajeError) {
        mensajeError.textContent = mensaje;
    }
}

function limpiarError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) {
        return;
    }
    formGroup.classList.remove('error');
}

function getStoredList(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return [...fallback];
    }

    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed;
        }

    } catch (error) {
        localStorage.setItem(key, JSON.stringify(fallback));
    }

    return [...fallback];
}

function setStoredList(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function nextSolicitudId(list) {
    const maxId = list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    return String(maxId + 1).padStart(3, '0');
}

function nextBecaId(list) {
    const maxId = list.reduce((max, item) => {
        const numeric = Number(String(item.id).replace('B-', '')) || 0;
        return Math.max(max, numeric);
    }, 0);
    const next = String(maxId + 1).padStart(3, '0');
    return `B-${next}`;
}

function formatMoney(value) {
    if (typeof value !== 'number') {
        return value;
    }
    const formatted = value.toFixed(2).replace(/\.00$/, '');
    return `$${formatted}`;
}

function parseAmount(value) {
    const sanitized = value.replace(/[^0-9,\.]/g, '').replace(',', '.');
    return parseFloat(sanitized);
}

function formatTipoAtencion(value) {
    const mapa = {
        Psicologica: 'Psicológica',
        Medica: 'Médica',
        Social: 'Social',
        Academica: 'Académica'
    };
    return mapa[value] || value;
}

function getEstadoBadgeClass(estado) {
    const mapping = {
        Pendiente: 'badge-pending',
        'En Proceso': 'badge-process',
        Completada: 'badge-completed',
        Aprobada: 'badge-active',
        Activa: 'badge-active',
        Inactiva: 'badge-inactive',
        Rechazada: 'badge-rejected',
        Cancelada: 'badge-canceled'
    };

    return mapping[estado] || 'badge-pending';
}

// Funciones globales para botones
function confirmarEliminacion() {
    return confirm('¿Estás seguro de que deseas eliminar este registro?');
}

