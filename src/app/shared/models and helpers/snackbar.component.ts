import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-snackbar',
  template: `
    <div class="snackbar-content snackbar-style">
      <div class="p-2  me-2 align-items-center d-flex justify-content-center rounded-5 bg-black">
        <mat-icon class="m-0">{{ data.icon }}</mat-icon>
      </div>
      <div style="background-color: var(--light-color-2); color: var(--text-color);" class='fw-semibold px-3  py-1 rounded-pill'>
        <span>{{ data.message }}</span>
      </div>
      <button (click)="close()" mat-stroked-button style='color:#ecf0ff' class="ms-2">Close</button>
    </div>
  `,
  styles: [`
    .snackbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--light-color-2);
    }

    .snackbar-content mat-icon {
      margin-right: 8px;
    }

  `],
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
})
export class SnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, private snackBarRef: MatSnackBarRef<SnackbarComponent>) { }

  close() {
    this.snackBarRef.dismiss();
  }
}
