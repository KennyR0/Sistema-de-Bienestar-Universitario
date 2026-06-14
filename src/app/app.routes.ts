import { Routes } from '@angular/router';
import { adminGuard, studentGuard } from './guards/role.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminBecasComponent } from './pages/admin-becas/admin-becas.component';
import { AdminCasosComponent } from './pages/admin-casos/admin-casos.component';
import { AdminEstudiantesComponent } from './pages/admin-estudiantes/admin-estudiantes.component';
import { AdminCitasComponent } from './pages/admin-citas/admin-citas.component';
import { AdminReportesComponent } from './pages/admin-reportes/admin-reportes.component';
import { AdminUsuariosComponent } from './pages/admin-usuarios/admin-usuarios.component';
import { AdminSolicitudesComponent } from './pages/admin-solicitudes/admin-solicitudes.component';
import { StudentBecasComponent } from './pages/student-becas/student-becas.component';
import { StudentCitasComponent } from './pages/student-citas/student-citas.component';
import { StudentNuevaSolicitudComponent } from './pages/student-nueva-solicitud/student-nueva-solicitud.component';
import { StudentSolicitudesComponent } from './pages/student-solicitudes/student-solicitudes.component';
import { RoleSelectComponent } from './pages/role-select/role-select.component';

export const routes: Routes = [
	{
		path: '',
		component: RoleSelectComponent
	},
	{
		path: 'admin',
		canActivate: [adminGuard],
		children: [
			{
				path: 'dashboard',
				component: AdminDashboardComponent
			},
			{
				path: 'estudiantes',
				component: AdminEstudiantesComponent
			},
			{
				path: 'solicitudes',
				component: AdminSolicitudesComponent
			},
			{
				path: 'citas',
				component: AdminCitasComponent
			},
			{
				path: 'becas',
				component: AdminBecasComponent
			},
			{
				path: 'casos',
				component: AdminCasosComponent
			},
			{
				path: 'reportes',
				component: AdminReportesComponent
			},
			{
				path: 'usuarios',
				component: AdminUsuariosComponent
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'dashboard'
			}
		]
	},
	{
		path: 'estudiante',
		canActivate: [studentGuard],
		children: [
			{
				path: 'solicitudes',
				component: StudentSolicitudesComponent
			},
			{
				path: 'citas',
				component: StudentCitasComponent
			},
			{
				path: 'becas',
				component: StudentBecasComponent
			},
			{
				path: 'nueva-solicitud',
				component: StudentNuevaSolicitudComponent
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'solicitudes'
			}
		]
	},
	{
		path: '**',
		redirectTo: ''
	}
];
