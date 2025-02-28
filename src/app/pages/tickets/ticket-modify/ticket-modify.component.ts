import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener, SecurityContext, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { InViewportDirective } from '../../../directives/in-viewport.directive';
import { TicketInfo } from '../interfaces/ticket-info';
import { MatIcon } from '@angular/material/icon';
import { Image } from '../../systems/components/interfaces/image';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../interfaces/api-response';
import { ConnectServerService } from '../../../services/connect-server.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerComponent } from '../pop-up/image-viewer/image-viewer.component';
import { PdfViewerComponent } from '../pop-up/pdf-viewer/pdf-viewer.component';
import { DomSanitizer } from '@angular/platform-browser';
import { SystemInfoPopupComponent } from '../../systems/system-info-popup/system-info-popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from '../../systems/interfaces/step-status';

@Component({
  selector: 'app-ticket-modify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    TranslateModule,
    InViewportDirective
  ],
  templateUrl: './ticket-modify.component.html',
  styleUrl: './ticket-modify.component.scss'
})
export class TicketModifyComponent {

  @ViewChild('bottomAnchor') bottomAnchor!: ElementRef;
  isNewMessage: boolean = false;
  ticketInfo: TicketInfo | null = null;
  isSmallScreen: boolean = false;
  maxImages: number = 10;
  fileList: File[] = [];
  imagesList: Image[] = [];
  acceptedExt: string[] = ['jpg', 'png', 'jpeg'];
  imageSpaceLeft: boolean = true;
  idsystem: number = 0;
  systemStatus: {id: number, name: string, color: string} = {id: 0, name: '', color: ''};
  isAtBottom: boolean = false;
  isAtBottomSm: boolean = false;

  newAttachedFiles: any[] = [];
  newMessageForm = new FormGroup({
    id: new FormControl<number>(0),
    description: new FormControl<string | null>(null),
    date: new FormControl<string | null>(null),
    time: new FormControl<string | null>(null),
  });

  //firstCard: {id: number, description: string, attached: any[], date: string, sender: number}
  messagesList: { id: number, description: string, attached: any[], date: string, sender: number }[] = [];

  constructor(private fb: FormBuilder, private viewportScroller: ViewportScroller,
    private connectServerService: ConnectServerService, private dialog: MatDialog,
    private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idsystem = params['idsystem'];
    });
    this.getStatus();
    this.getData();
    this.updateWindowDimensions();
  }

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    const pageWidth = document.documentElement.scrollWidth;
    
    // Controlla se mancano meno di 200px alla fine della pagina
    this.isAtBottom = ((pageHeight - scrollPosition) < 120) && pageWidth > 767;
    this.isAtBottomSm = ((pageHeight - scrollPosition) < 160) && pageWidth <= 767;
  }

  updateWindowDimensions() {
    if (window.innerWidth < 768) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

  private scrollToTop(): void {
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBack() {
    this.router.navigate(['systemOverview', this.idsystem]);
  }

  newMessage(): void {
    this.isNewMessage = true;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const timeStr = now.toTimeString().split(' ')[0]; // "HH:MM:SS"
    this.newMessageForm.patchValue({
      date: dateStr,
      time: timeStr,
    });
    setTimeout(() => {
      this.bottomAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  getStatus() {
    // console.log("Received 1")
    if (this.idsystem > 0) {
      this.connectServerService.getRequest<ApiResponse<{ status: { id: number, name: string, color: string } }>>
        (Connect.urlServerLaraApi, 'system/systemStatus', { idsystem: this.idsystem })
        .subscribe((val: ApiResponse<{ status: { id: number, name: string, color: string } }>) => {
          if (val.data) {
            this.systemStatus = val.data.status;
          }
        })
    }
  }

  sendMessage() {

  }

  viewImage(img: Image) {
    console.log(img)
    if (img.ext != 'pdf' && this.acceptedExt.includes(img.ext)) {
      const dialogRef = this.dialog.open(ImageViewerComponent, {
        maxWidth: '90%',
        minWidth: '350px',
        maxHeight: '90%',
        data: { image: img }
      });
    }
    else if (img.ext == 'pdf') {
      const dialogRef = this.dialog.open(PdfViewerComponent, {
        maxWidth: '700px',
        minWidth: '350px',
        maxHeight: '500px',
        data: { pdf: img }
      });
    }
    else {
      const urlString = this.sanitizer.sanitize(SecurityContext.URL, img.src);
      const newTab = window.open(urlString!, "_blank");
    }
  }

  systemInfoPopup() {
    //console.log("IDSYSTEM", this.idsystem)
    const dialogRef = this.dialog.open(SystemInfoPopupComponent, {
      maxWidth: '900px',
      minWidth: '350px',
      maxHeight: '800px',
      width: '90%',
      data: { idsystem: this.idsystem }
    });
  }

  getData() {
    this.ticketInfo = {
      id: 123,
      progressive: "001",
      openingDate: "2023-04-10T12:00:00Z",
      description: "Richiesta di assistenza",
      requestType: "Assistenza",
      email: "example@example.com",
      attachedFiles: [{ id: 1, src: 'wecoW.jpg', ext: 'jpg', folder: '', title: '' }],
      inverterList: [
        { id: 1, sn: "INV-001" },
        { id: 2, sn: "INV-002" }
      ],
      batteryList: [
        { id: 10, sn: "BAT-001" },
        { id: 11, sn: "BAT-002" }
      ]
    };

    this.messagesList = [
      {
        id: 1,
        description: "Questo è il primo messaggio",
        attached: [{ id: 0, src: "trial1.jpg", ext: 'jpg' }, { id: 1, src: "trial2.jpeg", ext: 'jpeg' }],
        date: "2023-05-25T14:00:00Z",
        sender: 1
      },
      {
        id: 2,
        description: "Questo è il secondo messaggio senza allegati",
        attached: [{ id: 0, src: "wecoW.jpg", ext: 'jpg' }, { id: 1, src: "profileThumb.jpg" }],
        date: "2023-05-26T09:30:00Z",
        sender: 2
      },
      {
        id: 3,
        description: "Messaggio finale con allegato",
        attached: [{ id: 0, src: "wecoW.jpg", ext: 'jpg' }, { id: 1, src: "profileThumb.jpg" }],
        date: "2023-05-27T16:45:00Z",
        sender: 1
      },
      {
        id: 4,
        description: "Questo è il primo messaggio",
        attached: [{ id: 0, src: "wecoW.jpg", ext: 'jpg' }, { id: 1, src: "profileThumb.jpg", ext: 'jjj' }],
        date: "2023-05-25T14:00:00Z",
        sender: 1
      },
      {
        id: 5,
        description: "Questo è il secondo messaggio senza allegati",
        attached: [],
        date: "2023-05-26T09:30:00Z",
        sender: 2
      },
      {
        id: 6,
        description: "Messaggio finale con allegato",
        attached: [{ id: 0, src: "wecoW.jpg", ext: 'jpg' }, { id: 1, src: "profileThumb.jpg" }],
        date: "2023-05-27T16:45:00Z",
        sender: 1
      }
    ]
  }

  /**
   * Quando si seleziona i file
   * @param event
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.fileList = Array.from(input.files);
      this.uploadFilesServer();
    }
  }
  /**
   * Reset la selezione dei file quando importato
   */
  private resetFileInput() {
    const fileInput = document.getElementById('fileUpload2') as HTMLInputElement;
    fileInput.value = '';
    this.fileList = [];
  }

  private uploadFilesServer() {
    // this.imagesStep2 = this.uploadImageService.getImagesStep2();
    const formData = new FormData();
    formData.append("folder", Connect.FOLDER_STEP_TWO);
    formData.append("size", Connect.FILE_SIZE.toString());
    formData.append("size_string", Connect.FILE_SIZE_STRING);
    //formData.append("idsystem", this.idsystem.toString());
    formData.append("step_position", "2");
    if (this.fileList && this.fileList.length + this.imagesList.length <= this.maxImages) {
      this.fileList.forEach((file, index) => {
        formData.append(`files[]`, file);
      });
      //this.setImages(formData);
      this.imageSpaceLeft = true;
    }
    else {
      this.imageSpaceLeft = false;
    }
  }

  getImages() {
    this.connectServerService.getRequest<ApiResponse<{ listFiles: Image[] }>>(Connect.urlServerLaraApi, 'ticket/filesList',
      {
        //idsystem: this.idsystem,
        //step_position: 2
      })
      .subscribe((val: ApiResponse<{ listFiles: Image[] }>) => {
        if (val.data.listFiles) {
          this.imagesList = val.data.listFiles.map(image => {
            // Chiama ImageLoaderService solo una volta per immagine
            // this.imageLoaderService.getImageWithToken(Connect.urlServerLaraFile + image.src).subscribe(
            //   (safeUrl) => {
            //     image.src = safeUrl; // Assegna l'URL sicuro all'immagine
            //   }
            // );
            return image;
          });
        }
      })
  }

  // setImages(formData: FormData) {
  //   this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/uploadFiles',
  //     formData)
  //     .subscribe((val: ApiResponse<null>) => {
  //       this.popupDialogService.alertElement(val);
  //       this.resetFileInput();
  //       this.getImages();
  //     })
  // }

  // deleteImg(idimage: number) {
  //   this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/deleteFile',
  //     { idsystem: this.idsystem, idimage: idimage })
  //     .subscribe((val: ApiResponse<null>) => {
  //       this.popupDialogService.alertElement(val);
  //       this.getImages();
  //     })
  // }

}
