import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { CitasService } from '../../services/citas.service';
import { SolicitudesService } from '../../services/solicitudes.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly solicitudes = inject(SolicitudesService).getSolicitudes();
  private readonly citas = inject(CitasService).getCitas();

  readonly metrics = this.dashboardService.getMetrics();
  readonly criticalRequests = computed(() =>
    this.solicitudes()
      .filter((item) => item.priority === 'Alta' || item.status === 'Pendiente')
      .slice(0, 4)
  );
  readonly upcomingCitas = computed(() =>
    this.citas()
      .filter((item) => item.status === 'Programada')
      .slice(0, 4)
  );
}
