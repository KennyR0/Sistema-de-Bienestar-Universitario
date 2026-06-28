export type StudentCitaEstado = 'Programada' | 'Completada' | 'Cancelada';

export interface StudentCita {
	id: string;
	studentCode?: string;
	studentEmail?: string;
	professionalName: string;
	date: string;
	time: string;
	type: string;
	status: StudentCitaEstado;
	rescheduleRequested?: boolean;
	studentRequestNote?: string;
}
