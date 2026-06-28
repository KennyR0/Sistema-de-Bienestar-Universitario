import { Injectable, computed, inject } from '@angular/core';
import { StudentCita } from '../models/student-cita';
import { AuthService } from './auth.service';
import { CitasService } from './citas.service';

@Injectable({ providedIn: 'root' })
export class StudentCitasService {
	private readonly authService = inject(AuthService);
	private readonly citasService = inject(CitasService);
	private readonly citas = this.citasService.getCitas();
	private readonly currentCitas = computed<StudentCita[]>(() => {
		const user = this.authService.currentUser();

		if (!user || user.role !== 'student' || !user.studentCode) {
			return [];
		}

		return this.citas()
			.filter((item) => item.studentCode === user.studentCode)
			.map((item) => ({
				id: item.id,
				studentCode: item.studentCode,
				studentEmail: item.studentEmail,
				professionalName: item.professionalName,
				date: item.date,
				time: item.time,
				type: item.type,
				status: item.status,
				rescheduleRequested: item.rescheduleRequested,
				studentRequestNote: item.studentRequestNote
			}));
	});

	getCitas() {
		return this.currentCitas;
	}

	requestReschedule(citaId: string, note: string) {
		const user = this.authService.currentUser();
		const cita = this.citas().find((item) => item.id === citaId);

		if (!user || user.role !== 'student' || !cita || cita.studentCode !== user.studentCode) {
			return;
		}

		this.citasService.updateCita(cita, {
			...cita,
			rescheduleRequested: true,
			studentRequestNote: note.trim() || 'El estudiante solicita revisar la fecha u hora asignada.'
		});
	}
}
