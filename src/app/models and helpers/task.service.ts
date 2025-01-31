import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../models and helpers/task.model';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../shared/components/loader/loader.component';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://13.232.14.229:50101/tasks'; // Replace with your API endpoint
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient, private _dialog: MatDialog) { }

  fetchTasks(): void {
    this._dialog.open(LoaderComponent);
    this.http
      .get<Task[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.getUserFriendlyErrorMessage(error);
          console.error('Error fetching tasks:', errorMessage);
          return throwError(errorMessage);
        })
      )
      .subscribe((tasks) => this.tasksSubject.next(tasks));
    this._dialog.closeAll()
  }

  // Add task with error handling
  addTask(task: Task): Observable<any> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.getUserFriendlyErrorMessage(error);
        return throwError(errorMessage);
      })
    );
  }

  // Update task with error handling
  updateTask(id: string | number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.getUserFriendlyErrorMessage(error);
        return throwError(errorMessage);
      })
    );
  }

  // Delete task with error handling
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.getUserFriendlyErrorMessage(error);
        return throwError(errorMessage);
      })
    );
  }

  // Helper function to generate user-friendly error messages
  private getUserFriendlyErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.';
    } else if (error.status === 404) {
      return 'The requested resource was not found.';
    } else if (error.status === 500) {
      return 'An internal server error occurred. Please try again later.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }
}
