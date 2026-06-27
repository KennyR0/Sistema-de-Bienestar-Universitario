export type StudentStatus = 'Activo' | 'Inactivo';

export interface Student {
	id: number;
	fullName: string;
	code: string;
	faculty?: string;
	program: string;
	semester?: string;
	status: StudentStatus;
}
