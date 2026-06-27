import { Injectable, computed, inject } from '@angular/core';
import { SolicitudEstudiante } from '../models/solicitud-estudiante';
import { AuthService } from './auth.service';
import { SolicitudesService } from './solicitudes.service';

@Injectable({ providedIn: 'root' })
export class StudentSolicitudesService {
	private readonly authService = inject(AuthService);
	private readonly solicitudesService = inject(SolicitudesService);
	private readonly solicitudes = this.solicitudesService.getSolicitudes();
	private readonly currentSolicitudes = computed(() => {
		const user = this.authService.currentUser();

		if (!user || user.role !== 'student' || !user.studentCode) {
			return [];
		}

		// El portal estudiantil solo expone solicitudes asociadas al codigo de la sesion.
		return this.solicitudes().filter((item) => item.studentCode === user.studentCode);
	});

	getSolicitudes() {
		return this.currentSolicitudes;
	}

	addSolicitud(solicitud: SolicitudEstudiante) {
		const user = this.authService.currentUser();

		if (!user || user.role !== 'student') {
			return;
		}

		// La sesion tiene prioridad sobre los campos editables para evitar suplantar otra ficha.
		this.solicitudesService.addSolicitud({
			...solicitud,
			studentId: user.studentId,
			studentName: user.fullName,
			studentCode: user.studentCode ?? solicitud.studentCode,
			studentEmail: user.email,
			faculty: solicitud.faculty,
			program: solicitud.program,
			semester: solicitud.semester
		});
	}

	updateSolicitud(original: SolicitudEstudiante, updated: SolicitudEstudiante) {
		this.solicitudesService.updateSolicitud(original, updated);
	}

	deleteSolicitud(target: SolicitudEstudiante) {
		this.solicitudesService.deleteSolicitud(target);
	}

	createSolicitud(input: Parameters<SolicitudesService['createSolicitud']>[0]) {
		const user = this.authService.currentUser();

		return this.solicitudesService.createSolicitud({
			...input,
			studentId: user?.studentId,
			studentName: user?.fullName ?? input.studentName,
			studentCode: user?.studentCode ?? input.studentCode,
			studentEmail: user?.email ?? input.studentEmail,
			faculty: input.faculty,
			program: input.program,
			semester: input.semester
		});
	}
}
