import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scanner-barcode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scanner-barcode.component.html',
  styleUrl: './scanner-barcode.component.scss'
})
export class ScannerBarcodeComponent implements OnInit {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;
  @Output() barcodeScanned: EventEmitter<string | null> = new EventEmitter<string | null>();

  videoWidth = 0;
  videoHeight = 0;
  isCameraActive = false;
  isScanning = false;
  isStreamReady = false; // Nuovo stato per tracciare se lo stream è pronto
  barcodeResult: string | null = null;
  intervalId: any;

  constraints = {
    video: {
      facingMode: 'environment', // Usa la fotocamera posteriore
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.startCamera();
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then(this.attachVideo.bind(this))
        .catch(this.handleError);
      this.isCameraActive = true;
      // Avvia la scansione automaticamente
      //  this.startScanning();
    } else {
      alert('La fotocamera non è supportata sul tuo dispositivo.');
    }
  }

  private attachVideo(stream: MediaStream) {
    this.videoElement.nativeElement.srcObject = stream;
  }

  stopCamera() {
    const stream = this.videoElement.nativeElement.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    this.isCameraActive = false;
    this.isScanning = false;
    this.isStreamReady = false;
    clearInterval(this.intervalId);
  }

  private startScanning() {
    if (!this.isCameraActive) {
      alert('La fotocamera non è attiva.');
      return;
    }

    this.isScanning = true;
    this.intervalId = setInterval(() => {
      this.captureAndSend();
    }, 2000); // Cattura un'immagine ogni secondo
  }

  private captureAndSend() {
    const context = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.videoElement.nativeElement, 0, 0, this.videoWidth, this.videoHeight);

    const dataURL = this.canvas.nativeElement.toDataURL('image/png');

    this.http.post<any>('https://barcode.wallnet.it/decode', { image: dataURL }).subscribe(
      response => {
        if (response.success) {
          this.barcodeResult = response.barcode;
          // alert('Codice a barre rilevato: ' + this.barcodeResult);
          this.barcodeScanned.emit(this.barcodeResult);
          // this.stopCamera(); // Interrompe la scansione
        } else {
          //  console.log('Messaggio dal backend:', response.message);
        }
      }
      // ,
      // error => {
      //   console.error('Errore durante la comunicazione con il backend:', error);
      // }
    );
  }

  onCanPlay() {
    this.videoWidth = this.videoElement.nativeElement.videoWidth;
    this.videoHeight = this.videoElement.nativeElement.videoHeight;
    // Indica che lo stream è pronto e avvia la scansione
    this.isStreamReady = true;
    this.startScanning();
  }

  private handleError(error: any) {
    // console.error('Errore nella fotocamera:', error);
    alert('Errore nell\'accesso alla fotocamera.');
  }
}
