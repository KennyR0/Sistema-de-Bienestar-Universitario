import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsService } from '../../services/students.service';
import { Student, StudentStatus } from '../../models/student';
import { SolicitudesService } from '../../services/solicitudes.service';
import { CitasService } from '../../services/citas.service';
import { CasosService } from '../../services/casos.service';
import {
	CanalContacto,
	SemestreAcademico,
	SolicitudPrioridad,
	SolicitudTipo
} from '../../models/solicitud';

@Component({
	selector: 'app-admin-estudiantes',
	imports: [CommonModule],
	templateUrl: './admin-estudiantes.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminEstudiantesComponent {
	private readonly studentsService = inject(StudentsService);
	private readonly solicitudesService = inject(SolicitudesService);
	private readonly citasService = inject(CitasService);
	private readonly casosService = inject(CasosService);
	private readonly students = this.studentsService.getStudents();
	private readonly solicitudes = this.solicitudesService.getSolicitudes();
	private readonly citas = this.citasService.getCitas();
	private readonly casos = this.casosService.getCasos();
	searchTerm = signal('');
	readonly statusOptions = ['Activo', 'Inactivo'];
	readonly semesterOptions = [
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
	readonly solicitudTypeOptions: SolicitudTipo[] = ['Psicológica', 'Médica', 'Social', 'Académica'];
	readonly priorityOptions: SolicitudPrioridad[] = ['Alta', 'Media', 'Baja'];
	readonly contactOptions: CanalContacto[] = [
		'Correo institucional',
		'Teléfono',
		'WhatsApp',
		'Presencial'
	];

	editingStudent = signal<Student | null>(null);
	viewingStudent = signal<Student | null>(null);
	draftStudent = signal<Student | null>(null);
	creatingSolicitudFor = signal<Student | null>(null);
	solicitudType = signal<SolicitudTipo>('Psicológica');
	solicitudPriority = signal<SolicitudPrioridad>('Media');
	solicitudContactChannel = signal<CanalContacto>('Correo institucional');
	solicitudSubject = signal('');
	solicitudDescription = signal('');
	solicitudContactValue = signal('');
	solicitudAvailability = signal('');
	solicitudMessage = signal('');

	filteredStudents = computed(() => {
		const term = this.searchTerm().toLowerCase().trim();
		const list = this.students();

		if (!term) {
			return list;
		}

		return list.filter((student) =>
			`${student.fullName} ${student.code} ${student.program}`
				.toLowerCase()
				.includes(term)
		);
	});

	activeStudent = computed(() => this.viewingStudent() ?? this.filteredStudents()[0] ?? null);

	studentSolicitudes = computed(() => {
		const student = this.activeStudent();

		if (!student) {
			return [];
		}

		return this.solicitudes()
			.filter((item) => item.studentCode === student.code)
			.sort((a, b) => b.date.localeCompare(a.date));
	});

	studentCitas = computed(() => {
		const student = this.activeStudent();

		if (!student) {
			return [];
		}

		return this.citas()
			.filter((item) => item.studentCode === student.code || this.sameName(item.studentName, student.fullName))
			.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
	});

	studentCasos = computed(() => {
		const student = this.activeStudent();

		if (!student) {
			return [];
		}

		return this.casos()
			.filter((item) => this.sameName(item.studentName, student.fullName))
			.sort((a, b) => b.lastUpdate.localeCompare(a.lastUpdate));
	});

	studentSummary = computed(() => {
		const solicitudes = this.studentSolicitudes();
		const citas = this.studentCitas();
		const casos = this.studentCasos();

		return {
			openRequests: solicitudes.filter((item) => !['Completada', 'Rechazada'].includes(item.status)).length,
			nextAppointment: citas.find((item) => item.status === 'Programada') ?? null,
			activeCases: casos.filter((item) => item.status === 'Activo').length,
			lastUpdate:
				solicitudes[0]?.date ??
				citas[0]?.date ??
				casos[0]?.lastUpdate ??
				'Sin movimientos registrados'
		};
	});

	isDraftValid = computed(() => {
		const draft = this.draftStudent();

		if (!draft) {
			return false;
		}

		return (
			String(draft.id).trim().length > 0 &&
			draft.fullName.trim().length > 0 &&
			draft.code.trim().length > 0 &&
			(draft.faculty?.trim().length ?? 0) > 0 &&
			draft.program.trim().length > 0 &&
			(draft.semester?.trim().length ?? 0) > 0 &&
			draft.status.trim().length > 0
		);
	});

	isSolicitudDraftValid = computed(() => {
		return (
			Boolean(this.creatingSolicitudFor()) &&
			this.solicitudSubject().trim().length >= 6 &&
			this.solicitudDescription().trim().length >= 12 &&
			this.solicitudContactValue().trim().length >= 5 &&
			this.solicitudAvailability().trim().length >= 5
		);
	});

	onSearchInput(value: string) {
		this.searchTerm.set(value);
	}

	onCreate() {
		this.viewingStudent.set(null);
		this.editingStudent.set(null);
		this.draftStudent.set({
			id: this.studentsService.getNextId(),
			fullName: '',
			code: '',
			faculty: '',
			program: '',
			semester: 'Primer semestre',
			status: 'Activo'
		});
	}

	onView(student: Student) {
		this.viewingStudent.set(student);
		this.editingStudent.set(null);
		this.draftStudent.set(null);
		this.solicitudMessage.set('');
	}

	onCloseView() {
		this.viewingStudent.set(null);
	}

	onEdit(student: Student) {
		this.editingStudent.set(student);
		this.viewingStudent.set(null);
		this.draftStudent.set({ ...student });
		this.creatingSolicitudFor.set(null);
	}

	onDraftIdInput(value: string) {
		const numericValue = Number(value);
		this.draftStudent.update((draft) =>
			draft ? { ...draft, id: Number.isNaN(numericValue) ? draft.id : numericValue } : draft
		);
	}

	onDraftNameInput(value: string) {
		this.draftStudent.update((draft) =>
			draft ? { ...draft, fullName: value } : draft
		);
	}

	onDraftCodeInput(value: string) {
		this.draftStudent.update((draft) =>
			draft ? { ...draft, code: value } : draft
		);
	}

	onDraftProgramInput(value: string) {
		this.draftStudent.update((draft) =>
			draft ? { ...draft, program: value } : draft
		);
	}

	onDraftFacultyInput(value: string) {
		this.draftStudent.update((draft) =>
			draft ? { ...draft, faculty: value } : draft
		);
	}

	onDraftSemesterChange(value: string) {
		this.draftStudent.update((draft) =>
			draft ? { ...draft, semester: value } : draft
		);
	}

	onDraftStatusChange(value: StudentStatus) {
		this.draftStudent.update((draft) =>
			draft ? { ...draft, status: value } : draft
		);
	}

	onCancelEdit() {
		this.editingStudent.set(null);
		this.draftStudent.set(null);
	}

	onSaveEdit() {
		const original = this.editingStudent();
		const draft = this.draftStudent();

		if (!draft || !this.isDraftValid()) {
			return;
		}

		if (original) {
			this.studentsService.updateStudent(original, draft);
		} else {
			this.studentsService.addStudent(draft);
		}
		this.editingStudent.set(null);
		this.draftStudent.set(null);
	}

	onOpenSolicitud(student: Student) {
		this.creatingSolicitudFor.set(student);
		this.solicitudType.set('Psicológica');
		this.solicitudPriority.set('Media');
		this.solicitudContactChannel.set('Correo institucional');
		this.solicitudSubject.set('');
		this.solicitudDescription.set('');
		this.solicitudContactValue.set('');
		this.solicitudAvailability.set('');
		this.solicitudMessage.set('');
	}

	onCancelSolicitud() {
		this.creatingSolicitudFor.set(null);
		this.solicitudMessage.set('');
	}

	onSolicitudTypeChange(value: SolicitudTipo) {
		this.solicitudType.set(value);
	}

	onSolicitudPriorityChange(value: SolicitudPrioridad) {
		this.solicitudPriority.set(value);
	}

	onSolicitudContactChange(value: CanalContacto) {
		this.solicitudContactChannel.set(value);
	}

	onSolicitudSubjectInput(value: string) {
		this.solicitudSubject.set(value);
	}

	onSolicitudDescriptionInput(value: string) {
		this.solicitudDescription.set(value);
	}

	onSolicitudContactValueInput(value: string) {
		this.solicitudContactValue.set(value);
	}

	onSolicitudAvailabilityInput(value: string) {
		this.solicitudAvailability.set(value);
	}

	onSaveSolicitud() {
		const student = this.creatingSolicitudFor();

		if (!student || !this.isSolicitudDraftValid()) {
			this.solicitudMessage.set('Complete asunto, detalle, contacto y disponibilidad antes de guardar.');
			return;
		}

		const solicitud = this.solicitudesService.createSolicitud({
			studentId: student.id,
			studentName: student.fullName,
			studentCode: student.code,
			faculty: student.faculty ?? 'Facultad por registrar',
			program: student.program,
			semester: (student.semester ?? 'Primer semestre') as SemestreAcademico,
			type: this.solicitudType(),
			subject: this.solicitudSubject().trim(),
			description: this.solicitudDescription().trim(),
			priority: this.solicitudPriority(),
			contactChannel: this.solicitudContactChannel(),
			contactValue: this.solicitudContactValue().trim(),
			availability: this.solicitudAvailability().trim(),
			attachments: [],
			consent: true
		});

		this.solicitudesService.addSolicitud(solicitud);
		this.viewingStudent.set(student);
		this.creatingSolicitudFor.set(null);
		this.solicitudMessage.set(`Solicitud ${solicitud.id} creada y agregada al expediente.`);
	}

	onDelete(student: Student) {
		this.studentsService.deleteStudent(student);

		if (this.editingStudent() === student) {
			this.editingStudent.set(null);
			this.draftStudent.set(null);
		}

		if (this.viewingStudent() === student) {
			this.viewingStudent.set(null);
		}
	}

	private sameName(left: string, right: string): boolean {
		const normalize = (value: string) =>
			value
				.toLowerCase()
				.normalize('NFD')
				.replace(/\p{Diacritic}/gu, '')
				.trim();

		const normalizedLeft = normalize(left);
		const normalizedRight = normalize(right);

		return normalizedLeft === normalizedRight || normalizedLeft.includes(normalizedRight);
	}
}
