import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsService } from '../../services/students.service';
import { Student, StudentStatus } from '../../models/student';

@Component({
	selector: 'app-admin-estudiantes',
	imports: [CommonModule],
	templateUrl: './admin-estudiantes.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminEstudiantesComponent {
	private readonly studentsService = inject(StudentsService);
	private readonly students = this.studentsService.getStudents();
	searchTerm = signal('');
	readonly statusOptions = ['Activo', 'Inactivo'];

	editingStudent = signal<Student | null>(null);
	viewingStudent = signal<Student | null>(null);
	draftStudent = signal<Student | null>(null);

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

	isDraftValid = computed(() => {
		const draft = this.draftStudent();

		if (!draft) {
			return false;
		}

		return (
			String(draft.id).trim().length > 0 &&
			draft.fullName.trim().length > 0 &&
			draft.code.trim().length > 0 &&
			draft.program.trim().length > 0 &&
			draft.status.trim().length > 0
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
			program: '',
			status: 'Activo'
		});
	}

	onView(student: Student) {
		this.viewingStudent.set(student);
		this.editingStudent.set(null);
		this.draftStudent.set(null);
	}

	onCloseView() {
		this.viewingStudent.set(null);
	}

	onEdit(student: Student) {
		this.editingStudent.set(student);
		this.viewingStudent.set(null);
		this.draftStudent.set({ ...student });
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
}
