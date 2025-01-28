import { Component, HostListener } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from './models and helpers/material.module';
import { HttpClientModule } from '@angular/common/http';
import { TaskService } from './models and helpers/task.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MaterialModule, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [TaskService]
})
export class AppComponent {
  isSticky: boolean = false;

  constructor(private router: Router) { }


  @HostListener('mousewheel', ['onScroll'])
  onScroll() {
    const stickySection = document.querySelector('.sticky-header');
    if (stickySection) {
      const rect = stickySection.getBoundingClientRect();
      this.isSticky = rect.top <= 0;
    }
  }


}
