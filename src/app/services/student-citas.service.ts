import { Injectable, inject } from '@angular/core';
import { StudentCita } from '../models/student-cita';
import { LocalStorageStoreService } from './local-storage-store.service';

const STORAGE_KEY = 'bienestar:v1:student-citas';
const SEED_CITAS: StudentCita[] = [
	{
		id: 'student-cita-001',
		professionalName: 'Dr. Juan Pérez',
		date: '2026-10-26',
		time: '10:00',
		type: 'Médica',
		status: 'Programada'
	},
	{
		id: 'student-cita-002',
		professionalName: 'Lic. Ana García',
		date: '2026-10-27',
		time: '14:30',
		type: 'Psicológica',
		status: 'Completada'
	}
];

@Injectable({ providedIn: 'root' })
export class StudentCitasService {
	private readonly store = inject(LocalStorageStoreService);
	private readonly citas = this.store.createCollection<StudentCita>(STORAGE_KEY, SEED_CITAS);

	getCitas() {
		return this.citas.asReadonly();
	}
}
