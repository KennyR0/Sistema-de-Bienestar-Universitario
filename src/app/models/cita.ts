export type CitaTipo = 'Médica' | 'Psicológica';
export type CitaEstado = 'Programada' | 'Completada' | 'Cancelada';

export interface Cita {
	id: string;
	studentName: string;
	professionalName: string;
	date: string;
	time: string;
	type: CitaTipo;
	status: CitaEstado;
}
