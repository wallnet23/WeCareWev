import { Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PopupDialogComponent } from '../components/popup-dialog/popup-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class PopupDialogService {

  constructor(private toastr: ToastrService, public dialog: MatDialog) { }

  alertElement(obj_val: ApiResponse<any>) {
    if (obj_val.type_alert && obj_val.type_alert === 1) {
      this.toastDialog(obj_val);
    }else{
      this.popupDialog(obj_val);
    }
  }

  private popupDialog(obj_val: ApiResponse<any>) {
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      panelClass: 'modal_popup',
      data: {
        obj: obj_val
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  private toastDialog(obj_val: ApiResponse<any>) {
    // ricevuto
    const obj_toastrecive = obj_val.obj_toast;
    // creo
    let obj_toast: null | ActiveToast<any> = null;
    const config = {
      closeButton: true,
      // se true non va via da solo il toast
      disableTimeOut: false,
    };
    if (obj_toastrecive) {
      if (obj_toastrecive.closeButton) {
        config.closeButton = obj_toastrecive.closeButton === 1 ? true : false;
      }
      if (obj_toastrecive.disableTimeOut) {
        config.disableTimeOut = obj_toastrecive.disableTimeOut === 1 ? true : false;
      }
    }
    if (obj_val.code == 200) {
      obj_toast = this.toastr.success(obj_val.message, obj_val.title, config);
    } else if (obj_val.code == 511) {
      obj_toast = this.toastr.warning(obj_val.message, obj_val.title, config);
    } else {
      obj_toast = this.toastr.error(obj_val.message, obj_val.title, config);
    }
    if (obj_toast) {
      obj_toast.onHidden.subscribe(
        (val) => {
          console.log(val);
        }
      )
    }
  }
}
