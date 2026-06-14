import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasosService } from '../../services/casos.service';
import { Caso, CasoEstado, CasoRiesgo } from '../../models/caso';

const ALL_FILTER = 'Todos';

@Component({
	selector: 'app-admin-casos',
	imports: [CommonModule],
	templateUrl: './admin-casos.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCasosComponent {
	private readonly casosService = inject(CasosService);
	private readonly casos = this.casosService.getCasos();
	searchTerm = signal('');
	riskFilter = signal<string>(ALL_FILTER);
	statusFilter = signal<string>(ALL_FILTER);

	editingCaso = signal<Caso | null>(null);
	viewingCaso = signal<Caso | null>(null);
	draftCaso = signal<Caso | null>(null);

	filteredCasos = computed(() => {
		const term = this.searchTerm().toLowerCase().trim();
		const risk = this.riskFilter();
		const status = this.statusFilter();

		return this.casos().filter((item) => {
			const matchesTerm = !term || item.studentName.toLowerCase().includes(term);
			const matchesRisk = risk === ALL_FILTER || item.riskType === risk;
			const matchesStatus = status === ALL_FILTER || item.status === status;

			return matchesTerm && matchesRisk && matchesStatus;
		});
	});

	readonly riskOptions: Array<CasoRiesgo | typeof ALL_FILTER> = [
		ALL_FILTER,
		'Académico',
		'Personal',
		'Social',
		'Económico'
	];

	readonly editRiskOptions: CasoRiesgo[] = ['Académico', 'Personal', 'Social', 'Económico'];

	readonly statusOptions: Array<CasoEstado | typeof ALL_FILTER> = [ALL_FILTER, 'Activo', 'Cerrado'];

	readonly editStatusOptions: CasoEstado[] = ['Activo', 'Cerrado'];

	isDraftValid = computed(() => {
		const draft = this.draftCaso();

		if (!draft) {
			return false;
		}

		return (
			draft.id.trim().length > 0 &&
			draft.studentName.trim().length > 0 &&
			draft.riskType.trim().length > 0 &&
			draft.status.trim().length > 0 &&
			draft.startDate.trim().length > 0 &&
			draft.lastUpdate.trim().length > 0
		);
	});

	onSearchInput(value: string) {
		this.searchTerm.set(value);
	}

	onCreate() {
		this.viewingCaso.set(null);
		this.editingCaso.set(null);
		this.draftCaso.set({
			id: this.casosService.getNextId(),
			studentName: '',
			riskType: 'Académico',
			status: 'Activo',
			startDate: new Date().toISOString().slice(0, 10),
			lastUpdate: new Date().toISOString().slice(0, 10)
		});
	}

	onRiskChange(value: string) {
		this.riskFilter.set(value || ALL_FILTER);
	}

	onStatusChange(value: string) {
		this.statusFilter.set(value || ALL_FILTER);
	}

	onView(item: Caso) {
		this.viewingCaso.set(item);
		this.editingCaso.set(null);
		this.draftCaso.set(null);
	}

	onCloseView() {
		this.viewingCaso.set(null);
	}

	onEdit(item: Caso) {
		this.editingCaso.set(item);
		this.viewingCaso.set(null);
		this.draftCaso.set({ ...item });
	}

	onDraftStudentInput(value: string) {
		this.draftCaso.update((draft) =>
			draft ? { ...draft, studentName: value } : draft
		);
	}

	onDraftRiskChange(value: CasoRiesgo) {
		this.draftCaso.update((draft) =>
			draft ? { ...draft, riskType: value } : draft
		);
	}

	onDraftStatusChange(value: CasoEstado) {
		this.draftCaso.update((draft) =>
			draft ? { ...draft, status: value } : draft
		);
	}

	onDraftStartDateChange(value: string) {
		this.draftCaso.update((draft) =>
			draft ? { ...draft, startDate: value } : draft
		);
	}

	onDraftLastUpdateChange(value: string) {
		this.draftCaso.update((draft) =>
			draft ? { ...draft, lastUpdate: value } : draft
		);
	}

	onCancelEdit() {
		this.editingCaso.set(null);
		this.draftCaso.set(null);
	}

	onSaveEdit() {
		const original = this.editingCaso();
		const draft = this.draftCaso();

		if (!draft || !this.isDraftValid()) {
			return;
		}

		if (original) {
			this.casosService.updateCaso(original, draft);
		} else {
			this.casosService.addCaso(draft);
		}
		this.editingCaso.set(null);
		this.draftCaso.set(null);
	}
}
