import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiResponse, ObjButtonPopup } from '../../interfaces/api-response';
import { TranslateService } from '@ngx-translate/core';

interface DialogData {
  obj: ApiResponse<any>
}

@Component({
  selector: 'app-popup-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButton],
  templateUrl: './popup-dialog.component.html',
  styleUrl: './popup-dialog.component.scss'
})
export class PopupDialogComponent {
  title = '???';
  descrizione = ':(';
  buttonStylePopup = 'btn btn-danger';
  bgStylePopup = 'bg-danger bg-opacity-25 border-bottom border-1 border-danger';
  label_buttonClose = 'Close';
  label_buttonAction = 'Go';

  obj_buttonAction!: ObjButtonPopup;
  obj_buttonClose!: ObjButtonPopup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<PopupDialogComponent>, private translate: TranslateService) {
      this.translate.get(['POPUP.BUTTON.CLOSE', 'POPUP.BUTTON.GO']).subscribe(translations => {
        this.label_buttonClose = translations['POPUP.BUTTON.CLOSE'];  // Usa la traduzione per 'Close'
        this.label_buttonAction = translations['POPUP.BUTTON.GO'];    // Usa la traduzione per 'Go'
        this.setValuePopup(data.obj);
      });


  }


  setValuePopup(obj_request: ApiResponse<any>) {
    if (obj_request.obj_dialog) {
      const obj_dialogrecive = obj_request.obj_dialog;
      this.dialogRef.disableClose = obj_dialogrecive.disableClose === 1 ? true : false;
      if (obj_dialogrecive.obj_buttonClose) {
        this.label_buttonClose = obj_dialogrecive.obj_buttonClose.label;
        this.obj_buttonClose = obj_dialogrecive.obj_buttonClose;
      }
      if (obj_dialogrecive.obj_buttonAction) {
        this.label_buttonAction = obj_dialogrecive.obj_buttonAction.label;
        this.obj_buttonAction = obj_dialogrecive.obj_buttonAction;
      }
    }

    if (obj_request.code == 513 || obj_request.code == 511 || obj_request.code == 240) {
      this.buttonStylePopup = 'btn btn-warning';
      this.bgStylePopup = 'bg-warning bg-opacity-25 border-bottom border-1 border-warning';
    } else if (obj_request.code == 244) {
      this.buttonStylePopup = 'btn btn-info';
      this.bgStylePopup = 'bg-primary bg-opacity-25 border-bottom border-1 border-primary';
    } else if (obj_request.code == 200) {
      this.buttonStylePopup = 'btn btn-success';
      this.bgStylePopup = 'bg-success bg-opacity-25 border-bottom border-1 border-success';
    }
    this.title = obj_request.title;
    this.descrizione = obj_request.message;
  }


  buttonClose() {
    this.dialogRef.close(this.obj_buttonClose);
  }
  buttonAction() {
    this.dialogRef.close(this.obj_buttonAction);
  }
}
