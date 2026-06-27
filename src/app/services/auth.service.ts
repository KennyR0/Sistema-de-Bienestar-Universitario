import { Injectable, inject, signal } from '@angular/core';
import { careerBelongsToFaculty } from '../data/academic-offer';
import { AuthSession, AuthUser, RegisterStudentInput } from '../models/auth-user';
import { StudentsService } from './students.service';
import { UsuariosService } from './usuarios.service';

const USERS_KEY = 'bienestar:v1:auth-users';
const SESSION_KEY = 'bienestar:v1:auth-session';
const TEST_STUDENT_CODE = '20240001';
const DEFAULT_SEMESTER = 'Primer semestre';

const SEED_USERS: AuthUser[] = [
	{
		id: 'auth-admin-001',
		email: 'Admin@live.uleam.edu.ec',
		password: 'Admin123',
		role: 'admin',
		fullName: 'Administrador Bienestar',
		status: 'Activo'
	},
	{
		id: 'auth-student-001',
		email: 'prueba123@live.uleam.edu.ec',
		password: 'prueba123',
		role: 'student',
		fullName: 'Estudiante de Prueba',
		status: 'Activo',
		studentId: 105,
		studentCode: TEST_STUDENT_CODE,
		faculty: 'Facultad Ciencias de la Vida y Tecnologías',
		program: 'Ingeniería en Software',
		semester: 'Segundo semestre'
	}
];

@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly studentsService = inject(StudentsService);
	private readonly usuariosService = inject(UsuariosService);
	private readonly usersSignal = signal<AuthUser[]>(this.readUsers());
	private readonly currentUserSignal = signal<AuthUser | null>(this.readSessionUser());

	readonly users = this.usersSignal.asReadonly();
	readonly currentUser = this.currentUserSignal.asReadonly();

	constructor() {
		// Mantiene las cuentas base visibles tambien en los modulos de estudiantes y usuarios.
		this.ensureSeedMirrors();
	}

	login(email: string, password: string): { success: boolean; message?: string } {
		const normalizedEmail = this.normalizeEmail(email);
		const user = this.usersSignal().find(
			(item) => this.normalizeEmail(item.email) === normalizedEmail && item.password === password
		);

		if (!user || user.status !== 'Activo') {
			return { success: false, message: 'Credenciales incorrectas o cuenta inactiva.' };
		}

		this.setSession(user);
		return { success: true };
	}

	logout(): void {
		this.currentUserSignal.set(null);

		if (this.canUseStorage()) {
			localStorage.removeItem(SESSION_KEY);
		}
	}

	registerStudent(input: RegisterStudentInput): { success: boolean; message?: string } {
		const fullName = input.fullName.trim();
		const email = input.email.trim();
		const password = input.password.trim();
		const faculty = input.faculty.trim();
		const program = input.program.trim();
		const normalizedEmail = this.normalizeEmail(email);

		if (!fullName || !email || !password || !faculty || !program) {
			return { success: false, message: 'Complete todos los campos para crear la cuenta.' };
		}

		if (!this.isValidStudentEmail(normalizedEmail)) {
			return {
				success: false,
				message: 'Use un correo estudiantil que empiece con e y termine en @live.uleam.edu.ec.'
			};
		}

		if (password.length < 6) {
			return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
		}

		if (this.usersSignal().some((user) => this.normalizeEmail(user.email) === normalizedEmail)) {
			return { success: false, message: 'Ya existe una cuenta con ese correo.' };
		}

		if (!careerBelongsToFaculty(faculty, program)) {
			return { success: false, message: 'Seleccione una carrera válida para la facultad elegida.' };
		}

		const studentId = this.studentsService.getNextId();
		const studentCode = this.createStudentCode(studentId);
		const user: AuthUser = {
			id: `auth-${Date.now()}`,
			email,
			password,
			role: 'student',
			fullName,
			status: 'Activo',
			studentId,
			studentCode,
			faculty,
			program,
			semester: DEFAULT_SEMESTER
		};

		// El registro de estudiante debe existir en autenticacion, ficha estudiantil y usuarios internos.
		this.studentsService.addStudent({
			id: studentId,
			fullName,
			code: studentCode,
			faculty,
			program,
			semester: DEFAULT_SEMESTER,
			status: 'Activo'
		});

		this.usuariosService.addUsuario({
			id: this.usuariosService.getNextId(),
			fullName,
			email,
			role: 'Estudiante',
			status: 'Activo'
		});

		this.saveUsers([...this.usersSignal(), user]);
		this.setSession(user);
		return { success: true };
	}

	private setSession(user: AuthUser): void {
		this.currentUserSignal.set(user);

		if (this.canUseStorage()) {
			localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id } satisfies AuthSession));
		}
	}

	private readUsers(): AuthUser[] {
		if (!this.canUseStorage()) {
			return [...SEED_USERS];
		}

		const raw = localStorage.getItem(USERS_KEY);
		let stored: AuthUser[] = [];

		if (raw) {
			try {
				const parsed: unknown = JSON.parse(raw);
				stored = Array.isArray(parsed) ? (parsed as AuthUser[]) : [];
			} catch {
				stored = [];
			}
		}

		// Las cuentas semilla se mezclan con lo guardado para no perder accesos base tras cambios de version.
		const merged = this.mergeSeedUsers(stored);
		this.writeUsers(merged);
		return merged;
	}

	private readSessionUser(): AuthUser | null {
		if (!this.canUseStorage()) {
			return null;
		}

		const raw = localStorage.getItem(SESSION_KEY);

		if (!raw) {
			return null;
		}

		try {
			// La sesion solo guarda el id; el usuario real se revalida contra el estado actual.
			const parsed = JSON.parse(raw) as AuthSession;
			return this.usersSignal().find((user) => user.id === parsed.userId && user.status === 'Activo') ?? null;
		} catch {
			localStorage.removeItem(SESSION_KEY);
			return null;
		}
	}

	private mergeSeedUsers(stored: AuthUser[]): AuthUser[] {
		const merged = [...stored];

		for (const seed of SEED_USERS) {
			const index = merged.findIndex(
				(user) => this.normalizeEmail(user.email) === this.normalizeEmail(seed.email)
			);

			if (index >= 0) {
				merged[index] = {
					...seed,
					...merged[index],
					faculty: merged[index].faculty ?? seed.faculty,
					program: merged[index].program ?? seed.program,
					semester: merged[index].semester ?? seed.semester ?? DEFAULT_SEMESTER
				};
			} else {
				merged.push(seed);
			}
		}

		return merged.map((user) =>
			user.role === 'student' ? { ...user, semester: user.semester ?? DEFAULT_SEMESTER } : user
		);
	}

	private saveUsers(users: AuthUser[]): void {
		this.usersSignal.set(users);
		this.writeUsers(users);
	}

	private writeUsers(users: AuthUser[]): void {
		if (this.canUseStorage()) {
			localStorage.setItem(USERS_KEY, JSON.stringify(users));
		}
	}

	private ensureSeedMirrors(): void {
		// Los datos de prueba se replican cuando falta alguna pieza creada en versiones anteriores.
		const students = this.studentsService.getStudents()();

		if (!students.some((student) => student.code === TEST_STUDENT_CODE)) {
			const seedStudentId = students.some((student) => student.id === 105)
				? this.studentsService.getNextId()
				: 105;

			this.studentsService.addStudent({
				id: seedStudentId,
				fullName: 'Estudiante de Prueba',
				code: TEST_STUDENT_CODE,
				faculty: 'Facultad Ciencias de la Vida y Tecnologías',
				program: 'Ingeniería en Software',
				semester: 'Segundo semestre',
				status: 'Activo'
			});
		}

		const usuarios = this.usuariosService.getUsuarios()();

		if (!usuarios.some((user) => this.normalizeEmail(user.email) === 'admin@live.uleam.edu.ec')) {
			this.usuariosService.addUsuario({
				id: 'user-admin-seed',
				fullName: 'Administrador Bienestar',
				email: 'Admin@live.uleam.edu.ec',
				role: 'Administrador',
				status: 'Activo'
			});
		}

		if (!usuarios.some((user) => this.normalizeEmail(user.email) === 'prueba123@live.uleam.edu.ec')) {
			this.usuariosService.addUsuario({
				id: 'user-student-seed',
				fullName: 'Estudiante de Prueba',
				email: 'prueba123@live.uleam.edu.ec',
				role: 'Estudiante',
				status: 'Activo'
			});
		}
	}

	private normalizeEmail(email: string): string {
		return email.trim().toLowerCase();
	}

	private isValidStudentEmail(email: string): boolean {
		return /^e[a-z0-9._%+-]*@live\.uleam\.edu\.ec$/.test(email);
	}

	private createStudentCode(studentId: number): string {
		const year = new Date().getFullYear();
		return `${year}${String(studentId).padStart(4, '0')}`;
	}

	private canUseStorage(): boolean {
		return typeof localStorage !== 'undefined';
	}
}
