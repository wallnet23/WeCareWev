import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  cover: string = '';
  images: string[] = [];
  limitReached: string = 'Limite di immagini per scheda raggiunto';
  unacceptableFile: string = 'Inserimento di un file non ammesso';
  success: string = '';


  constructor() { }

  upload(event: any, uploadCallback: () => void) {
    const files: FileList = event.target.files;
    if (this.images.length < 20) {
      if (files.length > 0) {
        const file: File = files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl: string = reader.result as string;
          this.images.push(imageUrl);
          if (this.cover == '') {
            this.cover = imageUrl;
          }
          uploadCallback();
        };
        reader.readAsDataURL(file);
        return this.success;
      }
      return this.unacceptableFile;
    }
    else return this.limitReached;
  }

  getCover() {
    return this.cover;
  }

  getImages() {
    return this.images;
  }

  setImages(imgs: string[]) {
    this.images = imgs;
  }

  deleteImg(index: number, deleteCallback: () => void) {
    this.images.splice(index, 1);
    deleteCallback();
  }

  deleteCover(coverIndex: number | null, deleteCallback: () => void) {
    if(coverIndex != null) {
      this.images.splice(coverIndex, 1);
      if(this.images.length > 0) {
        this.cover = this.images[0];
      }
      else this.cover = '';
    }
    deleteCallback();
  }

  changeCover(index: number, changeCallback: () => void) {
    this.cover = this.images[index];
    changeCallback();
  }

}