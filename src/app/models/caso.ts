export type CasoRiesgo = 'Académico' | 'Personal' | 'Social' | 'Económico';
export type CasoEstado = 'Activo' | 'Cerrado';

export interface Caso {
	id: string;
	studentName: string;
	riskType: CasoRiesgo;
	status: CasoEstado;
	startDate: string;
	lastUpdate: string;
}
