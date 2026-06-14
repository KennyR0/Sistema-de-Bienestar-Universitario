export type StudentCitaEstado = 'Programada' | 'Completada' | 'Cancelada';

export interface StudentCita {
	id: string;
	professionalName: string;
	date: string;
	time: string;
	type: string;
	status: StudentCitaEstado;
}
