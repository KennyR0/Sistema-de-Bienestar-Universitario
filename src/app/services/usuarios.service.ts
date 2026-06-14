import { Injectable, inject } from '@angular/core';
import { Usuario } from '../models/usuario';
import { LocalStorageStoreService } from './local-storage-store.service';

const STORAGE_KEY = 'bienestar:v1:usuarios';
const SEED_USUARIOS: Usuario[] = [
	{
		id: 'user-001',
		fullName: 'Juan Pérez',
		email: 'juan.perez@uleam.edu.ec',
		role: 'Administrador',
		status: 'Activo'
	},
	{
		id: 'user-002',
		fullName: 'María García',
		email: 'maria.garcia@uleam.edu.ec',
		role: 'Personal',
		status: 'Activo'
	},
	{
		id: 'user-003',
		fullName: 'Carlos López',
		email: 'carlos.lopez@uleam.edu.ec',
		role: 'Estudiante',
		status: 'Inactivo'
	}
];

@Injectable({ providedIn: 'root' })
export class UsuariosService {
	private readonly store = inject(LocalStorageStoreService);
	private readonly usuarios = this.store.createCollection<Usuario>(STORAGE_KEY, SEED_USUARIOS);

	getUsuarios() {
		return this.usuarios.asReadonly();
	}

	addUsuario(usuario: Usuario) {
		this.usuarios.update((list) => {
			const next = [...list, { ...usuario }];
			this.persist(next);
			return next;
		});
	}

	updateUsuario(original: Usuario, updated: Usuario) {
		this.usuarios.update((list) => {
			const next = list.map((item) => (item.id === original.id ? { ...updated } : item));
			this.persist(next);
			return next;
		});
	}

	deleteUsuario(target: Usuario) {
		this.usuarios.update((list) => {
			const next = list.filter((item) => item.id !== target.id);
			this.persist(next);
			return next;
		});
	}

	getNextId(): string {
		return `user-${Date.now()}`;
	}

	private persist(value: Usuario[]) {
		this.store.saveCollection(STORAGE_KEY, value);
	}
}
