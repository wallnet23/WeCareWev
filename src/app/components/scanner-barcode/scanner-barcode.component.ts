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
  isRequestPending = false; // Flag per monitorare lo stato della richiesta
  barcodeResult: string | null = null;
  intervalId: any;

  constraints = {
    video: {
      facingMode: 'environment', // Usa la fotocamera posteriore
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 30, max: 60 } // Frame rate elevato per maggiore nitidezza

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
    } else {
      alert('La fotocamera non è supportata sul tuo dispositivo.');
    }
  }

  private attachVideo(stream: MediaStream) {
    this.videoElement.nativeElement.srcObject = stream;
  }

  stopCamera() {
    const stream = this.videoElement.nativeElement.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    this.isCameraActive = false;
    this.isScanning = false;
    this.isStreamReady = false;
    this.isRequestPending = false;
    clearInterval(this.intervalId);
  }

  private startScanning() {
    if (!this.isCameraActive) {
      alert('La fotocamera non è attiva.');
      return;
    }

    this.isScanning = true;
    this.intervalId = setInterval(() => {
      if (!this.isRequestPending) {
        this.captureAndSend();
      }
    }, 2000); // Cattura un'immagine ogni 2 secondi
  }

  private captureAndSend() {
    const context = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.videoElement.nativeElement, 0, 0, this.videoWidth, this.videoHeight);

    // Migliora l'immagine prima di inviarla
    const imageData = context.getImageData(0, 0, this.videoWidth, this.videoHeight);
    this.applyImageEnhancements(imageData);
    context.putImageData(imageData, 0, 0);

    const dataURL = this.canvas.nativeElement.toDataURL('image/png');
    // Imposta il flag per indicare che la richiesta è in corso
    this.isRequestPending = true;

    this.http.post<any>('https://barcode.wallnet.it/decode',
      { image: dataURL },
      { headers: { 'X-Disable-Spinner': 'true' } }).subscribe(
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
  private applyImageEnhancements(imageData: ImageData) {
    const data = imageData.data;

    // Applica miglioramenti all'immagine
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Converti in scala di grigi
      const gray = (r + g + b) / 3;
      data[i] = data[i + 1] = data[i + 2] = gray;

      // Applica una soglia per evidenziare i contorni
      const threshold = gray > 128 ? 255 : 0; // Soglia a 128
      data[i] = data[i + 1] = data[i + 2] = threshold;
      // Mantieni il canale alfa (trasparenza)
      data[i + 3] = 255; // Opaco
    }
  }
}
