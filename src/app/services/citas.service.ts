import { Injectable, inject } from '@angular/core';
import { Cita } from '../models/cita';
import { LocalStorageStoreService } from './local-storage-store.service';

const STORAGE_KEY = 'bienestar:v1:citas';
const SEED_CITAS: Cita[] = [
	{
		id: 'cita-001',
		studentName: 'María López',
		professionalName: 'Dr. Juan Pérez',
		date: '2026-10-26',
		time: '10:00',
		type: 'Médica',
		status: 'Programada'
	},
	{
		id: 'cita-002',
		studentName: 'Carlos García',
		professionalName: 'Lic. Ana García',
		date: '2026-10-27',
		time: '14:30',
		type: 'Psicológica',
		status: 'Completada'
	},
	{
		id: 'cita-003',
		studentName: 'Laura Rodríguez',
		professionalName: 'Dr. Juan Pérez',
		date: '2026-10-28',
		time: '09:00',
		type: 'Médica',
		status: 'Cancelada'
	},
	{
		id: 'cita-004',
		studentName: 'Andrea Vega',
		professionalName: 'Lic. Ana García',
		date: '2026-10-29',
		time: '11:15',
		type: 'Psicológica',
		status: 'Programada'
	}
];

@Injectable({ providedIn: 'root' })
export class CitasService {
	private readonly store = inject(LocalStorageStoreService);
	private readonly citas = this.store.createCollection<Cita>(STORAGE_KEY, SEED_CITAS);

	getCitas() {
		return this.citas.asReadonly();
	}

	addCita(cita: Cita) {
		this.citas.update((list) => {
			const next = [...list, { ...cita }];
			this.persist(next);
			return next;
		});
	}

	updateCita(original: Cita, updated: Cita) {
		this.citas.update((list) => {
			const next = list.map((item) => (item.id === original.id ? { ...updated } : item));
			this.persist(next);
			return next;
		});
	}

	deleteCita(target: Cita) {
		this.citas.update((list) => {
			const next = list.filter((item) => item.id !== target.id);
			this.persist(next);
			return next;
		});
	}

	getNextId(): string {
		return `cita-${Date.now()}`;
	}

	private persist(value: Cita[]) {
		this.store.saveCollection(STORAGE_KEY, value);
	}
}
