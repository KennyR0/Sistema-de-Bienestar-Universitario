export type UsuarioRol = 'Administrador' | 'Personal' | 'Estudiante';
export type UsuarioEstado = 'Activo' | 'Inactivo';

export interface Usuario {
	id: string;
	fullName: string;
	email: string;
	role: UsuarioRol;
	status: UsuarioEstado;
}
