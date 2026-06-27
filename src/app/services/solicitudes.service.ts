import { Injectable, inject } from '@angular/core';
import {
	CanalContacto,
	SemestreAcademico,
	Solicitud,
	SolicitudEstado,
	SolicitudHistorial,
	SolicitudPrioridad
} from '../models/solicitud';
import { LocalStorageStoreService } from './local-storage-store.service';

const STORAGE_KEY = 'bienestar:v2:solicitudes';
const DEFAULT_FACULTY = 'Facultad por registrar';
const DEFAULT_SEMESTER: SemestreAcademico = 'Primer semestre';
const TEST_STUDENT = {
	id: 105,
	name: 'Estudiante de Prueba',
	code: '20240001',
	email: 'prueba123@live.uleam.edu.ec',
	faculty: 'Facultad Ciencias de la Vida y Tecnologías',
	program: 'Ingeniería en Software',
	semester: 'Segundo semestre' as SemestreAcademico
};
const LEGACY_SEED_IDS = new Set(['SOL-001', 'SOL-002', 'SOL-003']);
const SEED_SEMESTERS: Record<string, SemestreAcademico> = {
	'SOL-001': 'Primer semestre',
	'SOL-002': 'Segundo semestre',
	'SOL-003': 'Tercer semestre'
};

const SEED_SOLICITUDES: Solicitud[] = [
	{
		id: 'SOL-001',
		studentName: 'Juan Pérez García',
		studentCode: '20210001',
		faculty: 'Facultad Ciencias de la Vida y Tecnologías',
		program: 'Ingeniería de Sistemas',
		semester: 'Primer semestre',
		type: 'Psicológica',
		subject: 'Ansiedad antes de exámenes finales',
		description:
			'El estudiante solicita acompañamiento psicológico por ansiedad, dificultad para dormir y presión académica durante el cierre de semestre.',
		date: '2026-06-10',
		status: 'Pendiente',
		priority: 'Alta',
		contactChannel: 'WhatsApp',
		contactValue: '099 123 4567',
		availability: 'Lunes a jueves, 09:00 - 12:00',
		consent: true,
		assignedProfessional: 'Sin asignar',
		nextAction: 'Realizar triage y asignar cita psicológica',
		observations: 'Caso sensible por estrés académico recurrente.',
		attachments: [
			{ id: 'att-001', name: 'informe_tutor.pdf', type: 'PDF', size: '240 KB' }
		],
		history: [
			{
				id: 'hist-001',
				date: '2026-06-10',
				title: 'Solicitud recibida',
				detail: 'El estudiante registró la solicitud desde el portal estudiantil.',
				author: 'Portal estudiante'
			}
		]
	},
	{
		id: 'SOL-002',
		studentName: 'María García López',
		studentCode: '20200015',
		faculty: 'Facultad de Trabajo Social',
		program: 'Psicología',
		semester: 'Segundo semestre',
		type: 'Social',
		subject: 'Evaluación para apoyo socioeconómico',
		description:
			'La estudiante solicita revisión de su situación familiar para acceder a apoyo de bienestar universitario.',
		date: '2026-06-09',
		status: 'En Proceso',
		priority: 'Media',
		contactChannel: 'Correo institucional',
		contactValue: 'maria.garcia@uleam.edu.ec',
		availability: 'Martes y viernes después de las 14:00',
		consent: true,
		assignedProfessional: 'Trab. Soc. Andrea Zambrano',
		nextAction: 'Revisar documentación socioeconómica',
		observations: 'Documentos iniciales completos.',
		attachments: [
			{ id: 'att-002', name: 'declaracion_ingresos.pdf', type: 'PDF', size: '310 KB' }
		],
		history: [
			{
				id: 'hist-002',
				date: '2026-06-09',
				title: 'Solicitud recibida',
				detail: 'Registro inicial desde ventanilla de bienestar.',
				author: 'Admin Uno'
			},
			{
				id: 'hist-003',
				date: '2026-06-10',
				title: 'En revisión',
				detail: 'Se asignó revisión socioeconómica.',
				author: 'Trab. Soc. Andrea Zambrano'
			}
		]
	},
	{
		id: 'SOL-003',
		studentName: 'Carlos López Soto',
		studentCode: '20220003',
		faculty: 'Facultad de Jurisprudencia',
		program: 'Derecho',
		semester: 'Tercer semestre',
		type: 'Académica',
		subject: 'Orientación por riesgo de pérdida de asignatura',
		description:
			'El estudiante solicita orientación académica y derivación con tutor por bajo rendimiento en dos asignaturas.',
		date: '2026-06-08',
		status: 'Completada',
		priority: 'Baja',
		contactChannel: 'Teléfono',
		contactValue: '098 222 7788',
		availability: 'Miércoles, 10:00 - 12:00',
		consent: true,
		assignedProfessional: 'Coord. Acad. Luis Vera',
		nextAction: 'Caso cerrado con plan de tutoría',
		observations: 'Se coordinó tutoría académica.',
		attachments: [],
		history: [
			{
				id: 'hist-004',
				date: '2026-06-08',
				title: 'Solicitud recibida',
				detail: 'Solicitud académica registrada.',
				author: 'Portal estudiante'
			},
			{
				id: 'hist-005',
				date: '2026-06-11',
				title: 'Caso completado',
				detail: 'Se derivó a tutoría y se notificó al estudiante.',
				author: 'Coord. Acad. Luis Vera'
			}
		]
	}
];

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
	private readonly store = inject(LocalStorageStoreService);
	private readonly solicitudes = this.store.createCollection<Solicitud>(
		STORAGE_KEY,
		SEED_SOLICITUDES
	);

	constructor() {
		// Ajusta solicitudes ya guardadas cuando el modelo gana campos nuevos.
		this.normalizeStoredSolicitudes();
	}

	getSolicitudes() {
		return this.solicitudes.asReadonly();
	}

	addSolicitud(solicitud: Solicitud) {
		this.solicitudes.update((list) => {
			const next = [{ ...solicitud }, ...list];
			this.persist(next);
			return next;
		});
	}

	updateSolicitud(original: Solicitud, updated: Solicitud) {
		this.solicitudes.update((list) => {
			const next = list.map((item) => (item.id === original.id ? { ...updated } : item));
			this.persist(next);
			return next;
		});
	}

	transitionSolicitud(
		target: Solicitud,
		status: SolicitudEstado,
		detail: string,
		author = 'Bienestar Universitario'
	) {
		this.updateSolicitud(target, {
			...target,
			status,
			history: [this.createHistory(`Estado: ${status}`, detail, author), ...target.history]
		});
	}

	addHistory(target: Solicitud, title: string, detail: string, author = 'Bienestar Universitario') {
		this.updateSolicitud(target, {
			...target,
			history: [this.createHistory(title, detail, author), ...target.history]
		});
	}

	deleteSolicitud(target: Solicitud) {
		this.solicitudes.update((list) => {
			const next = list.filter((item) => item.id !== target.id);
			this.persist(next);
			return next;
		});
	}

	createSolicitud(input: {
		studentId?: number;
		studentName: string;
		studentCode: string;
		studentEmail?: string;
		faculty: string;
		program: string;
		semester: SemestreAcademico;
		type: Solicitud['type'];
		subject: string;
		description: string;
		priority: SolicitudPrioridad;
		contactChannel: CanalContacto;
		contactValue: string;
		availability: string;
		attachments: Solicitud['attachments'];
		consent: boolean;
	}): Solicitud {
		// Centraliza los valores administrativos que toda solicitud nueva debe traer.
		return {
			id: this.getNextId(),
			...input,
			faculty: input.faculty.trim() || DEFAULT_FACULTY,
			semester: input.semester || DEFAULT_SEMESTER,
			date: new Date().toISOString().slice(0, 10),
			status: 'Pendiente',
			assignedProfessional: 'Sin asignar',
			nextAction: 'Revisar información y definir ruta de atención',
			observations: '',
			history: [
				this.createHistory(
					'Solicitud recibida',
					'El estudiante registró una nueva solicitud desde el portal estudiantil.',
					'Portal estudiante'
				)
			]
		};
	}

	getNextId(): string {
		const maxId = Math.max(
			0,
			...this.solicitudes().map((item) => Number(item.id.replace(/\D/g, '')) || 0)
		);
		return `SOL-${String(maxId + 1).padStart(3, '0')}`;
	}

	private createHistory(title: string, detail: string, author: string): SolicitudHistorial {
		return {
			id: `hist-${Date.now()}-${Math.round(Math.random() * 1000)}`,
			date: new Date().toISOString().slice(0, 10),
			title,
			detail,
			author
		};
	}

	private persist(value: Solicitud[]) {
		this.store.saveCollection(STORAGE_KEY, value);
	}

	private normalizeStoredSolicitudes(): void {
		// Conserva compatibilidad con datos antiguos sin borrar solicitudes creadas por el usuario.
		this.solicitudes.update((list) => {
			let changed = false;
			const next = list.map((item) => {
				const seededSemester = SEED_SEMESTERS[item.id];
				const normalized = {
					...item,
					faculty: item.faculty?.trim() || this.getFallbackFaculty(item),
					semester: item.semester || seededSemester || DEFAULT_SEMESTER
				};

				if (LEGACY_SEED_IDS.has(item.id)) {
					// Las solicitudes semilla se reasignan al estudiante de prueba para poblar su portal.
					normalized.studentId = TEST_STUDENT.id;
					normalized.studentName = TEST_STUDENT.name;
					normalized.studentCode = TEST_STUDENT.code;
					normalized.studentEmail = TEST_STUDENT.email;
					normalized.faculty = TEST_STUDENT.faculty;
					normalized.program = TEST_STUDENT.program;
					normalized.semester = seededSemester ?? TEST_STUDENT.semester;
				}

				if (
					normalized.studentId !== item.studentId ||
					normalized.studentName !== item.studentName ||
					normalized.studentCode !== item.studentCode ||
					normalized.studentEmail !== item.studentEmail ||
					normalized.faculty !== item.faculty ||
					normalized.program !== item.program ||
					normalized.semester !== item.semester
				) {
					changed = true;
				}

				return normalized;
			});

			if (changed) {
				this.persist(next);
			}

			return next;
		});
	}

	private getFallbackFaculty(item: Solicitud): string {
		if (item.studentCode === TEST_STUDENT.code || item.studentId === TEST_STUDENT.id) {
			return TEST_STUDENT.faculty;
		}

		return DEFAULT_FACULTY;
	}
}
