export type AuthRole = 'admin' | 'student';
export type AuthUserStatus = 'Activo' | 'Inactivo';

export interface AuthUser {
	id: string;
	email: string;
	password: string;
	role: AuthRole;
	fullName: string;
	status: AuthUserStatus;
	studentId?: number;
	studentCode?: string;
	faculty?: string;
	program?: string;
	semester?: string;
}

export interface AuthSession {
	userId: string;
}

export interface RegisterStudentInput {
	fullName: string;
	email: string;
	password: string;
	faculty: string;
	program: string;
}
