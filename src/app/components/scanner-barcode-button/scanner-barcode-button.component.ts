import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScannerModalComponent } from './scanner-modal/scanner-modal.component';

@Component({
  selector: 'app-scanner-barcode-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scanner-barcode-button.component.html',
  styleUrl: './scanner-barcode-button.component.scss'
})
export class ScannerBarcodeButtonComponent {
  barcode = '';

  @Output() barcodeScanned: EventEmitter<string> = new EventEmitter<string>();

  // onChange: any = () => { };
  // onTouched: any = () => { };

  constructor() { }

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(ScannerModalComponent, {
      width: '90%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.barcode) {
        this.barcode = result.barcode;
        // console.log(this.barcode);
        this.barcodeScanned.emit(this.barcode);
      }
    });
  }
}
