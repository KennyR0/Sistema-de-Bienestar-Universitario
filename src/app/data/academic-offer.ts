export interface FacultyOffer {
	name: string;
	careers: string[];
}

export const FACULTY_OFFERS: FacultyOffer[] = [
	{
		name: 'Facultad Ciencias de la Salud',
		careers: [
			'Medicina',
			'Odontologia',
			'Enfermería',
			'Fisioterapia',
			'Fonoaudiología',
			'Laboratorio Clínico',
			'Terapia Ocupacional',
			'Psicología',
			'Nutrición y Dietética'
		]
	},
	{
		name: 'Facultad Ciencias Administrativas, Contables y Comercio',
		careers: [
			'Administración de Empresas',
			'Mercadotecnia',
			'Contabilidad y Auditoría',
			'Auditoría y Control de Gestión',
			'Finanzas',
			'Comercio Exterior',
			'Gestión de la Información Gerencial',
			'Gestión del Talento Humano'
		]
	},
	{
		name: 'Facultad de Educación y Turismo',
		careers: [
			'Educación Inicial',
			'Educación Especial',
			'Psicología Educativa',
			'Educación Básica',
			'Pedagogía de la Actividad Física y el Deporte',
			'Pedagogía de la Lengua y la Literatura',
			'Pedagogía de los Idiomas Nacionales y Extranjeros',
			'Turismo',
			'Hospitalidad y Hotelería',
			'Artes Plásticas',
			'Sociología',
			'Artes Escénicas',
			'Educación Básica Bilingüe',
			'Arqueología',
			'Diseño Textil e Indumentaria',
			'Educación Inicial Bilingüe',
			'Entrenamiento Deportivo',
			'Gestión Hotelera Internacional',
			'Educación Inclusiva'
		]
	},
	{
		name: 'Facultad Ingeniería, Industria y Arquitectura',
		careers: [
			'Ingeniería Civil',
			'Ingeniería Marítima',
			'Electricidad',
			'Arquitectura',
			'Ingeniería Industrial'
		]
	},
	{
		name: 'Facultad Ciencias de la Vida y Tecnologías',
		careers: [
			'Ingeniería Agropecuaria',
			'Agronegocios',
			'Ingeniería Agroindustrial',
			'Ingeniería Ambiental',
			'Ingeniería en Tecnologías de la Información',
			'Ingeniería en Software',
			'Ingeniería en Sistema',
			'Biología',
			'Ingeniería de Alimentos'
		]
	},
	{
		name: 'Facultad de Ciencias Sociales Derecho y Bienestar',
		careers: [
			'Derecho',
			'Criminología y Ciencias Forenses',
			'Economía',
			'Trabajo Social',
			'Comunicación',
			'Gestión Pública y Desarrollo'
		]
	},
	{
		name: 'Facultad de Artes, Humanidades y Patrimonio',
		careers: [
			'Artes Plásticas',
			'Arqueología',
			'Artes Escénicas',
			'Diseño Textil e Indumentaria',
			'Sociología'
		]
	}
];

export function careerBelongsToFaculty(faculty: string, career: string): boolean {
	return FACULTY_OFFERS.some(
		(offer) => offer.name === faculty && offer.careers.includes(career)
	);
}
