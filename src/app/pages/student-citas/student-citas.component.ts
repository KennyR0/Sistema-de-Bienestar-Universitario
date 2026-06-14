import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentCitasService } from '../../services/student-citas.service';
import { StudentCita } from '../../models/student-cita';

@Component({
	selector: 'app-student-citas',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './student-citas.component.html'
})
export class StudentCitasComponent {
	private readonly citasService = inject(StudentCitasService);
	readonly citas = this.citasService.getCitas();

	statusClass(item: StudentCita) {
		switch (item.status) {
			case 'Programada':
				return 'badge-pending';
			case 'Completada':
				return 'badge-completed';
			case 'Cancelada':
				return 'badge-canceled';
			default:
				return '';
		}
	}

	trackByIndex(index: number) {
		return index;
	}
}
