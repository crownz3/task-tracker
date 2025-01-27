import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../models and helpers/task.service';
import { Task } from '../../models and helpers/task.model';
import { MaterialModule } from '../../models and helpers/material.module';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports:[MaterialModule],
  standalone:true

})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.filteredTasks = tasks;
    });
    this.taskService.fetchTasks();
  }

  filterByStatus(status: string) {
    this.filteredTasks = status
      ? this.tasks.filter((task) => task.status === status)
      : this.tasks;
  }

  editTask(task: Task) {
    // Fill the form for editing (you can navigate to a form page or show a modal)
  }
  
  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.taskService.fetchTasks();
    });
  }
  
}
