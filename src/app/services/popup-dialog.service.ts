import { Injectable, inject } from '@angular/core';
import { ApiResponse, ObjButtonPopup } from '../interfaces/api-response';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopupDialogComponent } from '../components/popup-dialog/popup-dialog.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PopupDialogService {

  private isPopupVisible = false;
  readonly router = inject(Router);
  constructor(private toastr: ToastrService, public dialog: MatDialog) { }

  alertElement(obj_val: ApiResponse<any>) {
    if (this.isPopupVisible) {
      // console.log('Un popup è già visibile.');
      return;
    }
    this.isPopupVisible = true;

    // console.log('dentro: ', obj_val);
    if (obj_val.type_alert && obj_val.type_alert === 1) {
      this.toastDialog(obj_val);
      this.isPopupVisible = false;
    } else {
      this.popupDialog(obj_val);
      this.isPopupVisible = false;
    }
  }

  private popupDialog(obj_val: ApiResponse<any>) {
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      panelClass: 'modal_popup',
      data: {
        obj: obj_val
      }
    });

    dialogRef.afterClosed().subscribe(
      (result: ObjButtonPopup) => {
        // console.log('Dialog result:', result);
        if (result && result.action === 1) {
          if (result.action_type === 1) {
            const array_router = [result.urlfront];
            if (result.urlparam && result.urlparam != null) {
              array_router.push(result.urlparam);
            }
            this.router.navigate(array_router);
          } else if (result.action_type === 2) {
            if (typeof result.run_function === 'function') {
              result.run_function();
            }
          }
        }
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
    } else if (obj_val.code == 513 || obj_val.code == 511 || obj_val.code == 240) {
      obj_toast = this.toastr.warning(obj_val.message, obj_val.title, config);
    } else if (obj_val.code == 244) {

    } else {
      obj_toast = this.toastr.error(obj_val.message, obj_val.title, config);
    }
    // if (obj_toast) {
    //   obj_toast.onHidden.subscribe(
    //     (val) => {
    //       console.log(val);
    //     }
    //   )
    // }
  }

  public popUpDialogConfirm(obj_val: ApiResponse<any>): MatDialogRef<PopupDialogComponent> {
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      panelClass: 'modal_popup',
      data: {
        obj: obj_val
      }
    });
    return dialogRef;
  }
}
