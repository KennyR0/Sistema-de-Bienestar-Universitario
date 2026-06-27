import { Injectable, computed, inject } from '@angular/core';
import { StudentBeca } from '../models/student-beca';
import { AuthService } from './auth.service';
import { LocalStorageStoreService } from './local-storage-store.service';

const STORAGE_KEY = 'bienestar:v1:student-becas';
const TEST_STUDENT_CODE = '20240001';
const TEST_STUDENT_EMAIL = 'prueba123@live.uleam.edu.ec';
const SEED_BECAS: StudentBeca[] = [
	{
		id: 'student-beca-001',
		studentCode: TEST_STUDENT_CODE,
		studentEmail: TEST_STUDENT_EMAIL,
		name: 'Beca Alimenticia',
		type: 'Necesidad',
		amount: 80,
		status: 'Activa'
	},
	{
		id: 'student-beca-002',
		studentCode: TEST_STUDENT_CODE,
		studentEmail: TEST_STUDENT_EMAIL,
		name: 'Beca de Excelencia Academica',
		type: 'Merito',
		amount: 150,
		status: 'Activa'
	}
];

@Injectable({ providedIn: 'root' })
export class StudentBecasService {
	private readonly authService = inject(AuthService);
	private readonly store = inject(LocalStorageStoreService);
	private readonly becas = this.store.createCollection<StudentBeca>(STORAGE_KEY, SEED_BECAS);
	private readonly currentBecas = computed(() => {
		const user = this.authService.currentUser();

		if (!user || user.role !== 'student' || !user.studentCode) {
			return [];
		}

		return this.becas().filter((item) => item.studentCode === user.studentCode);
	});

	constructor() {
		// Vincula becas semilla al estudiante de prueba sin afectar registros agregados despues.
		this.normalizeSeedBecas();
	}

	getBecas() {
		return this.currentBecas;
	}

	private normalizeSeedBecas(): void {
		this.becas.update((list) => {
			let changed = false;
			const next = list.map((item) => {
				if (!item.id.startsWith('student-beca-')) {
					return item;
				}

				if (item.studentCode === TEST_STUDENT_CODE && item.studentEmail === TEST_STUDENT_EMAIL) {
					return item;
				}

				changed = true;
				return {
					...item,
					studentCode: TEST_STUDENT_CODE,
					studentEmail: TEST_STUDENT_EMAIL
				};
			});

			if (changed) {
				this.store.saveCollection(STORAGE_KEY, next);
			}

			return next;
		});
	}
}
