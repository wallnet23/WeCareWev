import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { PopupDialogService } from '../../../services/popup-dialog.service';

@Component({
  selector: 'app-system-new',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './system-new.component.html',
  styleUrl: './system-new.component.scss'
})
export class SystemNewComponent {

  isValid: boolean = true;

  newSystemForm = this.formBuilder.group({
    title: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('')
  })

  constructor(private formBuilder: FormBuilder, private router: Router, 
    private connectServerService: ConnectServerService, private popupDialogService: PopupDialogService) {}

  sendNewSystem() {
    const title  = this.newSystemForm.get('title')?.value;
    const description = this.newSystemForm.get('description')?.value;
    this.connectServerService.postRequest<ApiResponse<{id: number}>>(Connect.urlServerLaraApi, 'system/newSystem',
       {
        title: title,
        description: description
      })
    .subscribe((val: ApiResponse<{id: number}>) => {
      if(val.data) {
        this.popupDialogService.alertElement(val);
        this.router.navigate(['/systemOverview', val.data.id]);
      }
    })
    //SAVE THE FORM
  }
}
