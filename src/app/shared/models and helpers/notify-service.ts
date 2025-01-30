import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarComponent } from './snackbar.component'; // Import Snackbar Component
import { NotificationInterface } from '../../models and helpers/task.model';


@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) { }

  private showNotification(snackData: NotificationInterface) {
    const config: MatSnackBarConfig = {
      duration: snackData.duration || 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      data: {
        message: snackData.message,
        icon: snackData.icon || 'info', // Default icon
      },
    };

    this.snackBar.openFromComponent(SnackbarComponent, config);

  }

  showNotify(apiType: string, apiStatus: string, duration: number, icon: string): void {
    this.showNotification({
      message: apiStatus === 'success' ? `Task ${apiType} successfully` : `Failed to ${apiType} tasks. Please try again later.`,
      duration: duration,
      icon: icon,
    });
  }
}
