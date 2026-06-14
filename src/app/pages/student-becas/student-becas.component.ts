import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentBecasService } from '../../services/student-becas.service';
import { StudentBeca } from '../../models/student-beca';

@Component({
	selector: 'app-student-becas',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './student-becas.component.html'
})
export class StudentBecasComponent {
	private readonly becasService = inject(StudentBecasService);
	readonly becas = this.becasService.getBecas();

	statusClass(item: StudentBeca) {
		return item.status === 'Activa' ? 'badge-active' : 'badge-inactive';
	}

	trackByIndex(index: number) {
		return index;
	}
}
