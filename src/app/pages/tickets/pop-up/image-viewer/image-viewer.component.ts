import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Image } from '../../../systems/components/interfaces/image';
import { Connect } from '../../../../classes/connect';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss'
})
export class ImageViewerComponent {

  image: Image | null = null;

  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('image') imageEl!: ElementRef<HTMLImageElement>;

  //imageId: number;

  urlServerLaraApiMultimedia = Connect.urlServerLaraMedia;

  currentSrc: SafeUrl = '';
  activeImageIndex: number = 0;
  zoomLevel: number = 1;
  maxZoom: number = 2; // Limite massimo dello zoom
  minZoom: number = 1; // Limite minimo dello zoom

  constructor(@Inject(MAT_DIALOG_DATA) public data: { image: Image }, private route: ActivatedRoute, 
    private router: Router, private dialogRef: MatDialogRef<ImageViewerComponent>) {
    this.image = data.image;
  }

  closeModal() {
    this.dialogRef.close();
  }

  adjustContainerSize(): void {
    const container = this.imageContainer.nativeElement;
    const image = this.imageEl.nativeElement;

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
