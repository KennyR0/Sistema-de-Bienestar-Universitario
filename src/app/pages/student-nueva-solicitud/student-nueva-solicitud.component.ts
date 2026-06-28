import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
	CanalContacto,
	SemestreAcademico,
	SolicitudAdjunto,
	SolicitudPrioridad,
	SolicitudTipo
} from '../../models/solicitud';
import { AuthService } from '../../services/auth.service';
import { StudentSolicitudesService } from '../../services/student-solicitudes.service';

@Component({
	selector: 'app-student-nueva-solicitud',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './student-nueva-solicitud.component.html'
})
export class StudentNuevaSolicitudComponent {
	private readonly authService = inject(AuthService);
	private readonly solicitudesService = inject(StudentSolicitudesService);
	private readonly currentUser = this.authService.currentUser();

	readonly typeOptions: SolicitudTipo[] = ['Psicológica', 'Médica', 'Social', 'Académica'];
	readonly priorityOptions: SolicitudPrioridad[] = ['Alta', 'Media', 'Baja'];
	readonly semesterOptions: SemestreAcademico[] = [
		'Primer semestre',
		'Segundo semestre',
		'Tercer semestre',
		'Cuarto semestre',
		'Quinto semestre',
		'Sexto semestre',
		'Séptimo semestre',
		'Octavo semestre',
		'Noveno semestre',
		'Décimo semestre'
	];
	readonly contactOptions: CanalContacto[] = [
		'Correo institucional',
		'Teléfono',
		'WhatsApp',
		'Presencial'
	];

	studentName = signal(this.currentUser?.fullName ?? '');
	studentCode = signal(this.currentUser?.studentCode ?? '');
	faculty = signal(this.currentUser?.faculty ?? '');
	program = signal(this.currentUser?.program ?? '');
	semester = signal<SemestreAcademico>(
		this.isSemester(this.currentUser?.semester) ? this.currentUser.semester : 'Primer semestre'
	);
	selectedType = signal<SolicitudTipo | ''>('');
	priority = signal<SolicitudPrioridad>('Media');
	contactChannel = signal<CanalContacto>('Correo institucional');
	contactValue = signal(this.currentUser?.email ?? '');
	availability = signal('');
	subject = signal('');
	description = signal('');
	attachmentName = signal('');
	consent = signal(false);
	attemptedSubmit = signal(false);
	submittedSuccessfully = signal(false);

	readonly errors = computed(() => {
		const errors: string[] = [];

		if (!this.studentName().trim()) errors.push('Ingrese su nombre completo.');
		if (!this.studentCode().trim()) errors.push('Ingrese su código estudiantil.');
		if (!this.faculty().trim()) errors.push('Ingrese su facultad.');
		if (!this.program().trim()) errors.push('Ingrese su carrera.');
		if (!this.semester()) errors.push('Seleccione su semestre.');
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

	onSemesterChange(value: SemestreAcademico) {
		if (this.isSemester(value)) {
			this.semester.set(value);
		}
	}

	onContactChange(value: CanalContacto) {
		this.contactChannel.set(value);
	}

	onAttachmentSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		this.attachmentName.set(file?.name ?? '');
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

		// El navegador no conserva el archivo; se registra su nombre para revision posterior del equipo.
		const attachments: SolicitudAdjunto[] = this.attachmentName().trim()
			? [
					{
						id: `att-${Date.now()}`,
						name: this.attachmentName().trim(),
						type: this.attachmentName().split('.').pop()?.toUpperCase() || 'Archivo',
						size: 'Pendiente de revisión'
					}
			]
			: [];

		// El servicio completa los metadatos administrativos antes de guardar la solicitud.
		this.solicitudesService.addSolicitud(
			this.solicitudesService.createSolicitud({
				studentId: this.currentUser?.studentId,
				studentName: this.currentUser?.fullName ?? this.studentName().trim(),
				studentCode: this.currentUser?.studentCode ?? this.studentCode().trim(),
				studentEmail: this.currentUser?.email,
				faculty: this.faculty().trim(),
				program: this.program().trim(),
				semester: this.semester(),
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

		this.submittedSuccessfully.set(true);
	}

	private isSemester(value: string | undefined): value is SemestreAcademico {
		return this.semesterOptions.includes(value as SemestreAcademico);
	}
}

type WritableTextField =
	| 'studentName'
	| 'studentCode'
	| 'faculty'
	| 'program'
	| 'contactValue'
	| 'availability'
	| 'subject'
	| 'description'
	| 'attachmentName';
