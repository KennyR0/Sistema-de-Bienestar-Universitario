import { Injectable, inject } from '@angular/core';
import { StudentBeca } from '../models/student-beca';
import { LocalStorageStoreService } from './local-storage-store.service';

const STORAGE_KEY = 'bienestar:v1:student-becas';
const SEED_BECAS: StudentBeca[] = [
	{
		id: 'student-beca-001',
		name: 'Beca Alimenticia',
		type: 'Necesidad',
		amount: 80,
		status: 'Activa'
	},
	{
		id: 'student-beca-002',
		name: 'Beca de Excelencia Académica',
		type: 'Mérito',
		amount: 150,
		status: 'Activa'
	}
];

@Injectable({ providedIn: 'root' })
export class StudentBecasService {
	private readonly store = inject(LocalStorageStoreService);
	private readonly becas = this.store.createCollection<StudentBeca>(STORAGE_KEY, SEED_BECAS);

	getBecas() {
		return this.becas.asReadonly();
	}
}
