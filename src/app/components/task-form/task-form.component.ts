import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../models and helpers/material.module';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models and helpers/task.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { pastDateValidator } from '../../models and helpers/validators';
import { NotificationService } from '../../shared/models and helpers/notify-service';
import { TaskService } from '../../models and helpers/task.service';

@Component({
  selector: 'app-task-form',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule], // Import necessary modules
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
  standalone: true // Mark the component as standalone
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup; // Form group to manage tasks

  constructor(
    private _fb: FormBuilder, // FormBuilder for creating reactive forms
    private _taskService: TaskService, // Service to handle task-related operations
    private _router: Router, // Router for navigation,
    private _notifyService: NotificationService
  ) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the form when the component loads
  }

  // Initialize the form with a single task
  initializeForm() {
    this.taskForm = this._fb.group({
      tasks: this._fb.array([this.createTask()]) // Create a FormArray with one task
    });
  }
  // Create a new task FormGroup
  createTask(): FormGroup {
    return this._fb.group({
      title: ['', [Validators.required, Validators.maxLength(25)]], // Title field with validation
      description: ['', [Validators.maxLength(250)]], // Description field with validation
      status: ['', Validators.required], // Status field with validation
      dueDate: ['', [Validators.required, pastDateValidator()]] // Due date field with custom validation
    });
  }

  // Getter for the tasks FormArray
  get tasks(): FormArray {
    return this.taskForm.get('tasks') as FormArray;
  }

  // Add a new task to the FormArray
  addTask() {
    this.tasks.push(this.createTask());
  }

  // Remove a task from the FormArray
  removeTask(index: number) {
    this.tasks.removeAt(index);
  }

  // Submit the form
  onSubmit() {
    if (this.taskForm.valid) {
      const newTasks: Task[] = this.taskForm.value.tasks; // Get the tasks from the form

      // Add each task to the server
      newTasks.forEach((task) => {
        task.id = String(Math.floor(Math.random() * 500) + 1); // Generate a random ID for the task
        this._taskService.addTask(task).subscribe({
          next: () => {
            this._taskService.fetchTasks(); // Refresh the task list
            this.tasks.clear(); // Clear the form
            this.tasks.push(this.createTask()); // Add a new empty task
            this._router.navigateByUrl('/tasks'); // Navigate to the task list
            // Show success notification
            this._notifyService.showNotify('get', 'success', 3000, 'check_circle');
          },
          error: (error) => {
            // Show error notification
            this._notifyService.showNotify('get', 'failed', 3000, 'error');
          },
        });
      });
    }
  }
}
