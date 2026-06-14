import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolicitudEstudiante } from '../../models/solicitud-estudiante';
import { StudentSolicitudesService } from '../../services/student-solicitudes.service';

@Component({
	selector: 'app-student-solicitudes',
	imports: [CommonModule, RouterLink],
	templateUrl: './student-solicitudes.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentSolicitudesComponent {
	private readonly solicitudesService = inject(StudentSolicitudesService);
	readonly solicitudes = this.solicitudesService.getSolicitudes();

	selectedSolicitud = signal<SolicitudEstudiante | null>(null);
	editingSolicitud = signal<SolicitudEstudiante | null>(null);
	draftSubject = signal('');
	draftDescription = signal('');
	draftAvailability = signal('');

	readonly activeSolicitud = computed(
		() => this.selectedSolicitud() ?? this.solicitudes()[0] ?? null
	);

	readonly summary = computed(() => {
		const list = this.solicitudes();
		return {
			total: list.length,
			pending: list.filter((item) => item.status === 'Pendiente').length,
			process: list.filter((item) => item.status === 'En Proceso').length,
			closed: list.filter((item) => item.status === 'Completada' || item.status === 'Aprobada').length
		};
	});

	isEditable(item: SolicitudEstudiante) {
		return item.status === 'Pendiente';
	}

	onSelect(item: SolicitudEstudiante) {
		this.selectedSolicitud.set(item);
		this.editingSolicitud.set(null);
	}

	onEdit(item: SolicitudEstudiante) {
		if (!this.isEditable(item)) {
			return;
		}

		this.editingSolicitud.set(item);
		this.draftSubject.set(item.subject);
		this.draftDescription.set(item.description);
		this.draftAvailability.set(item.availability);
	}

	onDraftSubject(value: string) {
		this.draftSubject.set(value);
	}

	onDraftDescription(value: string) {
		this.draftDescription.set(value);
	}

	onDraftAvailability(value: string) {
		this.draftAvailability.set(value);
	}

	onCancelEdit() {
		this.editingSolicitud.set(null);
	}

	onSaveEdit() {
		const original = this.editingSolicitud();

		if (!original) {
			return;
		}

		this.solicitudesService.updateSolicitud(original, {
			...original,
			subject: this.draftSubject().trim(),
			description: this.draftDescription().trim(),
			availability: this.draftAvailability().trim()
		});
		this.selectedSolicitud.set({
			...original,
			subject: this.draftSubject().trim(),
			description: this.draftDescription().trim(),
			availability: this.draftAvailability().trim()
		});
		this.editingSolicitud.set(null);
	}
}
