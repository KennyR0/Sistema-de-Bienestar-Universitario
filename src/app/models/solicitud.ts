export type SolicitudTipo = 'Psicológica' | 'Médica' | 'Social' | 'Académica';
export type SolicitudEstado =
	| 'Pendiente'
	| 'En triage'
	| 'Aprobada'
	| 'En Proceso'
	| 'Completada'
	| 'Rechazada';
export type SolicitudPrioridad = 'Alta' | 'Media' | 'Baja';
export type CanalContacto = 'Correo institucional' | 'Teléfono' | 'WhatsApp' | 'Presencial';
export type SemestreAcademico =
	| 'Primer semestre'
	| 'Segundo semestre'
	| 'Tercer semestre'
	| 'Cuarto semestre'
	| 'Quinto semestre'
	| 'Sexto semestre'
	| 'Séptimo semestre'
	| 'Octavo semestre'
	| 'Noveno semestre'
	| 'Décimo semestre';

export interface SolicitudHistorial {
	id: string;
	date: string;
	title: string;
	detail: string;
	author: string;
}

export interface SolicitudAdjunto {
	id: string;
	name: string;
	type: string;
	size: string;
}

export interface Solicitud {
	id: string;
	studentId?: number;
	studentName: string;
	studentCode: string;
	studentEmail?: string;
	faculty: string;
	program: string;
	semester: SemestreAcademico;
	type: SolicitudTipo;
	subject: string;
	description: string;
	date: string;
	status: SolicitudEstado;
	priority: SolicitudPrioridad;
	contactChannel: CanalContacto;
	contactValue: string;
	availability: string;
	consent: boolean;
	assignedProfessional?: string;
	nextAction?: string;
	observations: string;
	attachments: SolicitudAdjunto[];
	history: SolicitudHistorial[];
}
