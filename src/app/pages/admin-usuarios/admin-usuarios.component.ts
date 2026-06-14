import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario, UsuarioEstado, UsuarioRol } from '../../models/usuario';

@Component({
	selector: 'app-admin-usuarios',
	imports: [CommonModule],
	templateUrl: './admin-usuarios.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsuariosComponent {
	private readonly usuariosService = inject(UsuariosService);
	private readonly usuarios = this.usuariosService.getUsuarios();
	searchTerm = signal('');
	readonly roleOptions: UsuarioRol[] = ['Administrador', 'Personal', 'Estudiante'];
	readonly statusOptions: UsuarioEstado[] = ['Activo', 'Inactivo'];

	editingUsuario = signal<Usuario | null>(null);
	viewingUsuario = signal<Usuario | null>(null);
	draftUsuario = signal<Usuario | null>(null);

	filteredUsuarios = computed(() => {
		const term = this.searchTerm().toLowerCase().trim();
		const list = this.usuarios();

		if (!term) {
			return list;
		}

		return list.filter((usuario) =>
			`${usuario.fullName} ${usuario.email} ${usuario.role}`
				.toLowerCase()
				.includes(term)
		);
	});

	isDraftValid = computed(() => {
		const draft = this.draftUsuario();

		if (!draft) {
			return false;
		}

		return (
			draft.fullName.trim().length > 0 &&
			draft.email.trim().length > 0 &&
			draft.role.trim().length > 0 &&
			draft.status.trim().length > 0
		);
	});

	onSearchInput(value: string) {
		this.searchTerm.set(value);
	}

	onCreate() {
		this.viewingUsuario.set(null);
		this.editingUsuario.set(null);
		this.draftUsuario.set({
			id: this.usuariosService.getNextId(),
			fullName: '',
			email: '',
			role: 'Personal',
			status: 'Activo'
		});
	}

	onView(usuario: Usuario) {
		this.viewingUsuario.set(usuario);
		this.editingUsuario.set(null);
		this.draftUsuario.set(null);
	}

	onCloseView() {
		this.viewingUsuario.set(null);
	}

	onEdit(usuario: Usuario) {
		this.editingUsuario.set(usuario);
		this.viewingUsuario.set(null);
		this.draftUsuario.set({ ...usuario });
	}

	onDraftNameInput(value: string) {
		this.draftUsuario.update((draft) =>
			draft ? { ...draft, fullName: value } : draft
		);
	}

	onDraftEmailInput(value: string) {
		this.draftUsuario.update((draft) =>
			draft ? { ...draft, email: value } : draft
		);
	}

	onDraftRoleChange(value: UsuarioRol) {
		this.draftUsuario.update((draft) =>
			draft ? { ...draft, role: value } : draft
		);
	}

	onDraftStatusChange(value: UsuarioEstado) {
		this.draftUsuario.update((draft) =>
			draft ? { ...draft, status: value } : draft
		);
	}

	onCancelEdit() {
		this.editingUsuario.set(null);
		this.draftUsuario.set(null);
	}

	onSaveEdit() {
		const original = this.editingUsuario();
		const draft = this.draftUsuario();

		if (!draft || !this.isDraftValid()) {
			return;
		}

		if (original) {
			this.usuariosService.updateUsuario(original, draft);
		} else {
			this.usuariosService.addUsuario(draft);
		}
		this.editingUsuario.set(null);
		this.draftUsuario.set(null);
	}

	onDelete(usuario: Usuario) {
		this.usuariosService.deleteUsuario(usuario);

		if (this.editingUsuario() === usuario) {
			this.editingUsuario.set(null);
			this.draftUsuario.set(null);
		}

		if (this.viewingUsuario() === usuario) {
			this.viewingUsuario.set(null);
		}
	}
}
