import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root',
})

export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchTasks() {
    this.http.get<Task[]>(this.apiUrl).subscribe((tasks) => this.tasksSubject.next(tasks));
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
