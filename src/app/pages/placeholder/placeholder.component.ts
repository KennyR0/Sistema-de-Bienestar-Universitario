import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placeholder.component.html'
})
export class PlaceholderComponent {
  title = 'Modulo';
  description = 'Esta pantalla esta en construccion.';

  constructor(private readonly route: ActivatedRoute) {
    const data = this.route.snapshot.data;

    if (data['title']) {
      this.title = data['title'];
    }

    if (data['description']) {
      this.description = data['description'];
    }
  }
}
