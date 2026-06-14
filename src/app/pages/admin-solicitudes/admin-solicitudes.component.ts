import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	Solicitud,
	SolicitudEstado,
	SolicitudPrioridad,
	SolicitudTipo
} from '../../models/solicitud';
import { Caso } from '../../models/caso';
import { Cita } from '../../models/cita';
import { CasosService } from '../../services/casos.service';
import { CitasService } from '../../services/citas.service';
import { SolicitudesService } from '../../services/solicitudes.service';

const ALL_FILTER = 'Todas';

@Component({
	selector: 'app-admin-solicitudes',
	imports: [CommonModule],
	templateUrl: './admin-solicitudes.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSolicitudesComponent {
	private readonly solicitudesService = inject(SolicitudesService);
	private readonly citasService = inject(CitasService);
	private readonly casosService = inject(CasosService);
	private readonly solicitudes = this.solicitudesService.getSolicitudes();

	searchTerm = signal('');
	typeFilter = signal<string>(ALL_FILTER);
	statusFilter = signal<string>(ALL_FILTER);
	priorityFilter = signal<string>(ALL_FILTER);
	selectedSolicitud = signal<Solicitud | null>(null);
	noteText = signal('');
	appointmentDate = signal(new Date().toISOString().slice(0, 10));
	appointmentTime = signal('09:00');

	readonly typeOptions: Array<SolicitudTipo | typeof ALL_FILTER> = [
		ALL_FILTER,
		'Psicológica',
		'Médica',
		'Social',
		'Académica'
	];
	readonly statusOptions: Array<SolicitudEstado | typeof ALL_FILTER> = [
		ALL_FILTER,
		'Pendiente',
		'Aprobada',
		'En Proceso',
		'Completada',
		'Rechazada'
	];
	readonly priorityOptions: Array<SolicitudPrioridad | typeof ALL_FILTER> = [
		ALL_FILTER,
		'Alta',
		'Media',
		'Baja'
	];

	readonly filteredSolicitudes = computed(() => {
		const term = this.searchTerm().toLowerCase().trim();
		const type = this.typeFilter();
		const status = this.statusFilter();
		const priority = this.priorityFilter();

		return this.solicitudes()
			.filter((item) => {
				const haystack = `${item.studentName} ${item.studentCode} ${item.program} ${item.subject}`
					.toLowerCase()
					.trim();
				return (
					(!term || haystack.includes(term)) &&
					(type === ALL_FILTER || item.type === type) &&
					(status === ALL_FILTER || item.status === status) &&
					(priority === ALL_FILTER || item.priority === priority)
				);
			})
			.sort((a, b) => this.priorityRank(a.priority) - this.priorityRank(b.priority));
	});

	readonly activeSolicitud = computed(() => {
		const selected = this.selectedSolicitud();
		const list = this.filteredSolicitudes();

		if (selected) {
			return this.solicitudes().find((item) => item.id === selected.id) ?? list[0] ?? null;
		}

		return list[0] ?? null;
	});

	readonly summary = computed(() => {
		const list = this.solicitudes();
		return {
			pending: list.filter((item) => item.status === 'Pendiente').length,
			high: list.filter((item) => item.priority === 'Alta').length,
			process: list.filter((item) => item.status === 'En Proceso').length,
			closed: list.filter((item) => item.status === 'Completada').length
		};
	});

	onSearchInput(value: string) {
		this.searchTerm.set(value);
	}

	onTypeChange(value: string) {
		this.typeFilter.set(value || ALL_FILTER);
	}

	onStatusChange(value: string) {
		this.statusFilter.set(value || ALL_FILTER);
	}

	onPriorityChange(value: string) {
		this.priorityFilter.set(value || ALL_FILTER);
	}

	onSelect(item: Solicitud) {
		this.selectedSolicitud.set(item);
		this.noteText.set('');
	}

	onNoteInput(value: string) {
		this.noteText.set(value);
	}

	onAppointmentDateChange(value: string) {
		this.appointmentDate.set(value);
	}

	onAppointmentTimeChange(value: string) {
		this.appointmentTime.set(value);
	}

	onSetStatus(item: Solicitud, status: SolicitudEstado) {
		this.solicitudesService.transitionSolicitud(
			item,
			status,
			`La solicitud cambió a estado ${status}.`
		);
	}

	onAddNote(item: Solicitud) {
		const note = this.noteText().trim();

		if (!note) {
			return;
		}

		this.solicitudesService.addHistory(item, 'Observación registrada', note, 'Equipo Bienestar');
		this.noteText.set('');
	}

	onAssignAppointment(item: Solicitud) {
		const cita: Cita = {
			id: this.citasService.getNextId(),
			studentName: item.studentName,
			professionalName:
				item.assignedProfessional && item.assignedProfessional !== 'Sin asignar'
					? item.assignedProfessional
					: 'Profesional de Bienestar',
			date: this.appointmentDate(),
			time: this.appointmentTime(),
			type: item.type === 'Médica' ? 'Médica' : 'Psicológica',
			status: 'Programada'
		};

		this.citasService.addCita(cita);
		this.solicitudesService.updateSolicitud(item, {
			...item,
			status: 'En Proceso',
			nextAction: `Cita programada para ${cita.date} ${cita.time}`,
			history: [
				{
					id: `hist-${Date.now()}`,
					date: new Date().toISOString().slice(0, 10),
					title: 'Cita asignada',
					detail: `Se programó atención con ${cita.professionalName} para ${cita.date} a las ${cita.time}.`,
					author: 'Equipo Bienestar'
				},
				...item.history
			]
		});
	}

	onOpenCase(item: Solicitud) {
		const caso: Caso = {
			id: this.casosService.getNextId(),
			studentName: item.studentName,
			riskType: item.type === 'Social' ? 'Social' : 'Académico',
			status: 'Activo',
			startDate: new Date().toISOString().slice(0, 10),
			lastUpdate: new Date().toISOString().slice(0, 10)
		};

		this.casosService.addCaso(caso);
		this.solicitudesService.addHistory(
			item,
			'Caso abierto',
			`Se abrió el caso ${caso.id} para seguimiento especializado.`,
			'Equipo Bienestar'
		);
	}

	private priorityRank(priority: SolicitudPrioridad) {
		return { Alta: 0, Media: 1, Baja: 2 }[priority];
	}
}
