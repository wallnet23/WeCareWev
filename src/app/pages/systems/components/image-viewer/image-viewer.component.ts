import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ApiResponse } from '../../../../interfaces/api-response';
import { Connect } from '../../../../classes/connect';
import { Image } from '../interfaces/image';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss'
})
export class ImageViewerComponent {

  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('image') image!: ElementRef<HTMLImageElement>;

  imageId: number;

  urlServerLaraApiMultimedia = Connect.urlServerLaraMedia;

  currentSrc: SafeUrl = '';
  activeImageIndex: number = 0;
  zoomLevel: number = 1;
  maxZoom: number = 2; // Limite massimo dello zoom
  minZoom: number = 1; // Limite minimo dello zoom

  constructor(@Inject(MAT_DIALOG_DATA) public data: { file: Image }, private route: ActivatedRoute, private router: Router,
    private dialogRef: MatDialogRef<ImageViewerComponent>) {
      console.log(data);
    this.currentSrc = data.file.src;
    this.imageId = data.file.id;
  }

  closeModal() {
    this.dialogRef.close();
  }

  adjustContainerSize(): void {
    const container = this.imageContainer.nativeElement;
    const image = this.image.nativeElement;

    // Ottieni le dimensioni dello schermo
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Ottieni le dimensioni scalate dell'immagine
    const scaledWidth = image.offsetWidth * this.zoomLevel;
    const scaledHeight = image.offsetWidth * this.zoomLevel;

    // Ottieni la larghezza attuale del contenitore
    const containerStyles = getComputedStyle(container);
    const currentWidth = parseFloat(containerStyles.width);
    const currentHeight = parseFloat(containerStyles.height);

    // Se l'immagine scalata rientra nello schermo, espandi il contenitore
    if (scaledWidth <= screenWidth) {
      container.style.width = `${scaledWidth}px`;
      container.style.height = `${scaledHeight}px`;
      container.style.overflow = 'hidden';
    } else {
      // Attiva lo scroll solo quando l'immagine supera lo schermo
      container.style.width = `${screenWidth}px`;
      container.style.height = `${screenHeight}px`;
      container.style.overflow = 'auto';
    }

    // console.log('Container Width:', currentWidth);
    // console.log('Container Height:', currentHeight);
  }
}
