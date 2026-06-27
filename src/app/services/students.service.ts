import { Injectable, inject } from '@angular/core';
import { Student } from '../models/student';
import { LocalStorageStoreService } from './local-storage-store.service';

const STORAGE_KEY = 'bienestar:v1:students';
const DEFAULT_FACULTY = 'Facultad por registrar';
const DEFAULT_SEMESTER = 'Primer semestre';
const SEED_STUDENTS: Student[] = [
	{
		id: 101,
		fullName: 'Juan Pérez García',
		code: '20210001',
		faculty: 'Facultad Ciencias de la Vida y Tecnologías',
		program: 'Ingeniería de Sistemas',
		semester: 'Primer semestre',
		status: 'Activo'
	},
	{
		id: 102,
		fullName: 'María López Díaz',
		code: '20200015',
		faculty: 'Facultad de Trabajo Social',
		program: 'Psicología',
		semester: 'Segundo semestre',
		status: 'Activo'
	},
	{
		id: 103,
		fullName: 'Carlos Ruiz Soto',
		code: '20220003',
		faculty: 'Facultad de Jurisprudencia',
		program: 'Derecho',
		semester: 'Tercer semestre',
		status: 'Activo'
	},
	{
		id: 104,
		fullName: 'Ana Torres Vega',
		code: '20230022',
		faculty: 'Facultad de Trabajo Social',
		program: 'Trabajo Social',
		semester: 'Cuarto semestre',
		status: 'Inactivo'
	}
];

@Injectable({ providedIn: 'root' })
export class StudentsService {
	private readonly store = inject(LocalStorageStoreService);
	private readonly students = this.store.createCollection<Student>(STORAGE_KEY, SEED_STUDENTS);

	constructor() {
		// Completa campos academicos faltantes en estudiantes guardados por versiones previas.
		this.normalizeStudents();
	}

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

	private normalizeStudents() {
		this.students.update((list) => {
			let changed = false;
			const next = list.map((student) => {
				const normalized = {
					...student,
					faculty: student.faculty?.trim() || DEFAULT_FACULTY,
					semester: student.semester?.trim() || DEFAULT_SEMESTER
				};

				if (normalized.faculty !== student.faculty || normalized.semester !== student.semester) {
					changed = true;
				}

				return normalized;
			});

			if (changed) {
				this.persist(next);
			}

			return next;
		});
	}
}
