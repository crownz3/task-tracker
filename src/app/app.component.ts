import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MaterialModule } from './models and helpers/material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TaskService } from './models and helpers/task.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MaterialModule,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[TaskService]
})
export class AppComponent {
  title = 'task-tracker';

  constructor(private router: Router) {}

  navigateToTaskForm() {
    this.router.navigateByUrl('/task-form');
  }
}
