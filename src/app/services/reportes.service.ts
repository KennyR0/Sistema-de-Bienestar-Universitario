import { Injectable, computed, inject } from '@angular/core';
import { EstadisticaRapida, ReporteGuardado, ReporteTipo } from '../models/reporte';
import { BecasService } from './becas.service';
import { CitasService } from './citas.service';
import { LocalStorageStoreService } from './local-storage-store.service';
import { SolicitudesService } from './solicitudes.service';
import { StudentsService } from './students.service';

const STORAGE_KEY = 'bienestar:v1:reportes';
const SEED_REPORTES: ReporteGuardado[] = [
	{
		id: 'reporte-001',
		name: 'Reporte Anual de Solicitudes 2025',
		type: 'Solicitudes',
		generatedBy: 'Admin Uno',
		date: '2026-05-12'
	},
	{
		id: 'reporte-002',
		name: 'Estudiantes con Becas Activas',
		type: 'Becas',
		generatedBy: 'Admin Dos',
		date: '2026-05-12'
	},
	{
		id: 'reporte-003',
		name: 'Citas Programadas 2026',
		type: 'Citas',
		generatedBy: 'Admin Uno',
		date: '2026-05-12'
	}
];

@Injectable({ providedIn: 'root' })
export class ReportesService {
	private readonly store = inject(LocalStorageStoreService);
	private readonly students = inject(StudentsService).getStudents();
	private readonly solicitudes = inject(SolicitudesService).getSolicitudes();
	private readonly citas = inject(CitasService).getCitas();
	private readonly becas = inject(BecasService).getBecas();
	private readonly reportes = this.store.createCollection<ReporteGuardado>(
		STORAGE_KEY,
		SEED_REPORTES
	);

	readonly reportTypes: ReporteTipo[] = [
		'Solicitudes',
		'Becas',
		'Casos',
		'Citas',
		'Estudiantes'
	];

	private readonly stats = computed<EstadisticaRapida[]>(() => [
		{ label: 'Estudiantes registrados', value: String(this.students().length) },
		{
			label: 'Solicitudes pendientes',
			value: String(this.solicitudes().filter((item) => item.status === 'Pendiente').length)
		},
		{
			label: 'Citas programadas',
			value: String(this.citas().filter((item) => item.status === 'Programada').length)
		},
		{
			label: 'Becas activas',
			value: String(this.becas().filter((item) => item.status === 'Activa').length)
		}
	]);

	getReportes() {
		return this.reportes.asReadonly();
	}

	getStats() {
		return this.stats;
	}

	addReporte(reporte: ReporteGuardado) {
		this.reportes.update((list) => {
			const next = [{ ...reporte }, ...list];
			this.store.saveCollection(STORAGE_KEY, next);
			return next;
		});
	}

	getNextId(): string {
		return `reporte-${Date.now()}`;
	}
}
