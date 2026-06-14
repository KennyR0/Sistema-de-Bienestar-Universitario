import { Injectable, inject } from '@angular/core';
import { SolicitudEstudiante } from '../models/solicitud-estudiante';
import { SolicitudesService } from './solicitudes.service';

@Injectable({ providedIn: 'root' })
export class StudentSolicitudesService {
	private readonly solicitudesService = inject(SolicitudesService);

	getSolicitudes() {
		return this.solicitudesService.getSolicitudes();
	}

	addSolicitud(solicitud: SolicitudEstudiante) {
		this.solicitudesService.addSolicitud(solicitud);
	}

	updateSolicitud(original: SolicitudEstudiante, updated: SolicitudEstudiante) {
		this.solicitudesService.updateSolicitud(original, updated);
	}

	deleteSolicitud(target: SolicitudEstudiante) {
		this.solicitudesService.deleteSolicitud(target);
	}

	createSolicitud(input: Parameters<SolicitudesService['createSolicitud']>[0]) {
		return this.solicitudesService.createSolicitud(input);
	}
}
