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

  upload(files: FileList, uploadCallback: () => void, maxImages: number) {
    const newImages: any = [];
    let imagesAdded = 0;
  
    if (this.images.length + files.length <= maxImages) {
      for (let i = 0; i < files.length; i++) {
        if (this.images.length + newImages.length >= maxImages) {
          break; // Se il limite di immagini viene raggiunto blocca il caricamento di quelle in più
        }
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl: string = reader.result as string;
          newImages.push(imageUrl);
          imagesAdded++;
          if (this.cover == '') {
            this.cover = imageUrl;
          }
          
          if (imagesAdded === files.length || this.images.length + newImages.length === maxImages) {
            this.images = [...this.images, ...newImages];
            uploadCallback();
          }
        };
        reader.readAsDataURL(file);
      }
      return true;
    } else {
      return false;
    }
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