import { Injectable, computed, inject } from '@angular/core';
import { StudentCita } from '../models/student-cita';
import { AuthService } from './auth.service';
import { CitasService } from './citas.service';

@Injectable({ providedIn: 'root' })
export class StudentCitasService {
	private readonly authService = inject(AuthService);
	private readonly citas = inject(CitasService).getCitas();
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
				status: item.status
			}));
	});

	getCitas() {
		return this.currentCitas;
	}
}
