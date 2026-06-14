import { Injectable, Signal, computed, inject } from '@angular/core';
import { BecasService } from './becas.service';
import { CasosService } from './casos.service';
import { CitasService } from './citas.service';
import { ReportesService } from './reportes.service';
import { SolicitudesService } from './solicitudes.service';
import { StudentsService } from './students.service';
import { UsuariosService } from './usuarios.service';

export interface DashboardMetric {
	label: string;
	value: string;
	action: string;
	link: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
	private readonly students = inject(StudentsService).getStudents();
	private readonly solicitudes = inject(SolicitudesService).getSolicitudes();
	private readonly citas = inject(CitasService).getCitas();
	private readonly becas = inject(BecasService).getBecas();
	private readonly casos = inject(CasosService).getCasos();
	private readonly reportes = inject(ReportesService).getReportes();
	private readonly usuarios = inject(UsuariosService).getUsuarios();

	getMetrics(): Signal<DashboardMetric[]> {
		return computed(() => [
			{
				label: 'Estudiantes registrados',
				value: String(this.students().length),
				action: 'Ver y gestionar',
				link: '/admin/estudiantes'
			},
			{
				label: 'Solicitudes pendientes',
				value: String(this.solicitudes().filter((item) => item.status === 'Pendiente').length),
				action: 'Ver y gestionar',
				link: '/admin/solicitudes'
			},
			{
				label: 'Citas programadas',
				value: String(this.citas().filter((item) => item.status === 'Programada').length),
				action: 'Ver y gestionar',
				link: '/admin/citas'
			},
			{
				label: 'Becas activas',
				value: String(this.becas().filter((item) => item.status === 'Activa').length),
				action: 'Ver y gestionar',
				link: '/admin/becas'
			},
			{
				label: 'Casos abiertos',
				value: String(this.casos().filter((item) => item.status === 'Activo').length),
				action: 'Ver y gestionar',
				link: '/admin/casos'
			},
			{
				label: 'Reportes generados',
				value: String(this.reportes().length),
				action: 'Ver y generar',
				link: '/admin/reportes'
			},
			{
				label: 'Usuarios del sistema',
				value: String(this.usuarios().length),
				action: 'Gestionar',
				link: '/admin/usuarios'
			}
		]);
	}
}
