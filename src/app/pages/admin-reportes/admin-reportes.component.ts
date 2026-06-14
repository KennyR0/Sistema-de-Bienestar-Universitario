import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../services/reportes.service';
import { ReporteGuardado, ReporteTipo } from '../../models/reporte';

@Component({
	selector: 'app-admin-reportes',
	imports: [CommonModule],
	templateUrl: './admin-reportes.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminReportesComponent {
	private readonly reportesService = inject(ReportesService);
	readonly reportes = this.reportesService.getReportes();
	readonly stats = this.reportesService.getStats();
	readonly reportTypes = this.reportesService.reportTypes;

	viewingReporte = signal<ReporteGuardado | null>(null);
	selectedType = signal<ReporteTipo>('Solicitudes');
	startDate = signal('');
	endDate = signal('');

	onTypeChange(value: ReporteTipo) {
		this.selectedType.set(value);
	}

	onStartDateChange(value: string) {
		this.startDate.set(value);
	}

	onEndDateChange(value: string) {
		this.endDate.set(value);
	}

	onClear() {
		this.selectedType.set('Solicitudes');
		this.startDate.set('');
		this.endDate.set('');
		this.viewingReporte.set(null);
	}

	onGenerate() {
		const type = this.selectedType();
		const start = this.startDate();
		const end = this.endDate();
		const range = start && end ? ` (${start} a ${end})` : '';

		this.reportesService.addReporte({
			id: this.reportesService.getNextId(),
			name: `Reporte de ${type}${range}`,
			type,
			generatedBy: 'Administrador',
			date: new Date().toISOString().slice(0, 10)
		});
	}

	onView(reporte: ReporteGuardado) {
		this.viewingReporte.set(reporte);
	}

	onCloseView() {
		this.viewingReporte.set(null);
	}
}
