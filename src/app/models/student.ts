export type StudentStatus = 'Activo' | 'Inactivo';

export interface Student {
	id: number;
	fullName: string;
	code: string;
	program: string;
	status: StudentStatus;
}
