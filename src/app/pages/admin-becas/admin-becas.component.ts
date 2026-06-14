import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BecasService } from '../../services/becas.service';
import { Beca } from '../../models/beca';

@Component({
	selector: 'app-admin-becas',
	imports: [CommonModule],
	templateUrl: './admin-becas.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminBecasComponent {
	private readonly becasService = inject(BecasService);
	readonly becas = this.becasService.getBecas();
	readonly typeOptions: Beca['type'][] = ['Mérito', 'Necesidad'];
	readonly statusOptions: Beca['status'][] = ['Activa', 'Inactiva'];

	editingBeca = signal<Beca | null>(null);
	draftBeca = signal<Beca | null>(null);

	isDraftValid = computed(() => {
		const draft = this.draftBeca();

		if (!draft) {
			return false;
		}

		return (
			draft.name.trim().length > 0 &&
			draft.type.trim().length > 0 &&
			draft.amount > 0 &&
			draft.criteria.trim().length > 0 &&
			draft.status.trim().length > 0
		);
	});

	onCreate() {
		this.editingBeca.set(null);
		this.draftBeca.set({
			id: this.becasService.getNextId(),
			name: '',
			type: 'Necesidad',
			amount: 1,
			criteria: '',
			status: 'Activa'
		});
	}

	onEdit(item: Beca) {
		this.editingBeca.set(item);
		this.draftBeca.set({ ...item });
	}

	onDraftNameInput(value: string) {
		this.draftBeca.update((draft) =>
			draft ? { ...draft, name: value } : draft
		);
	}

	onDraftTypeChange(value: Beca['type']) {
		this.draftBeca.update((draft) =>
			draft ? { ...draft, type: value } : draft
		);
	}

	onDraftAmountInput(value: string) {
		const numericValue = Number(value);
		this.draftBeca.update((draft) =>
			draft
				? { ...draft, amount: Number.isNaN(numericValue) ? draft.amount : numericValue }
				: draft
		);
	}

	onDraftCriteriaInput(value: string) {
		this.draftBeca.update((draft) =>
			draft ? { ...draft, criteria: value } : draft
		);
	}

	onDraftStatusChange(value: Beca['status']) {
		this.draftBeca.update((draft) =>
			draft ? { ...draft, status: value } : draft
		);
	}

	onCancelEdit() {
		this.editingBeca.set(null);
		this.draftBeca.set(null);
	}

	onSaveEdit() {
		const original = this.editingBeca();
		const draft = this.draftBeca();

		if (!draft || !this.isDraftValid()) {
			return;
		}

		if (original) {
			this.becasService.updateBeca(original, draft);
		} else {
			this.becasService.addBeca(draft);
		}
		this.editingBeca.set(null);
		this.draftBeca.set(null);
	}

	onDelete(item: Beca) {
		this.becasService.deleteBeca(item);

		if (this.editingBeca() === item) {
			this.editingBeca.set(null);
			this.draftBeca.set(null);
		}
	}
}
