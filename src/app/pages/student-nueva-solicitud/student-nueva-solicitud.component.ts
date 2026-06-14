import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
	CanalContacto,
	SolicitudAdjunto,
	SolicitudPrioridad,
	SolicitudTipo
} from '../../models/solicitud';
import { StudentSolicitudesService } from '../../services/student-solicitudes.service';

@Component({
	selector: 'app-student-nueva-solicitud',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './student-nueva-solicitud.component.html'
})
export class StudentNuevaSolicitudComponent {
	private readonly solicitudesService = inject(StudentSolicitudesService);
	private readonly router = inject(Router);

	readonly typeOptions: SolicitudTipo[] = ['Psicológica', 'Médica', 'Social', 'Académica'];
	readonly priorityOptions: SolicitudPrioridad[] = ['Alta', 'Media', 'Baja'];
	readonly contactOptions: CanalContacto[] = [
		'Correo institucional',
		'Teléfono',
		'WhatsApp',
		'Presencial'
	];

	studentName = signal('Estudiante ULEAM');
	studentCode = signal('20240001');
	program = signal('Carrera no especificada');
	selectedType = signal<SolicitudTipo | ''>('');
	priority = signal<SolicitudPrioridad>('Media');
	contactChannel = signal<CanalContacto>('Correo institucional');
	contactValue = signal('');
	availability = signal('');
	subject = signal('');
	description = signal('');
	attachmentName = signal('');
	consent = signal(false);
	attemptedSubmit = signal(false);

	readonly errors = computed(() => {
		const errors: string[] = [];

		if (!this.studentName().trim()) errors.push('Ingrese su nombre completo.');
		if (!this.studentCode().trim()) errors.push('Ingrese su código estudiantil.');
		if (!this.program().trim()) errors.push('Ingrese su carrera.');
		if (!this.selectedType()) errors.push('Seleccione el tipo de atención.');
		if (this.subject().trim().length < 6) errors.push('El asunto debe tener al menos 6 caracteres.');
		if (this.description().trim().length < 30) {
			errors.push('La descripción debe tener al menos 30 caracteres.');
		}
		if (!this.contactValue().trim()) errors.push('Ingrese un dato de contacto.');
		if (!this.availability().trim()) errors.push('Indique su disponibilidad horaria.');
		if (!this.consent()) errors.push('Debe aceptar el consentimiento informado.');

		return errors;
	});

	onTextInput(field: WritableTextField, value: string) {
		this[field].set(value);
	}

	onTypeChange(value: SolicitudTipo) {
		this.selectedType.set(value);
	}

	onPriorityChange(value: SolicitudPrioridad) {
		this.priority.set(value);
	}

	onContactChange(value: CanalContacto) {
		this.contactChannel.set(value);
	}

	onConsentChange(checked: boolean) {
		this.consent.set(checked);
	}

	onSubmit() {
		this.attemptedSubmit.set(true);
		const selectedType = this.selectedType();

		if (this.errors().length > 0 || !selectedType) {
			return;
		}

		const attachments: SolicitudAdjunto[] = this.attachmentName().trim()
			? [
					{
						id: `att-${Date.now()}`,
						name: this.attachmentName().trim(),
						type: this.attachmentName().split('.').pop()?.toUpperCase() || 'Archivo',
						size: 'Simulado'
					}
				]
			: [];

		this.solicitudesService.addSolicitud(
			this.solicitudesService.createSolicitud({
				studentName: this.studentName().trim(),
				studentCode: this.studentCode().trim(),
				program: this.program().trim(),
				type: selectedType,
				subject: this.subject().trim(),
				description: this.description().trim(),
				priority: this.priority(),
				contactChannel: this.contactChannel(),
				contactValue: this.contactValue().trim(),
				availability: this.availability().trim(),
				attachments,
				consent: this.consent()
			})
		);

		this.router.navigate(['/estudiante/solicitudes']);
	}
}

type WritableTextField =
	| 'studentName'
	| 'studentCode'
	| 'program'
	| 'contactValue'
	| 'availability'
	| 'subject'
	| 'description'
	| 'attachmentName';
