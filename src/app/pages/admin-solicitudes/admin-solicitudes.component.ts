import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	Solicitud,
	SolicitudEstado,
	SolicitudPrioridad,
	SolicitudTipo
} from '../../models/solicitud';
import { Caso, CasoRiesgo } from '../../models/caso';
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
	caseDialogSolicitud = signal<Solicitud | null>(null);
	caseRisk = signal<CasoRiesgo>('Académico');
	caseNote = signal('');
	operationMessage = signal('');
	noteText = signal('');
	resolutionText = signal('');
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
		'En triage',
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
	readonly caseRiskOptions: CasoRiesgo[] = ['Académico', 'Personal', 'Social', 'Económico'];

	readonly filteredSolicitudes = computed(() => {
		const term = this.searchTerm().toLowerCase().trim();
		const type = this.typeFilter();
		const status = this.statusFilter();
		const priority = this.priorityFilter();

		// La bandeja prioriza urgencias despues de aplicar busqueda y filtros administrativos.
		return this.solicitudes()
			.filter((item) => {
				const haystack = `${item.studentName} ${item.studentCode} ${item.faculty} ${item.program} ${item.semester} ${item.subject}`
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
			// Se refresca desde la fuente para reflejar cambios de estado o historial recientes.
			return this.solicitudes().find((item) => item.id === selected.id) ?? list[0] ?? null;
		}

		return list[0] ?? null;
	});

	readonly summary = computed(() => {
		const list = this.solicitudes();
		return {
			pending: list.filter((item) => item.status === 'Pendiente').length,
			high: list.filter((item) => item.priority === 'Alta').length,
			process: list.filter((item) => item.status === 'En triage' || item.status === 'En Proceso').length,
			closed: list.filter((item) => item.status === 'Completada' || item.status === 'Aprobada').length
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
		this.operationMessage.set('');
	}

	onNoteInput(value: string) {
		this.noteText.set(value);
	}

	onResolutionInput(value: string) {
		this.resolutionText.set(value);
	}

	onAppointmentDateChange(value: string) {
		this.appointmentDate.set(value);
	}

	onAppointmentTimeChange(value: string) {
		this.appointmentTime.set(value);
	}

	onSetStatus(item: Solicitud, status: SolicitudEstado) {
		const nextAction = this.getNextActionForStatus(status);
		this.solicitudesService.transitionSolicitud(
			item,
			status,
			`La solicitud cambió a estado ${status}.`,
			'Equipo Bienestar',
			nextAction
		);
		this.operationMessage.set(`Estado actualizado a ${status}.`);
	}

	onCloseWithResolution(item: Solicitud, status: 'Completada' | 'Rechazada') {
		const resolution = this.resolutionText().trim();

		if (!resolution) {
			this.operationMessage.set('Escriba una respuesta o motivo antes de cerrar la solicitud.');
			return;
		}

		this.solicitudesService.transitionSolicitud(
			item,
			status,
			resolution,
			'Equipo Bienestar',
			status === 'Completada' ? 'Solicitud cerrada con respuesta registrada' : 'Solicitud rechazada con motivo registrado'
		);
		this.resolutionText.set('');
		this.operationMessage.set(
			status === 'Completada'
				? 'Solicitud cerrada con respuesta para el estudiante.'
				: 'Solicitud rechazada con motivo documentado.'
		);
	}

	onAddNote(item: Solicitud) {
		const note = this.noteText().trim();

		if (!note) {
			return;
		}

		this.solicitudesService.addHistory(item, 'Observación registrada', note, 'Equipo Bienestar');
		this.noteText.set('');
		this.operationMessage.set('Observación agregada al historial.');
	}

	onAssignAppointment(item: Solicitud) {
		// Programar una cita tambien mueve la solicitud a seguimiento y deja evidencia en historial.
		const cita: Cita = {
			id: this.citasService.getNextId(),
			studentCode: item.studentCode,
			studentEmail: item.studentEmail,
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
		this.operationMessage.set('Cita programada y solicitud movida a seguimiento.');
	}

	onOpenCase(item: Solicitud) {
		// El tipo de solicitud sugiere el riesgo inicial, pero el equipo puede ajustarlo antes de confirmar.
		this.caseRisk.set(this.getInitialRisk(item));
		this.caseNote.set('');
		this.caseDialogSolicitud.set(item);
	}

	onCancelOpenCase() {
		this.caseDialogSolicitud.set(null);
		this.caseNote.set('');
	}

	onCaseRiskChange(value: CasoRiesgo) {
		this.caseRisk.set(value);
	}

	onCaseNoteInput(value: string) {
		this.caseNote.set(value);
	}

	onConfirmOpenCase() {
		const item = this.caseDialogSolicitud();

		if (!item) {
			return;
		}

		const caso: Caso = {
			id: this.casosService.getNextId(),
			studentName: item.studentName,
			riskType: this.caseRisk(),
			status: 'Activo',
			startDate: new Date().toISOString().slice(0, 10),
			lastUpdate: new Date().toISOString().slice(0, 10)
		};
		const note = this.caseNote().trim();

		// Abrir el caso crea una ficha de seguimiento y conserva el rastro dentro de la solicitud.
		this.casosService.addCaso(caso);
		this.solicitudesService.addHistory(
			item,
			'Caso abierto',
			`Se abrió el caso ${caso.id} con riesgo ${caso.riskType}. ${note ? `Nota inicial: ${note}` : 'Queda pendiente la primera revisión del equipo.'}`,
			'Equipo Bienestar'
		);
		this.caseDialogSolicitud.set(null);
		this.caseNote.set('');
		this.operationMessage.set(`Caso ${caso.id} abierto para seguimiento especializado.`);
	}

	private getInitialRisk(item: Solicitud): CasoRiesgo {
		if (item.type === 'Social') return 'Social';
		if (item.type === 'Académica') return 'Académico';
		if (item.type === 'Médica') return 'Personal';
		return 'Personal';
	}

	private getNextActionForStatus(status: SolicitudEstado): string {
		switch (status) {
			case 'En triage':
				return 'Revisar prioridad, validar contacto y definir ruta de atención';
			case 'En Proceso':
				return 'Programar o ejecutar la acción de seguimiento acordada';
			case 'Aprobada':
				return 'Coordinar la atención aprobada con el estudiante';
			case 'Completada':
				return 'Solicitud cerrada';
			case 'Rechazada':
				return 'Revisar motivo de rechazo si el estudiante solicita aclaración';
			default:
				return 'Revisar información y definir ruta de atención';
		}
	}

	private priorityRank(priority: SolicitudPrioridad) {
		return { Alta: 0, Media: 1, Baja: 2 }[priority];
	}
}
