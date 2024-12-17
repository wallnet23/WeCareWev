import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';


@Component({
  selector: 'app-scanner-selector',
  standalone: true,
  imports: [
    CommonModule
],
  templateUrl: './scanner-selector.component.html',
  styleUrl: './scanner-selector.component.scss'
})
export class ScannerSelectorComponent implements ControlValueAccessor {
  barcode = '';

  @Output() barcodeScanned: EventEmitter<string> = new EventEmitter<string>();

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private elementRef: ElementRef) {}

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '90%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.barcode) {
        this.barcode = result.barcode;
        console.log(this.barcode);
        this.barcodeScanned.emit(this.barcode);
      }
    });
  }

  writeValue(value: any): void {
    this.barcode = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(event: any) {
    this.barcode = event.target.value;
    this.onChange(this.barcode);
    this.onTouched();
  }
  mode: string = "video";

  bShowScanner: boolean = false;

  switchMode(value: string) {
    this.mode = value;
  }

  showScanner(): void {
    this.bShowScanner = true;
  }

  closeScanner(): void {
    this.bShowScanner = false;
  }
}
