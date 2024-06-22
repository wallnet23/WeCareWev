import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiResponse, ObjButtonClose } from '../../interfaces/api-response';

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
  label_buttonClose = 'Close';

  obj_buttonClose!: ObjButtonClose;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<PopupDialogComponent>,) {
    this.setValuePopup(data.obj);
  }


  setValuePopup(obj_request: ApiResponse<any>) {
    if (obj_request.obj_dialog) {
      const obj_dialogrecive = obj_request.obj_dialog;
      this.dialogRef.disableClose = obj_dialogrecive.disableClose === 1 ? true : false;
      if(obj_dialogrecive.obj_buttonClose){
        this.label_buttonClose = obj_dialogrecive.obj_buttonClose.label;
        this.obj_buttonClose = obj_dialogrecive.obj_buttonClose;
      }
    }

    if (obj_request.code == 513 || obj_request.code == 511 || obj_request.code == 240) {
      this.buttonStylePopup = 'btn btn-warning';
    } else if (obj_request.code == 200) {
      this.buttonStylePopup = 'btn btn-success';
    }
    this.title = obj_request.title;
    this.descrizione = obj_request.message;
  }


  closeButtonDialog() {
    console.log('pippo');
    this.dialogRef.close(this.obj_buttonClose);
  }
}
