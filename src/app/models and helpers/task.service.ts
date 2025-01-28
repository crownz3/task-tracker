import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../models and helpers/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks'; // Replace with your API endpoint
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) { }

  fetchTasks(): void {
    this.http.get<Task[]>(this.apiUrl).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to fetch tasks. Try again later.'));
      })
    ).subscribe({
      next: (tasks) => {
        this.tasksSubject.next(tasks);
      },
      error: (err) => {
        console.error('Error in subscription:', err.message);
      },
    });
  }

  addTask(task: Task) {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to add task. Try again later.'));
      })
    );
  }

  updateTask(id: number, task: Task) {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to update task. Try again later.'));
      })
    );
  }

  deleteTask(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to delete task. Try again later.'));
      })
    );
  }
}
