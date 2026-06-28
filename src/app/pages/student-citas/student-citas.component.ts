import { Component, inject, signal } from '@angular/core';
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
	requestingCita = signal<StudentCita | null>(null);
	rescheduleNote = signal('');
	feedbackMessage = signal('');

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

	onOpenReschedule(item: StudentCita) {
		if (item.status !== 'Programada') {
			return;
		}

		this.requestingCita.set(item);
		this.rescheduleNote.set(item.studentRequestNote ?? '');
		this.feedbackMessage.set('');
	}

	onCancelReschedule() {
		this.requestingCita.set(null);
		this.rescheduleNote.set('');
	}

	onRescheduleNoteInput(value: string) {
		this.rescheduleNote.set(value);
	}

	onSubmitReschedule() {
		const cita = this.requestingCita();

		if (!cita) {
			return;
		}

		this.citasService.requestReschedule(cita.id, this.rescheduleNote());
		this.requestingCita.set(null);
		this.rescheduleNote.set('');
		this.feedbackMessage.set('Solicitud de reagendamiento enviada a Bienestar.');
	}
}
