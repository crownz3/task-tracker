import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../models and helpers/task.service';
import { Task } from '../../models and helpers/task.model';
import { MaterialModule } from '../../models and helpers/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { RouterModule } from '@angular/router';
import { pastDateValidator } from '../../models and helpers/validators';
import { NotificationService } from '../../shared/models and helpers/notify-service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  standalone: true
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];  // Store task data
  displayedColumns: string[] = [""]; // Dynamically set columns
  dataSource!: MatTableDataSource<Task>;  // Data source for table
  editIndex: number | null = null;  // To track task being edited
  onEdit: boolean = false;  // Whether editing a task
  selectedDueDate: string = '';  // Filter for due date
  selectedStatus: string = '';  // Filter for status
  searchFilter: string = '';  // Filter for search text
  editForm!: FormGroup;  // Form for editing tasks
  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Paginator for table

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private _notifyService: NotificationService,
    private _dialog: MatDialog
  ) { }

  // Initialize component
  ngOnInit() {
    this.getTask();  // Fetch tasks on load
    this.initializeForm();  // Initialize the edit form
    this.taskService.fetchTasks();  // Fetch tasks from service
  }

  // Initialize the edit form with validation rules
  initializeForm() {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(25)]],
      description: ['', [Validators.maxLength(250)]],
      status: ['', Validators.required],
      dueDate: ['', [Validators.required, pastDateValidator()]]  // Validate date is not in the past
    });
  }

  // Apply filter by status
  applySelectFilter(event: MatSelectChange) {
    const filterValue = event.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();  // Reset to first page after filtering
    }
    this.editIndex = null;
    this.onEdit = false;

  }

  // Apply search filter for task titles
  applySearchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();  // Reset to first page after filtering
    }
    this.editIndex = null;
    this.onEdit = false;

  }

  // Apply date filter
  applyDateFilter(event: any): void {
    const selectedDate = event.value;
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      this.dataSource.filterPredicate = (data, filter) => {
        if (!data.dueDate) return false;
        const dataDate = moment(data.dueDate).format('YYYY-MM-DD');
        return dataDate === filter;
      };
      this.dataSource.filter = formattedDate;
    } else {
      this.dataSource.filter = '';  // Clear date filter
    }
    this.editIndex = null;
    this.onEdit = false;
    console.log(this.dataSource)
  }

  // Format date to 'L' format
  formatDate(date: Date) {
    return moment(date).format('L');
  }

  // Return a true or false to show/hide table
  isTableShown(): boolean {
    return this.dataSource.filteredData.length === 0 ? true : false;
  }

  // Toggle between view and edit mode for a task
  toggleEdit(index: number, task: any): void {
    this.editIndex = this.editIndex === index ? null : index;
    this.onEdit = true;
    if (this.editIndex !== null) {
      this.editForm.patchValue({
        title: task.title,
        description: task.description,
        dueDate: new Date(task.dueDate).toISOString().split('T')[0],
        status: task.status,
      });
    }
  }

  // Cancel editing and reset form
  cancelEdit() {
    this.editIndex = null;
    this.onEdit = false;
    this.editForm.reset();
  }

  // Populate table with task data
  populateTable() {
    this.dataSource = new MatTableDataSource(this.tasks);
    this.dataSource.paginator = this.paginator;
  }

  // Reset all filters
  resetFilter(): void {
    this.dataSource.filter = '';
    this.selectedDueDate = '';
    this.selectedStatus = '';
    this.searchFilter = '';
    this.populateTable();  // Refresh table after resetting filters
  }

  // Fetch tasks from the service
  getTask(): void {
    this.taskService.tasks$.subscribe({
      next: (tasks) => {
        this.tasks = tasks;  // Set tasks from response
        this.populateTable();  // Populate table
        this._notifyService.showNotify('get', 'success', 3000, 'check_circle');  // Show success notification
      },
      error: (error) => {
        this._notifyService.showNotify('get', 'failed', 3000, 'error');  // Show error notification
      }
    });
  }

  // Edit task
  editTask(index: number) {
    if (this.editForm.valid) {
      this._dialog.open(LoaderComponent);  // Open loading indicator
      const updatedTask = { ...this.dataSource.data[index], ...this.editForm.value };
      this.taskService.updateTask(updatedTask.id, updatedTask).subscribe({
        next: () => {
          this.taskService.fetchTasks();  // Refetch tasks after update
          this.cancelEdit();  // Cancel edit mode
          this._notifyService.showNotify('edit', 'success', 3000, 'check_circle');  // Show success notification
        },
        error: (err) => {
          this._notifyService.showNotify('edit', 'failed', 3000, 'error');  // Show error notification
        },
      });
      this._dialog.closeAll();  // Close loading indicator
    }
  }

  // Delete task
  deleteTask(taskId: number) {
    this._dialog.open(LoaderComponent);  // Open loading indicator
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.taskService.fetchTasks();  // Refetch tasks after delete
        this.editIndex = null;
        this._notifyService.showNotify('delete', 'success', 3000, 'check_circle');  // Show success notification
      },
      error: (error) => {
        this._notifyService.showNotify('delete', 'failed', 3000, 'error');  // Show error notification
      }
    });
    this._dialog.closeAll();  // Close loading indicator
  }
}
