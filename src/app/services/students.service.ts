import { Injectable, inject } from '@angular/core';
import { Student } from '../models/student';
import { LocalStorageStoreService } from './local-storage-store.service';

const STORAGE_KEY = 'bienestar:v1:students';
const SEED_STUDENTS: Student[] = [
	{
		id: 101,
		fullName: 'Juan Pérez García',
		code: '20210001',
		program: 'Ingeniería de Sistemas',
		status: 'Activo'
	},
	{
		id: 102,
		fullName: 'María López Díaz',
		code: '20200015',
		program: 'Psicología',
		status: 'Activo'
	},
	{
		id: 103,
		fullName: 'Carlos Ruiz Soto',
		code: '20220003',
		program: 'Derecho',
		status: 'Activo'
	},
	{
		id: 104,
		fullName: 'Ana Torres Vega',
		code: '20230022',
		program: 'Trabajo Social',
		status: 'Inactivo'
	}
];

@Injectable({ providedIn: 'root' })
export class StudentsService {
	private readonly store = inject(LocalStorageStoreService);
	private readonly students = this.store.createCollection<Student>(STORAGE_KEY, SEED_STUDENTS);

	getStudents() {
		return this.students.asReadonly();
	}

	addStudent(student: Student) {
		this.students.update((list) => {
			const next = [...list, { ...student }];
			this.persist(next);
			return next;
		});
	}

	updateStudent(original: Student, updated: Student) {
		this.students.update((list) => {
			const next = list.map((item) => (item.id === original.id ? { ...updated } : item));
			this.persist(next);
			return next;
		});
	}

	deleteStudent(target: Student) {
		this.students.update((list) => {
			const next = list.filter((item) => item.id !== target.id);
			this.persist(next);
			return next;
		});
	}

	getNextId(): number {
		return Math.max(100, ...this.students().map((student) => student.id)) + 1;
	}

	private persist(value: Student[]) {
		this.store.saveCollection(STORAGE_KEY, value);
	}
}
