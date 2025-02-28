import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { InViewportDirective } from '../../../directives/in-viewport.directive';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Connect } from '../../../classes/connect';
import { Image } from '../../systems/components/interfaces/image';
import { ApiResponse } from '../../../interfaces/api-response';
import { ConnectServerService } from '../../../services/connect-server.service';
import { SystemInfoPopupComponent } from '../../systems/system-info-popup/system-info-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ticket-new',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatExpansionModule,
    ReactiveFormsModule,
  ],
  templateUrl: './ticket-new.component.html',
  styleUrl: './ticket-new.component.scss'
})
export class TicketNewComponent {

  idsystem: number = 0;
  imageSpaceLeft: boolean = true;
  imagesList: Image[] = [];
  maxImages: number = 10;
  fileList: File[] = [];
  newTicketForm!: FormGroup;
  requestList: { id: number, title: string }[] = [];
  isSmallScreen: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private connectServerService: ConnectServerService,
    private dialog: MatDialog, private route: ActivatedRoute) {
    this.newTicketForm = this.fb.group({
      email: [null],
      request: [null],
      description: [null],
      inverterList: this.fb.array([this.createInverterEmpty()]),
      batteryList: this.fb.array([this.createBatteryEmpty()])
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idsystem = params['idsystem']
      console.log('ID System:', params['idsystem']);
    });
    this.getData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 768) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

  getData() {
    // CHIAMATA AL SERVER. SE PRESENTI INVERTER O BATTERIE CREA LISTE
    const sampleInverters = [
      { id: 1, sn: 'INV-001', selected: 1 },
      { id: 2, sn: 'INV-002', selected: 0 },
      { id: 3, sn: 'INV-003', selected: 0 },
      { id: 1, sn: 'INV-001', selected: 1 },
      { id: 2, sn: 'INV-002', selected: 0 },
      { id: 3, sn: 'INV-003', selected: 0 }
    ];
    this.createInverterList(sampleInverters);

    const sampleBatteries = [
      { id: 10, sn: 'BAT-001', selected: 1 },
      { id: 11, sn: 'BAT-002', selected: 0 },
      { id: 12, sn: 'BAT-003', selected: 0 }
    ];
    this.createBatteryList(sampleBatteries);
  }

  get inverterList(): FormArray {
    return this.newTicketForm.get('inverterList') as FormArray;
  }

  get batteryList(): FormArray {
    return this.newTicketForm.get('batteryList') as FormArray;
  }

  createInverterEmpty() {
    return this.fb.group({
      id: [0],
      sn: [null],
      selected_inverter: [0],
    })
  }

  createBatteryEmpty() {
    return this.fb.group({
      id: [0],
      sn: [null],
      selected_battery: [0],
    })
  }

  createInverter(inverter: any) {
    return this.fb.group({
      id: [inverter.id],
      sn: [inverter.sn],
      selected_inverter: [inverter.selected],
    })
  }

  createBattery(battery: any) {
    return this.fb.group({
      id: [battery.id],
      sn: [battery.sn],
      selected_battery: [battery.sn],
    })
  }

  createInverterList(inverterList: any[]) {
    if (this.inverterList.length > 0) {
      this.inverterList.controls.splice(0, 1);
    }
    inverterList.forEach((inverter) => {
      this.inverterList.push(this.createInverter(inverter));
    })
  }

  createBatteryList(batteryList: any[]) {
    if (this.batteryList.length > 0) {
      this.batteryList.controls.splice(0, 1);
    }
    batteryList.forEach((battery) => {
      this.batteryList.push(this.createBattery(battery));
    })
  }

  createTicket() {
    // CHIAMATA AL SERVER E POI NAVIGA CON L'ID RESTITUITO
    const id = 0
    this.router.navigate(['ticketModify', id], {queryParams: {'idsystem': this.idsystem}})
  }

  systemInfoPopup() {
    const dialogRef = this.dialog.open(SystemInfoPopupComponent, {
      maxWidth: '900px',
      minWidth: '350px',
      maxHeight: '800px',
      width: '90%',
      data: {idsystem: this.idsystem }
    });
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

    goBack() {
      window.history.back();
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
