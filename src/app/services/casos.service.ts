import { Injectable, inject } from '@angular/core';
import { Caso } from '../models/caso';
import { LocalStorageStoreService } from './local-storage-store.service';

const STORAGE_KEY = 'bienestar:v1:casos';
const SEED_CASOS: Caso[] = [
	{
		id: '001',
		studentName: 'Juan Pérez',
		riskType: 'Académico',
		status: 'Activo',
		startDate: '2026-05-01',
		lastUpdate: '2026-05-12'
	},
	{
		id: '002',
		studentName: 'María García',
		riskType: 'Personal',
		status: 'Cerrado',
		startDate: '2026-05-10',
		lastUpdate: '2026-05-20'
	},
	{
		id: '003',
		studentName: 'Carlos López',
		riskType: 'Académico',
		status: 'Activo',
		startDate: '2026-05-12',
		lastUpdate: '2026-05-23'
	},
	{
		id: '004',
		studentName: 'Laura Ruiz',
		riskType: 'Social',
		status: 'Activo',
		startDate: '2026-05-15',
		lastUpdate: '2026-05-24'
	}
];

@Injectable({ providedIn: 'root' })
export class CasosService {
	private readonly store = inject(LocalStorageStoreService);
	private readonly casos = this.store.createCollection<Caso>(STORAGE_KEY, SEED_CASOS);

	getCasos() {
		return this.casos.asReadonly();
	}

	addCaso(caso: Caso) {
		this.casos.update((list) => {
			const next = [...list, { ...caso }];
			this.persist(next);
			return next;
		});
	}

	updateCaso(original: Caso, updated: Caso) {
		this.casos.update((list) => {
			const next = list.map((item) => (item.id === original.id ? { ...updated } : item));
			this.persist(next);
			return next;
		});
	}

	deleteCaso(target: Caso) {
		this.casos.update((list) => {
			const next = list.filter((item) => item.id !== target.id);
			this.persist(next);
			return next;
		});
	}

	getNextId(): string {
		const maxId = Math.max(0, ...this.casos().map((item) => Number(item.id) || 0));
		return String(maxId + 1).padStart(3, '0');
	}

	private persist(value: Caso[]) {
		this.store.saveCollection(STORAGE_KEY, value);
	}
}
