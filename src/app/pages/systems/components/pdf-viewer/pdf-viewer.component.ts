import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Connect } from '../../../../classes/connect';
import { Image } from '../interfaces/image';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss'
})
export class PdfViewerComponent {
  fileId: number = 0;
  currentSrc: SafeResourceUrl | null = null;
  urlServerLaraApiMultimedia = Connect.urlServerLaraMedia;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { file: Image },
    private dialogRef: MatDialogRef<PdfViewerComponent>, private sanitizer: DomSanitizer) {
    //this.isImage = this.checkIfImage(data);

    this.currentSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.urlServerLaraApiMultimedia + data.file.src
    );
    this.fileId = data.file.id;
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
}
