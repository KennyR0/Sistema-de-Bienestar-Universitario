export type BecaTipo = 'Mérito' | 'Necesidad';
export type BecaEstado = 'Activa' | 'Inactiva';

export interface Beca {
	id: string;
	name: string;
	type: BecaTipo;
	amount: number;
	criteria: string;
	status: BecaEstado;
}
