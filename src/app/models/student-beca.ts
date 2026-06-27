export type StudentBecaEstado = 'Activa' | 'Inactiva';

export interface StudentBeca {
	id: string;
	studentCode?: string;
	studentEmail?: string;
	name: string;
	type: string;
	amount: number;
	status: StudentBecaEstado;
}
