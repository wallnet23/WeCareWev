import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ScannerBarcodeComponent } from "../../scanner-barcode/scanner-barcode.component";

@Component({
  selector: 'app-scanner-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    ScannerBarcodeComponent
  ],
  templateUrl: './scanner-modal.component.html',
  styleUrl: './scanner-modal.component.scss'
})
export class ScannerModalComponent {
  barcode: string | null = '';
  private timerId: any; // Timer per chiusura automatica

  @ViewChild(ScannerBarcodeComponent) scannerComponent!: ScannerBarcodeComponent;

  constructor(
    public dialogRef: MatDialogRef<ScannerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Gestisci la chiusura del modale
    this.dialogRef.afterClosed().subscribe(() => {
      this.cleanUp(); // Esegui la pulizia quando il modale viene chiuso
    });
  }

  ngOnInit() {
    this.startAutoCloseTimer(); // Avvia il timer quando il modale viene inizializzato
  }
  onBarcodeScanned(barcode: string | null) {
    this.barcode = barcode;
    this.clearTimer(); // Ferma il timer se un codice è stato trovato
    this.dialogRef.close({ barcode: this.barcode });
  }

  private startAutoCloseTimer() {
    this.timerId = setTimeout(() => {
      this.dialogRef.close({ barcode: null }); // Chiude il modale automaticamente
    }, 20000); // 20 secondi
  }

  private clearTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }

  // Ferma la fotocamera
  private stopCamera() {
    if (this.scannerComponent) {
      this.scannerComponent.stopCamera();
    }
  }

  // Pulizia delle risorse (fotocamera e timer)
  private cleanUp() {
    this.stopCamera(); // Ferma la fotocamera
    this.clearTimer(); // Cancella il timer
  }

}
