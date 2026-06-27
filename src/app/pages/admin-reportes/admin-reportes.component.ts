import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
	isGenerating = signal(false);
	feedbackMessage = signal('');
	private lastGeneratedKey = '';

	readonly canGenerate = computed(() => !this.isGenerating());

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
		this.feedbackMessage.set('Formulario listo para un nuevo corte.');
	}

	onGenerate() {
		if (!this.canGenerate()) {
			return;
		}

		const type = this.selectedType();
		const start = this.startDate();
		const end = this.endDate();
		const range = start && end ? ` (${start} a ${end})` : '';
		const key = `${type}|${start}|${end}|${new Date().toISOString().slice(0, 10)}`;

		if (key === this.lastGeneratedKey) {
			this.feedbackMessage.set('Ese reporte ya fue generado en esta sesión. Cambie el rango o limpie el formulario.');
			return;
		}

		this.isGenerating.set(true);
		this.lastGeneratedKey = key;

		const report: ReporteGuardado = {
			id: this.reportesService.getNextId(),
			name: `Reporte de ${type}${range}`,
			type,
			generatedBy: 'Administrador',
			date: new Date().toISOString().slice(0, 10)
		};

		this.reportesService.addReporte(report);
		this.viewingReporte.set(report);
		this.feedbackMessage.set('Reporte generado y seleccionado para revisión.');

		setTimeout(() => this.isGenerating.set(false), 900);
	}

	onView(reporte: ReporteGuardado) {
		this.viewingReporte.set(reporte);
		this.feedbackMessage.set('');
	}

	onCloseView() {
		this.viewingReporte.set(null);
	}

	onDelete(reporte: ReporteGuardado) {
		this.reportesService.deleteReporte(reporte);

		if (this.viewingReporte()?.id === reporte.id) {
			this.viewingReporte.set(null);
		}

		this.feedbackMessage.set('Reporte eliminado del historial.');
	}

	onClearReports() {
		this.reportesService.clearReportes();
		this.viewingReporte.set(null);
		this.lastGeneratedKey = '';
		this.feedbackMessage.set('Historial de reportes limpiado.');
	}
}
