import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitasService } from '../../services/citas.service';
import { Cita, CitaEstado, CitaTipo } from '../../models/cita';

const ALL_FILTER = 'Todas';

@Component({
	selector: 'app-admin-citas',
	imports: [CommonModule],
	templateUrl: './admin-citas.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCitasComponent {
	private readonly citasService = inject(CitasService);
	private readonly citas = this.citasService.getCitas();
	studentFilter = signal('');
	professionalFilter = signal('');
	dateFilter = signal('');
	statusFilter = signal<string>(ALL_FILTER);

	editingCita = signal<Cita | null>(null);
	draftCita = signal<Cita | null>(null);

	filteredCitas = computed(() => {
		const student = this.studentFilter().toLowerCase().trim();
		const professional = this.professionalFilter();
		const date = this.dateFilter();
		const status = this.statusFilter();

		return this.citas().filter((item) => {
			const matchesStudent = !student || item.studentName.toLowerCase().includes(student);
			const matchesProfessional =
				!professional || professional === ALL_FILTER || item.professionalName === professional;
			const matchesDate = !date || item.date === date;
			const matchesStatus = status === ALL_FILTER || item.status === status;

			return matchesStudent && matchesProfessional && matchesDate && matchesStatus;
		});
	});

	readonly professionalOptions = computed(() => {
		const names = this.citas().map((item) => item.professionalName);
		return [ALL_FILTER, ...Array.from(new Set(names))];
	});

	readonly professionalNames = computed(() =>
		this.professionalOptions().filter((option) => option !== ALL_FILTER)
	);

	readonly statusOptions: Array<CitaEstado | typeof ALL_FILTER> = [
		ALL_FILTER,
		'Programada',
		'Completada',
		'Cancelada'
	];

	readonly editStatusOptions: CitaEstado[] = ['Programada', 'Completada', 'Cancelada'];

	readonly typeOptions: CitaTipo[] = ['Médica', 'Psicológica'];

	isDraftValid = computed(() => {
		const draft = this.draftCita();

		if (!draft) {
			return false;
		}

		return (
			draft.studentName.trim().length > 0 &&
			draft.professionalName.trim().length > 0 &&
			draft.date.trim().length > 0 &&
			draft.time.trim().length > 0 &&
			draft.type.trim().length > 0 &&
			draft.status.trim().length > 0
		);
	});

	onStudentInput(value: string) {
		this.studentFilter.set(value);
	}

	onProfessionalChange(value: string) {
		this.professionalFilter.set(value || ALL_FILTER);
	}

	onDateChange(value: string) {
		this.dateFilter.set(value);
	}

	onStatusChange(value: string) {
		this.statusFilter.set(value || ALL_FILTER);
	}

	onCreate() {
		this.editingCita.set(null);
		this.draftCita.set({
			id: this.citasService.getNextId(),
			studentName: '',
			professionalName: this.professionalNames()[0] ?? 'Profesional de Bienestar',
			date: new Date().toISOString().slice(0, 10),
			time: '08:00',
			type: 'Médica',
			status: 'Programada'
		});
	}

	onEdit(item: Cita) {
		this.editingCita.set(item);
		this.draftCita.set({ ...item });
	}

	onDraftStudentInput(value: string) {
		this.draftCita.update((draft) =>
			draft ? { ...draft, studentName: value } : draft
		);
	}

	onDraftProfessionalChange(value: string) {
		this.draftCita.update((draft) =>
			draft ? { ...draft, professionalName: value } : draft
		);
	}

	onDraftDateChange(value: string) {
		this.draftCita.update((draft) =>
			draft ? { ...draft, date: value } : draft
		);
	}

	onDraftTimeInput(value: string) {
		this.draftCita.update((draft) =>
			draft ? { ...draft, time: value } : draft
		);
	}

	onDraftTypeChange(value: CitaTipo) {
		this.draftCita.update((draft) =>
			draft ? { ...draft, type: value } : draft
		);
	}

	onDraftStatusChange(value: CitaEstado) {
		this.draftCita.update((draft) =>
			draft ? { ...draft, status: value } : draft
		);
	}

	onCancelEdit() {
		this.editingCita.set(null);
		this.draftCita.set(null);
	}

	onSaveEdit() {
		const original = this.editingCita();
		const draft = this.draftCita();

		if (!draft || !this.isDraftValid()) {
			return;
		}

		if (original) {
			this.citasService.updateCita(original, {
				...draft,
				rescheduleRequested: false,
				studentRequestNote: undefined
			});
		} else {
			this.citasService.addCita(draft);
		}
		this.editingCita.set(null);
		this.draftCita.set(null);
	}

	onCancelCita(item: Cita) {
		if (item.status === 'Cancelada') {
			return;
		}

		this.citasService.updateCita(item, { ...item, status: 'Cancelada' });

		if (this.editingCita() === item) {
			this.editingCita.set(null);
			this.draftCita.set(null);
		}
	}
}
