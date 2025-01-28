import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../models and helpers/task.service';
import { Task } from '../../models and helpers/task.model';
import { MaterialModule } from '../../models and helpers/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [MaterialModule, CommonModule, FormsModule],
  standalone: true

})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  dataSource!: MatTableDataSource<Task>;
  editIndex: number | null = null;
  tempStatus: string = ''
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.getTask()
    this.taskService.fetchTasks();
  }

  applyFilter(event: MatSelectChange) {
    const filterValue = event.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleEdit(index: number) {
    this.editIndex = this.editIndex === index ? null : index;
  }

  cancelEdit() {
    this.editIndex = null;
  }

  populateTable() {
    this.dataSource = new MatTableDataSource(this.tasks)
    this.dataSource.paginator = this.paginator;
  }

  getTask(): void {
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.populateTable()
    });
    console.log(this.taskService.fetchTasks());
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
