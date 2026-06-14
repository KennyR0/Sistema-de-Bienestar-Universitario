export type ReporteTipo = 'Solicitudes' | 'Becas' | 'Casos' | 'Citas' | 'Estudiantes';

export interface ReporteGuardado {
	id: string;
	name: string;
	type: ReporteTipo;
	generatedBy: string;
	date: string;
}

export interface EstadisticaRapida {
	label: string;
	value: string;
}
