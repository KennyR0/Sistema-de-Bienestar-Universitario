import { Injectable, inject } from '@angular/core';
import { Beca } from '../models/beca';
import { LocalStorageStoreService } from './local-storage-store.service';

const STORAGE_KEY = 'bienestar:v1:becas';
const SEED_BECAS: Beca[] = [
	{
		id: 'beca-001',
		name: 'Beca de Excelencia Académica',
		type: 'Mérito',
		amount: 150,
		criteria: 'Promedio mayor o igual a 9.5',
		status: 'Activa'
	},
	{
		id: 'beca-002',
		name: 'Beca de Apoyo Socioeconómico',
		type: 'Necesidad',
		amount: 80,
		criteria: 'Informe socioeconómico aprobado',
		status: 'Activa'
	},
	{
		id: 'beca-003',
		name: 'Beca de Investigación',
		type: 'Mérito',
		amount: 150,
		criteria: 'Participación en proyectos',
		status: 'Inactiva'
	}
];

@Injectable({ providedIn: 'root' })
export class BecasService {
	private readonly store = inject(LocalStorageStoreService);
	private readonly becas = this.store.createCollection<Beca>(STORAGE_KEY, SEED_BECAS);

	getBecas() {
		return this.becas.asReadonly();
	}

	addBeca(beca: Beca) {
		this.becas.update((list) => {
			const next = [...list, { ...beca }];
			this.persist(next);
			return next;
		});
	}

	updateBeca(original: Beca, updated: Beca) {
		this.becas.update((list) => {
			const next = list.map((item) => (item.id === original.id ? { ...updated } : item));
			this.persist(next);
			return next;
		});
	}

	deleteBeca(target: Beca) {
		this.becas.update((list) => {
			const next = list.filter((item) => item.id !== target.id);
			this.persist(next);
			return next;
		});
	}

	getNextId(): string {
		return `beca-${Date.now()}`;
	}

	private persist(value: Beca[]) {
		this.store.saveCollection(STORAGE_KEY, value);
	}
}
